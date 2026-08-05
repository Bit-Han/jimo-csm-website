// import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
// import { cache } from "react";
// import { unstable_cache } from "next/cache";
// import { db } from "@/lib/db";
// import { adminUsers, landingPages, leads, projects } from "@/lib/db/schema";
// import { mapLeadRowToDetail, mapLeadRowToListRow } from "../mappers/leads";
// import { withQueryTimeout } from "@/lib/utils/with-query-time";
// import type {
// 	AssignableAdmin,
// 	LeadDetail,
// 	LeadFilterOptions,
// 	LeadFilters,
// 	LeadSummaryStats,
// 	PaginatedLeadsResult,
// } from "@/lib/types/admin/lead";

// export const PAGE_SIZE = 25;

// // ─── Shared filter builder ────────────────────────────────────────────────
// // Used by both the paginated list and the CSV export so filter logic
// // is defined exactly once and cannot drift between the two.

// function buildWhere(filters: LeadFilters) {
// 	const conditions = [];

// 	if (filters.status && filters.status !== "all") {
// 		conditions.push(eq(leads.status, filters.status as never));
// 	}
// 	if (filters.source && filters.source !== "all") {
// 		conditions.push(eq(leads.source, filters.source as never));
// 	}
// 	if (filters.projectSlug && filters.projectSlug !== "all") {
// 		conditions.push(eq(leads.projectSlug, filters.projectSlug));
// 	}
// 	if (filters.landingPageSlug && filters.landingPageSlug !== "all") {
// 		conditions.push(eq(leads.landingPageSlug, filters.landingPageSlug));
// 	}
// 	if (filters.search?.trim()) {
// 		// Escape SQL wildcard characters in user input before building the pattern
// 		const safe = filters.search
// 			.trim()
// 			.replace(/%/g, "\\%")
// 			.replace(/_/g, "\\_");
// 		const pattern = `%${safe}%`;
// 		conditions.push(
// 			or(
// 				ilike(leads.fullName, pattern),
// 				ilike(leads.phoneNumber, pattern),
// 				ilike(leads.email, pattern),
// 			),
// 		);
// 	}

// 	return conditions.length > 0 ? and(...conditions) : undefined;
// }

// // ─── Core select columns ──────────────────────────────────────────────────
// // Defined once, used by both the list query and the detail query, so the
// // same join shape is guaranteed in both mappers.

// const LEAD_SELECT = {
// 	id: leads.id,
// 	fullName: leads.fullName,
// 	email: leads.email,
// 	phoneNumber: leads.phoneNumber,
// 	projectSlug: leads.projectSlug,
// 	landingPageSlug: leads.landingPageSlug,
// 	budgetRange: leads.budgetRange,
// 	source: leads.source,
// 	status: leads.status,
// 	enquiryType: leads.enquiryType,
// 	message: leads.message,
// 	notes: leads.notes,
// 	utmSource: leads.utmSource,
// 	utmMedium: leads.utmMedium,
// 	utmCampaign: leads.utmCampaign,
// 	createdAt: leads.createdAt,
// 	updatedAt: leads.updatedAt,
// 	// Joined — null when the related row was deleted or never existed
// 	projectName: projects.name,
// 	assignedToFullName: adminUsers.fullName,
// 	landingPageTitle: landingPages.title,
// };

// // ─── Paginated lead list ──────────────────────────────────────────────────

// export async function getPaginatedLeads(
// 	filters: LeadFilters = {},
// ): Promise<PaginatedLeadsResult> {
// 	const page = Math.max(1, filters.page ?? 1);
// 	const offset = (page - 1) * PAGE_SIZE;
// 	const orderBy =
// 		filters.sort === "oldest"
// 			? [asc(leads.createdAt)]
// 			: [desc(leads.createdAt)];
// 	const where = buildWhere(filters);

// 	const [rows, countResult] = await Promise.all([
// 		withQueryTimeout(
// 			db
// 				.select(LEAD_SELECT)
// 				.from(leads)
// 				.leftJoin(projects, eq(leads.projectId, projects.id))
// 				.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
// 				.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
// 				.where(where)
// 				.orderBy(...orderBy)
// 				.limit(PAGE_SIZE)
// 				.offset(offset),
// 			12000,
// 		),
// 		withQueryTimeout(
// 			db.select({ total: count() }).from(leads).where(where),
// 			12000,
// 		),
// 	]);

