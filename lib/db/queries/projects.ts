import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  leads,
  projectAmenities,
  projectCategories,
  projectChecklistItems,
  projectFacts,
  projectMedia,
  projects,
  projectTags,
  projectUnits,
} from "@/lib/db/schema";
import { mapProjectRowToSummary, mapProjectRowToDetail } from "@/lib/db/mappers/project";
import type { Project } from "@/lib/types/project";
import type { ProjectDetail } from "@/lib/types/project-detail";
import type { AdminProjectListRow } from "@/lib/types/admin/project";

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

export async function getAdminProjectEditorState(slug: string) {
  return fetchProjectWithRelations(slug);
}
