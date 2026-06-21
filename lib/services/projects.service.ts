// lib/services/projects.service.ts
import { db } from "@/lib/db";
import { projects, projectUnits, projectGallery, leads } from "@/lib/db/schema";
import { eq, and, ne, ilike, inArray, sql, desc, asc } from "drizzle-orm";
import { slugify, buildPaginationMeta } from "@/lib/utils/helpers";
import type {
	Project,
	ProjectUnit,
	ProjectListItem,
	ProjectDetail,
	PaginationMeta,
	PaginationParams,
} from "@/lib/types";
import type {
	CreateProjectInput,
	UpdateProjectInput,
	CreateProjectUnitInput,
} from "@/lib/validations/projects";

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN OPERATIONS — called from /api/projects/*, always behind auth
// ═══════════════════════════════════════════════════════════════════════════

export type ProjectFilters = {
	search?: string;
	status?: string;
	locationArea?: string;
	type?: string;
};

export async function getProjects(
	filters: ProjectFilters = {},
	pagination: PaginationParams = {},
): Promise<{ data: ProjectListItem[]; meta: PaginationMeta }> {
	const {
		page = 1,
		pageSize = 20,
		sortBy = "updatedAt",
		sortOrder = "desc",
	} = pagination;
	const offset = (page - 1) * pageSize;

	const conditions = [];
	if (filters.search)
		conditions.push(ilike(projects.name, `%${filters.search}%`));
	if (filters.status)
		conditions.push(eq(projects.status, filters.status as Project["status"]));
	if (filters.locationArea)
		conditions.push(ilike(projects.locationArea, `%${filters.locationArea}%`));
	if (filters.type)
		conditions.push(eq(projects.type, filters.type as Project["type"]));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ count }] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(projects)
		.where(where);

	const sortColumn =
		sortBy === "name"
			? projects.name
			: sortBy === "status"
				? projects.status
				: projects.updatedAt;

	const rows = await db
		.select()
		.from(projects)
		.where(where)
		.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn))
		.limit(pageSize)
		.offset(offset);

	const projectIds = rows.map((r) => r.id);
	const leadCounts =
		projectIds.length > 0
			? await db
					.select({
						projectId: leads.projectId,
						count: sql<number>`count(*)::int`,
					})
					.from(leads)
					.where(inArray(leads.projectId, projectIds))
					.groupBy(leads.projectId)
			: [];

	const leadCountMap = Object.fromEntries(
		leadCounts.map((l) => [l.projectId, l.count]),
	);

	return {
		data: rows.map((r) => ({ ...r, leadsCount: leadCountMap[r.id] ?? 0 })),
		meta: buildPaginationMeta(count, page, pageSize),
	};
}

export async function getProjectById(
	id: string,
): Promise<ProjectDetail | null> {
	const [project] = await db
		.select()
		.from(projects)
		.where(eq(projects.id, id))
		.limit(1);
	if (!project) return null;

	const units = await db
		.select()
		.from(projectUnits)
		.where(eq(projectUnits.projectId, id))
		.orderBy(asc(projectUnits.orderIndex));

	const gallery = await db
		.select()
		.from(projectGallery)
		.where(eq(projectGallery.projectId, id))
		.orderBy(asc(projectGallery.orderIndex));

	return { ...project, units, gallery };
}

export async function createProject(
	input: CreateProjectInput,
	createdBy: string,
): Promise<Project> {
	const slug = input.slug ?? slugify(input.name);
	const existingSlug = await getProjectBySlug(slug);
	const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;

	const [project] = await db
		.insert(projects)
		.values({ ...input, slug: finalSlug, createdBy, lastEditedBy: createdBy })
		.returning();

	return project;
}

export async function updateProject(
	id: string,
	input: UpdateProjectInput,
	editedBy: string,
): Promise<Project | null> {
	const [updated] = await db
		.update(projects)
		.set({ ...input, lastEditedBy: editedBy, updatedAt: new Date() })
		.where(eq(projects.id, id))
		.returning();

	return updated ?? null;
}

export async function deleteProject(id: string): Promise<void> {
	await db.delete(projects).where(eq(projects.id, id));
}

// ── Units ─────────────────────────────────────────────────────────────────

export async function getProjectUnits(
	projectId: string,
): Promise<ProjectUnit[]> {
	return db
		.select()
		.from(projectUnits)
		.where(eq(projectUnits.projectId, projectId))
		.orderBy(asc(projectUnits.orderIndex));
}

export async function createProjectUnit(
	projectId: string,
	input: CreateProjectUnitInput,
): Promise<ProjectUnit> {
	const [unit] = await db
		.insert(projectUnits)
		.values({ ...input, projectId })
		.returning();
	return unit;
}

export async function updateProjectUnit(
	unitId: string,
	input: Partial<CreateProjectUnitInput>,
): Promise<ProjectUnit | null> {
	const [updated] = await db
		.update(projectUnits)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(projectUnits.id, unitId))
		.returning();
	return updated ?? null;
}

export async function deleteProjectUnit(unitId: string): Promise<void> {
	await db.delete(projectUnits).where(eq(projectUnits.id, unitId));
}

export async function reorderProjectUnits(
	updates: Array<{ id: string; orderIndex: number }>,
): Promise<void> {
	await Promise.all(
		updates.map(({ id, orderIndex }) =>
			db
				.update(projectUnits)
				.set({ orderIndex })
				.where(eq(projectUnits.id, id)),
		),
	);
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC OPERATIONS — called directly from Server Components on the
// marketing site, no auth, never go through /api/*
// ═══════════════════════════════════════════════════════════════════════════

export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const [project] = await db
		.select()
		.from(projects)
		.where(eq(projects.slug, slug))
		.limit(1);
	return project ?? null;
}

export type PublicProjectFilters = { listingType?: "for_sale" | "for_rent" };

export async function getPublishedProjects(
	filters: PublicProjectFilters = {},
): Promise<Project[]> {
	const conditions = [ne(projects.status, "draft")];
	if (filters.listingType)
		conditions.push(eq(projects.listingType, filters.listingType));
	return db
		.select()
		.from(projects)
		.where(and(...conditions))
		.orderBy(desc(projects.createdAt));
}

export async function getSimilarProjects(
	currentProjectId: string,
	locationArea: string,
	limit = 3,
): Promise<Project[]> {
	return db
		.select()
		.from(projects)
		.where(and(ne(projects.id, currentProjectId), ne(projects.status, "draft")))
		.orderBy(
			sql`CASE WHEN ${projects.locationArea} = ${locationArea} THEN 0 ELSE 1 END`,
			desc(projects.createdAt),
		)
		.limit(limit);
}