// 	const totalCount = countResult[0]?.total ?? 0;

// 	return {
// 		rows: rows.map(mapLeadRowToListRow),
// 		page,
// 		pageSize: PAGE_SIZE,
// 		totalCount,
// 		totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
// 	};
// }

// // ─── Summary stats ────────────────────────────────────────────────────────

// export async function getLeadSummaryStats(): Promise<LeadSummaryStats> {
// 	const [newRows, qualRows, totalRows, syncedRows] = await Promise.all([
// 		withQueryTimeout(
// 			db.select({ n: count() }).from(leads).where(eq(leads.status, "new")),
// 			8000,
// 		),
// 		withQueryTimeout(
// 			db
// 				.select({ n: count() })
// 				.from(leads)
// 				.where(eq(leads.status, "qualified")),
// 			8000,
// 		),
// 		withQueryTimeout(db.select({ n: count() }).from(leads), 8000),
// 		withQueryTimeout(
// 			db
// 				.select({ n: count() })
// 				.from(leads)
// 				.where(sql`${leads.brevoContactId} IS NOT NULL`),
// 			8000,
// 		),
// 	]);

// 	const crmConnected = Boolean(process.env.BREVO_API_KEY);

// 	return {
// 		newLeadsCount: newRows[0]?.n ?? 0,
// 		newLeadsNote: "Awaiting first contact",
// 		qualifiedLeadsCount: qualRows[0]?.n ?? 0,
// 		qualifiedLeadsChange: "Total qualified",
// 		crmConnected,
// 		crmSyncNote: crmConnected
// 			? "Brevo connected — use Sync to push or pull contacts"
// 			: "Add BREVO_API_KEY to connect Brevo",
// 		totalSynced: syncedRows[0]?.n ?? 0,
// 		totalLeads: totalRows[0]?.n ?? 0,
// 	};
// }

// // ─── Filter dropdown options (cached 60 s) ────────────────────────────────
// // Safe to cache briefly — a new project appearing in the dropdown a
// // minute late is harmless; staleness on the actual lead rows is not.

// export const getLeadFilterOptions = unstable_cache(
// 	async (): Promise<LeadFilterOptions> => {
// 		const [projectRows, lpRows] = await Promise.all([
// 			withQueryTimeout(
// 				db
// 					.select({ slug: projects.slug, name: projects.name })
// 					.from(projects)
// 					.orderBy(asc(projects.name)),
// 				8000,
// 			),
// 			// Use the leads table as the source of truth for which landing pages
// 			// have actually generated leads — avoids showing pages with zero leads.
// 			withQueryTimeout(
// 				db
// 					.selectDistinct({
// 						slug: leads.landingPageSlug,
// 						title: landingPages.title,
// 					})
// 					.from(leads)
// 					.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
// 					.where(sql`${leads.landingPageSlug} IS NOT NULL`)
// 					.orderBy(asc(landingPages.title)),
// 				8000,
// 			),
// 		]);

// 		return {
// 			projects: projectRows,
// 			landingPages: lpRows
// 				.filter(
// 					(r): r is { slug: string; title: string | null } => r.slug !== null,
// 				)
// 				.map((r) => ({ slug: r.slug!, name: r.title ?? r.slug! })),
// 		};
// 	},
// 	["lead-filter-options"],
// 	{ revalidate: 60, tags: ["leads-filter-options"] },
// );

// // ─── Assignable admins (cached 5 min) ─────────────────────────────────────
// // Admin roster changes are rare; a deactivated admin is blocked at
// // getAdminUser() before they can act — so brief staleness here is safe.

// export const getAssignableAdmins = unstable_cache(
// 	async (): Promise<AssignableAdmin[]> => {
// 		return withQueryTimeout(
// 			db
// 				.select({ id: adminUsers.id, fullName: adminUsers.fullName })
// 				.from(adminUsers)
// 				.where(eq(adminUsers.status, "active"))
// 				.orderBy(asc(adminUsers.fullName)),
// 			8000,
// 		);
// 	},
// 	["assignable-admins"],
// 	{ revalidate: 300, tags: ["admin-users"] },
// );

