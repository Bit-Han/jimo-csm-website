


//@lib/db/queries/projects.ts — add these imports at the top
import { and, asc, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	brochures,
	leads,
	projectAmenities,
	projectCategories,
	projectChecklistItems,
	projectFacts,
	projectMedia,
	projects,
	projectTags,
	projectUnits,
	seoConfigs,
} from "@/lib/db/schema";
import { mapProjectRowToSummary, mapProjectRowToDetail } from "@/lib/db/mappers/project";
import type { Project } from "@/lib/types/project";
import type { ProjectDetail } from "@/lib/types/project-detail";
import type { AdminProjectListRow, AdminProjectSummaryStats } from "@/lib/types/admin/project";

// ─── Full project row type (with all relations loaded) ────────────────────

export type ProjectWithRelations = Awaited<
  ReturnType<typeof fetchProjectWithRelations>
>;

async function fetchProjectWithRelations(slug: string) {
  return db.query.projects.findFirst({
    where: eq(projects.slug, slug),
    with: {
      categories: true,
      tags: { orderBy: [asc(projectTags.position)] },
      facts: { orderBy: [asc(projectFacts.position)] },
      units: { orderBy: [asc(projectUnits.position)] },
      checklistItems: { orderBy: [asc(projectChecklistItems.position)] },
      amenities: { orderBy: [asc(projectAmenities.position)] },
      media: { orderBy: [asc(projectMedia.position)] },
    },
  });
}

// ─── Public site queries ──────────────────────────────────────────────────

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await db.query.projects.findMany({
    where: eq(projects.publishStatus, "published"),
    orderBy: [desc(projects.updatedAt)],
    with: {
      categories: true,
      tags: { orderBy: [asc(projectTags.position)] },
    },
  });

  return rows.map(mapProjectRowToSummary);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const rows = await db.query.projects.findMany({
    where: eq(projects.publishStatus, "published"),
    orderBy: [desc(projects.featured), desc(projects.updatedAt)],
    limit,
    with: {
      categories: true,
      tags: { orderBy: [asc(projectTags.position)] },
    },
  });

  return rows.map(mapProjectRowToSummary);
}

export async function getPublishedProjectSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.publishStatus, "published"));

  return rows.map((r) => r.slug);
}

export async function getProjectDetailBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const row = await fetchProjectWithRelations(slug);
  if (!row) return null;
  return mapProjectRowToDetail(row);
}

// ─── Admin queries ────────────────────────────────────────────────────────

export async function getAdminProjectListRows(): Promise<AdminProjectListRow[]> {
	console.info("[admin:getAdminProjectListRows] Loading admin project list");
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      name: projects.name,
      location: projects.location,
      status: projects.status,
      publishStatus: projects.publishStatus,
      updatedAt: projects.updatedAt,
      leadCount: count(leads.id),
    })
    .from(projects)
    .leftJoin(leads, eq(leads.projectId, projects.id))
    .groupBy(projects.id)
    .orderBy(desc(projects.updatedAt));
	console.info(`[admin:getAdminProjectListRows] Loaded ${rows.length} projects`);

  return rows.map((row) => {
    const adminStatus = (() => {
    //   if (row.publishStatus === "draft") return "draft" as const;
      if (row.status === "completed") return "completed" as const;
      if (row.status === "under-development") return "under-development" as const;
      return "under-development" as const;
    })();

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      location: row.location,
      adminStatus,
      startingPrice: "—",
      leads: row.leadCount,
      leadChangePercent: 0,
      lastUpdatedDate: row.updatedAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      lastUpdatedBy: "—",
      publishStatus: row.publishStatus,
    };
  });
}

// ── everything above getAdminProjectListRows stays exactly as it was ──

// ─── New: real summary stats for the three cards at the bottom of the
// Projects admin page — previously mock data. Only published projects
// count toward "missing brochure" / "missing SEO," since those are the
// ones actually visible to the public with a real gap. ─────────────────

export async function getAdminProjectSummaryStats(): Promise<AdminProjectSummaryStats> {
	console.info("[admin:getAdminProjectSummaryStats] Loading admin project summary stats");
	const publishedProjects = await db.query.projects.findMany({
		where: eq(projects.publishStatus, "published"),
		columns: { id: true, slug: true },
	});

	const publishedIds = publishedProjects.map((p) => p.id);
	const publishedSlugs = publishedProjects.map((p) => p.slug);

	const [activeBrochureRows, seoConfigRows, draftCountRows] = await Promise.all([
		publishedIds.length > 0
			? db
					.selectDistinct({ projectId: brochures.projectId })
					.from(brochures)
					.where(
						and(inArray(brochures.projectId, publishedIds), eq(brochures.status, "active")),
					)
			: Promise.resolve([]),
		publishedSlugs.length > 0
			? db
					.select({ pageSlug: seoConfigs.pageSlug })
					.from(seoConfigs)
					.where(
						and(
							eq(seoConfigs.pageType, "project"),
							inArray(seoConfigs.pageSlug, publishedSlugs),
							isNotNull(seoConfigs.metaTitle),
						),
					)
			: Promise.resolve([]),
		db.select({ c: count() }).from(projects).where(eq(projects.publishStatus, "draft")),
	]);

	const withBrochure = new Set(activeBrochureRows.map((r) => r.projectId));
	const withSeo = new Set(seoConfigRows.map((r) => r.pageSlug));
	console.info(
		`[admin:getAdminProjectSummaryStats] Loaded stats for ${publishedIds.length} published and ${draftCountRows[0]?.c ?? 0} draft projects`,
	);

	return {
		missingBrochure: publishedIds.filter((id) => !withBrochure.has(id)).length,
		missingBrochureNote: "Visible projects without a brochure",
		missingSeo: publishedSlugs.filter((slug) => !withSeo.has(slug)).length,
		missingSeoNote: "Missing meta titles/descriptions",
		draftProjects: draftCountRows[0]?.c ?? 0,
		draftProjectsNote: "Not visible on the website",
	};
}

// ── getAdminProjectEditorState at the bottom stays exactly as it was ──

export async function getAdminProjectEditorState(slug: string) {
	console.info(`[admin:getAdminProjectEditorState] Loading project editor state for slug: ${slug}`);
	const project = await fetchProjectWithRelations(slug);
	console.info(
		`[admin:getAdminProjectEditorState] ${project ? "Loaded" : "No project found for"} slug: ${slug}`,
	);
	return project;
}
