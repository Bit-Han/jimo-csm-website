
//@/lib/db/queries/leads.ts
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
const DB_TIMEOUT_MS = 8000;

// ─── Shared filter builder ────────────────────────────────────────────────
function buildWhere(filters: LeadFilters) {
	const conditions = [];

	if (filters.status && filters.status !== "all") {
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

	try {
		const [rows, countResult] = await Promise.all([
			withQueryTimeout(
				(signal) =>
					db
						.select(LEAD_SELECT)
						.from(leads)
						.leftJoin(projects, eq(leads.projectId, projects.id))
						.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
						.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
						.where(where)
						.orderBy(...orderBy)
						.limit(PAGE_SIZE)
						.offset(offset)
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
			withQueryTimeout(
				(signal) =>
					db.select({ total: count() }).from(leads).where(where).execute({ signal }),
				DB_TIMEOUT_MS,
			),
		]);

		const totalCount = countResult?.[0]?.total ?? 0;

		return {
			rows: rows.map(mapLeadRowToListRow),
			page,
			pageSize: PAGE_SIZE,
			totalCount,
			totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
		};
	} catch (error) {
		console.error("[leads:getPaginatedLeads] Timeout or runtime exception caught:", error);
		return {
			rows: [],
			page,
			pageSize: PAGE_SIZE,
			totalCount: 0,
			totalPages: 1,
		};
	}
}

// ─── Summary stats (Optimized into 1 connection database pass) ──────────────
export async function getLeadSummaryStats(): Promise<LeadSummaryStats> {
	const crmConnected = Boolean(process.env.BREVO_API_KEY);
	const defaultStats: LeadSummaryStats = {
		newLeadsCount: 0,
		newLeadsNote: "Awaiting first contact",
		qualifiedLeadsCount: 0,
		qualifiedLeadsChange: "Total qualified",
		crmConnected,
		crmSyncNote: crmConnected
			? "Brevo connected — use Sync to push or pull contacts"
			: "Add BREVO_API_KEY to connect Brevo",
		totalSynced: 0,
		totalLeads: 0,
	};

	try {
		const result = await withQueryTimeout(
			(signal) =>
				db
					.select({
						totalLeads: count(),
						newLeads: sql<number>`count(case when ${leads.status} = 'new' then 1 end)`,
						qualifiedLeads: sql<number>`count(case when ${leads.status} = 'qualified' then 1 end)`,
						totalSynced: sql<number>`count(case when ${leads.brevoContactId} is not null then 1 end)`,
					})
					.from(leads)
					.execute({ signal }),
			DB_TIMEOUT_MS,
		);

		const stats = result?.[0];

		return {
			...defaultStats,
			newLeadsCount: Number(stats?.newLeads ?? 0),
			qualifiedLeadsCount: Number(stats?.qualifiedLeads ?? 0),
			totalSynced: Number(stats?.totalSynced ?? 0),
			totalLeads: Number(stats?.totalLeads ?? 0),
		};
	} catch (error) {
		console.error("[leads:getLeadSummaryStats] Timeout or runtime exception caught:", error);
		return defaultStats;
	}
}

// ─── Filter dropdown options (cached 60 s) ────────────────────────────────
async function fetchFilterOptionsRaw(): Promise<LeadFilterOptions> {
	try {
		const [projectRows, lpRows] = await Promise.all([
			withQueryTimeout(
				(signal) =>
					db
						.select({ slug: projects.slug, name: projects.name })
						.from(projects)
						.orderBy(asc(projects.name))
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
			withQueryTimeout(
				(signal) =>
					db
						.selectDistinct({
							slug: leads.landingPageSlug,
							title: landingPages.title,
						})
						.from(leads)
						.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
						.where(sql`${leads.landingPageSlug} IS NOT NULL`)
						.orderBy(asc(landingPages.title))
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
		]);

		return {
			projects: projectRows,
			landingPages: lpRows
				.filter((r): r is { slug: string; title: string | null } => r.slug !== null)
				.map((r) => ({ slug: r.slug!, name: r.title ?? r.slug! })),
		};
	} catch (error) {
		console.error("[leads:fetchFilterOptionsRaw] Failure fetching lookup keys:", error);
		return { projects: [], landingPages: [] };
	}
}

export const getLeadFilterOptions = unstable_cache(
	async () => fetchFilterOptionsRaw(),
	["lead-filter-options"],
	{ revalidate: 60, tags: ["leads-filter-options"] },
);

// ─── Assignable admins (cached 5 min) ─────────────────────────────────────
async function fetchAssignableAdminsRaw(): Promise<AssignableAdmin[]> {
	try {
		return await withQueryTimeout(
			(signal) =>
				db
					.select({ id: adminUsers.id, fullName: adminUsers.fullName })
					.from(adminUsers)
					.where(eq(adminUsers.status, "active"))
					.orderBy(asc(adminUsers.fullName))
					.execute({ signal }),
			DB_TIMEOUT_MS,
		);
	} catch (error) {
		console.error("[leads:fetchAssignableAdminsRaw] Query failed:", error);
		return [];
	}
}

export const getAssignableAdmins = unstable_cache(
	async () => fetchAssignableAdminsRaw(),
	["assignable-admins"],
	{ revalidate: 300, tags: ["admin-users"] },
);

// ─── Single lead (request-scoped memoization) ──────────────────────────────
export const getLeadDetail = cache(
	async (id: string): Promise<LeadDetail | null> => {
		try {
			const rows = await withQueryTimeout(
				(signal) =>
					db
						.select(LEAD_SELECT)
						.from(leads)
						.leftJoin(projects, eq(leads.projectId, projects.id))
						.leftJoin(adminUsers, eq(leads.assignedToUserId, adminUsers.id))
						.leftJoin(landingPages, eq(leads.landingPageId, landingPages.id))
						.where(eq(leads.id, id))
						.limit(1)
						.execute({ signal }),
				DB_TIMEOUT_MS,
			);

			if (!rows?.[0]) return null;
			return mapLeadRowToDetail(rows[0]);
		} catch (error) {
			console.error(`[leads:getLeadDetail] Error getting row detail for ID ${id}:`, error);
			return null;
		}
	},
);

// ─── Prev / next navigation (Fixed full-table read and strict Date types) ───
export async function getAdjacentLeadIds(
	id: string,
): Promise<{ prevId: string | null; nextId: string | null }> {
	try {
		const currentLeadResult = await withQueryTimeout(
			(signal) =>
				db.select({ createdAt: leads.createdAt }).from(leads).where(eq(leads.id, id)).limit(1).execute({ signal }),
			DB_TIMEOUT_MS,
		);

		const currentLead = currentLeadResult?.[0];
		if (!currentLead?.createdAt) return { prevId: null, nextId: null };

		const currentTarget: Date = currentLead.createdAt;

		const [prevRow, nextRow] = await Promise.all([
			withQueryTimeout(
				(signal) =>
					db
						.select({ id: leads.id })
						.from(leads)
						.where(sql`${leads.createdAt} < ${currentTarget}`)
						.orderBy(desc(leads.createdAt))
						.limit(1)
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
			withQueryTimeout(
				(signal) =>
					db
						.select({ id: leads.id })
						.from(leads)
						.where(sql`${leads.createdAt} > ${currentTarget}`)
						.orderBy(asc(leads.createdAt))
						.limit(1)
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
		]);

		return {
			prevId: prevRow?.[0]?.id ?? null,
			nextId: nextRow?.[0]?.id ?? null,
		};
	} catch (error) {
		console.error("[leads:getAdjacentLeadIds] Failed calculating offsets:", error);
		return { prevId: null, nextId: null };
	}
}

// ─── Relative Position and Indexing ────────────────────────────────────────
export async function getLeadIndexInfo(
	id: string,
): Promise<{ position: number; total: number }> {
	try {
		const currentLeadResult = await withQueryTimeout(
			(signal) =>
				db
					.select({ createdAt: leads.createdAt })
					.from(leads)
					.where(eq(leads.id, id))
					.limit(1)
					.execute({ signal }),
			DB_TIMEOUT_MS,
		);
		const currentLead = currentLeadResult?.[0];

		if (!currentLead?.createdAt) return { position: 0, total: 0 };

		const [newerCountResult, totalResult] = await Promise.all([
			withQueryTimeout(
				(signal) =>
					db
						.select({ total: count() })
						.from(leads)
						.where(sql`${leads.createdAt} > ${currentLead.createdAt}`)
						.execute({ signal }),
				DB_TIMEOUT_MS,
			),
			withQueryTimeout(
				(signal) =>
					db.select({ total: count() }).from(leads).execute({ signal }),
				DB_TIMEOUT_MS,
			),
		]);

		const newerThanCurrent: number = newerCountResult?.[0]?.total ?? 0;
		const total: number = totalResult?.[0]?.total ?? 0;

		return {
			position: total === 0 ? 0 : newerThanCurrent + 1,
			total,
		};
	} catch (error) {
		console.error("[leads:getLeadIndexInfo] Query timed out:", error);
		return { position: 0, total: 0 };
	}
}

// ─── CSV export rows (used by the server action) ───────────────────────────

export async function getLeadsForCsvExport(filters: LeadFilters = {}) {
	const MAX = 5_000;
	const where = buildWhere(filters);
	const orderBy =
		filters.sort === "oldest"
			? [asc(leads.createdAt)]
			: [desc(leads.createdAt)];

	try {
		const rows = await withQueryTimeout(
			(signal) =>
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
					.limit(MAX + 1)
					.execute({ signal }),
			DB_TIMEOUT_MS,
		);

		const truncated = rows.length > MAX;
		return { rows: truncated ? rows.slice(0, MAX) : rows, truncated };
	} catch (error) {
		console.error(
			"[leads:getLeadsForCsvExport] Bulk download extraction failed safely:",
			error,
		);
		return { rows: [], truncated: false };
	}
}