// // ─── Single lead (request-scoped memoization, never cross-request cached) ─

// export const getLeadDetail = cache(
// 	async (id: string): Promise<LeadDetail | null> => {
// 		const rows = await withQueryTimeout(
// 			db
// 				.select(LEAD_SELECT)
// 				.from(leads)
// 				.leftJoin(projects, eq(leads.projectId, projects.id))
// 				.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
// 				.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
// 				.where(eq(leads.id, id))
// 				.limit(1),
// 			10000,
// 		);

// 		if (!rows[0]) return null;
// 		return mapLeadRowToDetail(rows[0]);
// 	},
// );

// // ─── Prev / next navigation ────────────────────────────────────────────────

// export async function getAdjacentLeadIds(
// 	id: string,
// ): Promise<{ prevId: string | null; nextId: string | null }> {
// 	const rows = await withQueryTimeout(
// 		db.select({ id: leads.id }).from(leads).orderBy(desc(leads.createdAt)),
// 		10000,
// 	);
// 	const ids = rows.map((r) => r.id);
// 	const idx = ids.indexOf(id);
// 	if (idx === -1) return { prevId: null, nextId: null };
// 	return {
// 		prevId: idx > 0 ? ids[idx - 1]! : null,
// 		nextId: idx < ids.length - 1 ? ids[idx + 1]! : null,
// 	};
// }

// export async function getLeadIndexInfo(
// 	id: string,
// ): Promise<{ position: number; total: number }> {
// 	const [rows, totalResult] = await Promise.all([
// 		withQueryTimeout(
// 			db.select({ id: leads.id }).from(leads).orderBy(desc(leads.createdAt)),
// 			10000,
// 		),
// 		withQueryTimeout(db.select({ total: count() }).from(leads), 10000),
// 	]);
// 	const idx = rows.findIndex((r) => r.id === id);
// 	return {
// 		position: idx === -1 ? 0 : idx + 1,
// 		total: totalResult[0]?.total ?? 0,
// 	};
// }

// // ─── CSV export rows (used by the server action) ───────────────────────────

// export async function getLeadsForCsvExport(filters: LeadFilters = {}) {
// 	const MAX = 5_000;
// 	const where = buildWhere(filters);
// 	const orderBy =
// 		filters.sort === "oldest"
// 			? [asc(leads.createdAt)]
// 			: [desc(leads.createdAt)];

// 	const rows = await withQueryTimeout(
// 		db
// 			.select({
// 				...LEAD_SELECT,
// 				brevoContactId: leads.brevoContactId,
// 			})
// 			.from(leads)
// 			.leftJoin(projects, eq(leads.projectId, projects.id))
// 			.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
// 			.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
// 			.where(where)
// 			.orderBy(...orderBy)
// 			.limit(MAX + 1),
// 		15000,
// 	);

// 	const truncated = rows.length > MAX;
// 	return { rows: truncated ? rows.slice(0, MAX) : rows, truncated };
// }


import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { adminUsers, landingPages, leads, projects } from "@/lib/db/schema";
import { mapLeadRowToDetail, mapLeadRowToListRow } from "../mappers/leads";
import { withQueryTimeout } from "@/lib/utils/with-query-time";
import type {
	AssignableAdmin,
	LeadDetail,
	LeadFilterOptions,
	LeadFilters,
	LeadSummaryStats,
	PaginatedLeadsResult,
} from "@/lib/types/admin/lead";

export const PAGE_SIZE = 25;

// ─── Shared filter builder ────────────────────────────────────────────────
function buildWhere(filters: LeadFilters) {
	const conditions = [];

	if (filters.status && filters.status !== "all") {
		// FIXED: Cast safely to prevent Drizzle/Postgres type errors
		conditions.push(eq(leads.status, filters.status as never));
	}
	if (filters.source && filters.source !== "all") {
		conditions.push(eq(leads.source, filters.source as never));
	}
	if (filters.projectSlug && filters.projectSlug !== "all") {
		conditions.push(eq(leads.projectSlug, filters.projectSlug));
	}
	if (filters.landingPageSlug && filters.landingPageSlug !== "all") {
		conditions.push(eq(leads.landingPageSlug, filters.landingPageSlug));
	}
	if (filters.search?.trim()) {
		const safe = filters.search
			.trim()
			.replace(/%/g, "\\%")
			.replace(/_/g, "\\_");
		const pattern = `%${safe}%`;
		conditions.push(
			or(
				ilike(leads.fullName, pattern),
				ilike(leads.phoneNumber, pattern),
				ilike(leads.email, pattern),
			),
		);
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
}

// ─── Core select columns ──────────────────────────────────────────────────
const LEAD_SELECT = {
	id: leads.id,
	fullName: leads.fullName,
	email: leads.email,
	phoneNumber: leads.phoneNumber,
	projectSlug: leads.projectSlug,
	landingPageSlug: leads.landingPageSlug,
	budgetRange: leads.budgetRange,
	source: leads.source,
	status: leads.status,
	enquiryType: leads.enquiryType,
	message: leads.message,
	notes: leads.notes,
	utmSource: leads.utmSource,
	utmMedium: leads.utmMedium,
	utmCampaign: leads.utmCampaign,
	createdAt: leads.createdAt,
	updatedAt: leads.updatedAt,
	projectName: projects.name,
	assignedToFullName: adminUsers.fullName,
	landingPageTitle: landingPages.title,
};

// ─── Paginated lead list ──────────────────────────────────────────────────
export async function getPaginatedLeads(
	filters: LeadFilters = {},
): Promise<PaginatedLeadsResult> {
	const page = Math.max(1, filters.page ?? 1);
	const offset = (page - 1) * PAGE_SIZE;
	const orderBy =
		filters.sort === "oldest"
			? [asc(leads.createdAt)]
			: [desc(leads.createdAt)];
	const where = buildWhere(filters);

	const [rows, countResult] = await Promise.all([
		withQueryTimeout(
			db
				.select(LEAD_SELECT)
				.from(leads)
				.leftJoin(projects, eq(leads.projectId, projects.id))
				.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
				.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
				.where(where)
				.orderBy(...orderBy)
				.limit(PAGE_SIZE)
				.offset(offset),
			12000,
		),
		withQueryTimeout(
			db.select({ total: count() }).from(leads).where(where),
			12000,
		),
	]);

	const totalCount = countResult[0]?.total ?? 0;

	return {
		rows: rows.map(mapLeadRowToListRow),
		page,
		pageSize: PAGE_SIZE,
		totalCount,
		totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
	};
}

// ─── Summary stats ────────────────────────────────────────────────────────
export async function getLeadSummaryStats(): Promise<LeadSummaryStats> {
	const [newRows, qualRows, totalRows, syncedRows] = await Promise.all([
		withQueryTimeout(
			db.select({ n: count() }).from(leads).where(eq(leads.status, "new")),
			8000,
		),
		withQueryTimeout(
			db
				.select({ n: count() })
				.from(leads)
				.where(eq(leads.status, "qualified")),
			8000,
		),
		withQueryTimeout(db.select({ n: count() }).from(leads), 8000),
		withQueryTimeout(
			db
				.select({ n: count() })
				.from(leads)
				.where(sql`${leads.brevoContactId} IS NOT NULL`),
			8000,
		),
	]);

	const crmConnected = Boolean(process.env.BREVO_API_KEY);

	return {
		newLeadsCount: newRows[0]?.n ?? 0,
		newLeadsNote: "Awaiting first contact",
		qualifiedLeadsCount: qualRows[0]?.n ?? 0,
		qualifiedLeadsChange: "Total qualified",
		crmConnected,
		crmSyncNote: crmConnected
			? "Brevo connected — use Sync to push or pull contacts"
			: "Add BREVO_API_KEY to connect Brevo",
		totalSynced: syncedRows[0]?.n ?? 0,
		totalLeads: totalRows[0]?.n ?? 0,
	};
}

// ─── Filter dropdown options (cached 60 s) ────────────────────────────────
// FIXED: Extracted logic outside of unstable_cache to preserve asynchronous context safely
async function fetchFilterOptionsRaw(): Promise<LeadFilterOptions> {
	const [projectRows, lpRows] = await Promise.all([
		withQueryTimeout(
			db
				.select({ slug: projects.slug, name: projects.name })
				.from(projects)
				.orderBy(asc(projects.name)),
			8000,
		),
		withQueryTimeout(
			db
				.selectDistinct({
					slug: leads.landingPageSlug,
					title: landingPages.title,
				})
				.from(leads)
				.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
				.where(sql`${leads.landingPageSlug} IS NOT NULL`)
				.orderBy(asc(landingPages.title)),
			8000,
		),
	]);

	return {
		projects: projectRows,
		landingPages: lpRows
			.filter(
				(r): r is { slug: string; title: string | null } => r.slug !== null,
			)
			.map((r) => ({ slug: r.slug!, name: r.title ?? r.slug! })),
	};
}

export const getLeadFilterOptions = unstable_cache(
	async () => fetchFilterOptionsRaw(),
	["lead-filter-options"],
	{ revalidate: 60, tags: ["leads-filter-options"] },
);

// ─── Assignable admins (cached 5 min) ─────────────────────────────────────
async function fetchAssignableAdminsRaw(): Promise<AssignableAdmin[]> {
	return withQueryTimeout(
		db
			.select({ id: adminUsers.id, fullName: adminUsers.fullName })
			.from(adminUsers)
			.where(eq(adminUsers.status, "active"))
			.orderBy(asc(adminUsers.fullName)),
		8000,
	);
}

export const getAssignableAdmins = unstable_cache(
	async () => fetchAssignableAdminsRaw(),
	["assignable-admins"],
	{ revalidate: 300, tags: ["admin-users"] },
);

// ─── Single lead (request-scoped memoization) ──────────────────────────────
export const getLeadDetail = cache(
	async (id: string): Promise<LeadDetail | null> => {
		const rows = await withQueryTimeout(
			db
				.select(LEAD_SELECT)
				.from(leads)
				.leftJoin(projects, eq(leads.projectId, projects.id))
				.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
				.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
				.where(eq(leads.id, id))
				.limit(1),
			10000,
		);

		if (!rows[0]) return null;
		return mapLeadRowToDetail(rows[0]);
	},
);

// ─── Prev / next navigation ────────────────────────────────────────────────
export async function getAdjacentLeadIds(
	id: string,
): Promise<{ prevId: string | null; nextId: string | null }> {
	const rows = await withQueryTimeout(
		db.select({ id: leads.id }).from(leads).orderBy(desc(leads.createdAt)),
		10000,
	);
	const ids = rows.map((r) => r.id);
	const idx = ids.indexOf(id);
	if (idx === -1) return { prevId: null, nextId: null };
	return {
		prevId: idx > 0 ? ids[idx - 1]! : null,
		nextId: idx < ids.length - 1 ? ids[idx + 1]! : null,
	};
}

export async function getLeadIndexInfo(
	id: string,
): Promise<{ position: number; total: number }> {
	// FIXED: Resolved broken syntax error from prior cutoff
	const [rows, totalResult] = await Promise.all([
		withQueryTimeout(
			db.select({ id: leads.id }).from(leads).orderBy(desc(leads.createdAt)),
			10000,
		),
		withQueryTimeout(db.select({ total: count() }).from(leads), 10000),
	]);
	const idx = rows.findIndex((r) => r.id === id);
	return {
		position: idx === -1 ? 0 : idx + 1,
		total: totalResult[0]?.total ?? 0,
	};
}

// ─── CSV export rows (used by the server action) ───────────────────────────
export async function getLeadsForCsvExport(filters: LeadFilters = {}) {
	const MAX = 5_000;
	const where = buildWhere(filters);
	const orderBy =
		filters.sort === "oldest"
			? [asc(leads.createdAt)]
			: [desc(leads.createdAt)];

	const rows = await withQueryTimeout(
		db
			.select({
				...LEAD_SELECT,
				brevoContactId: leads.brevoContactId,
			})
			.from(leads)
			.leftJoin(projects, eq(leads.projectId, projects.id))
			.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
			.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
			.where(where)
			.orderBy(...orderBy)
			.limit(MAX + 1),
		15000,
	);

	const truncated = rows.length > MAX;
	return { rows: truncated ? rows.slice(0, MAX) : rows, truncated };
}
