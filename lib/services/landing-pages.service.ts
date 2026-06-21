// lib/services/landing-pages.service.ts
import { db } from "@/lib/db";
import { landingPages, leads } from "@/lib/db/schema";
import { eq, ilike, sql, desc, and } from "drizzle-orm";
import { slugify, buildPaginationMeta } from "@/lib/utils/helpers";
import type { LandingPage, PaginationParams, PageSection } from "@/lib/types";

export type LandingPageFilters = {
	search?: string;
	status?: string;
	type?: string;
};

// Default section structure for a new landing page
const DEFAULT_SECTIONS: PageSection[] = [
	{
		id: "hero",
		type: "hero",
		label: "Hero",
		visible: true,
		orderIndex: 0,
		config: {},
	},
	{
		id: "project_facts",
		type: "project_facts",
		label: "Project Facts",
		visible: true,
		orderIndex: 1,
		config: {},
	},
	{
		id: "investment_benefits",
		type: "investment_benefits",
		label: "Investment Benefits",
		visible: true,
		orderIndex: 2,
		config: {},
	},
	{
		id: "unit_pricing",
		type: "unit_pricing",
		label: "Unit Pricing",
		visible: true,
		orderIndex: 3,
		config: {},
	},
	{
		id: "gallery",
		type: "gallery",
		label: "Gallery",
		visible: false,
		orderIndex: 4,
		config: {},
	},
	{
		id: "brochure_download",
		type: "brochure_download",
		label: "Brochure Download",
		visible: true,
		orderIndex: 5,
		config: {},
	},
	{
		id: "register_interest_form",
		type: "register_interest_form",
		label: "Register Interest Form",
		visible: true,
		orderIndex: 6,
		config: {},
	},
	{
		id: "faq",
		type: "faq",
		label: "FAQ",
		visible: false,
		orderIndex: 7,
		config: {},
	},
];

export async function getLandingPages(
	filters: LandingPageFilters = {},
	pagination: PaginationParams = {},
) {
	const { page = 1, pageSize = 25 } = pagination;
	const offset = (page - 1) * pageSize;

	const conditions = [];
	if (filters.search)
		conditions.push(ilike(landingPages.title, `%${filters.search}%`));
	if (filters.status)
		conditions.push(
			eq(landingPages.status, filters.status as LandingPage["status"]),
		);
	if (filters.type)
		conditions.push(eq(landingPages.type, filters.type as LandingPage["type"]));

	const where = conditions.length ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(landingPages)
		.where(where);

	const rows = await db.query.landingPages.findMany({
		where,
		with: { project: { columns: { name: true } } },
		orderBy: [desc(landingPages.updatedAt)],
		limit: pageSize,
		offset,
	});

	// Add leads count per landing page
	const ids = rows.map((r) => r.id);
	const leadCounts =
		ids.length > 0
			? await db
					.select({
						landingPageId: leads.landingPageId,
						count: sql<number>`count(*)::int`,
					})
					.from(leads)
					.where(
						sql`landing_page_id = ANY(ARRAY[${sql.join(
							ids.map((id) => sql`${id}::uuid`),
							sql`, `,
						)}])`,
					)
					.groupBy(leads.landingPageId)
			: [];

	const countMap = Object.fromEntries(
		leadCounts.map((l) => [l.landingPageId, l.count]),
	);

	return {
		data: rows.map((r) => ({ ...r, leadsCount: countMap[r.id] ?? 0 })),
		meta: buildPaginationMeta(total, page, pageSize),
	};
}

export async function getLandingPageById(id: string) {
	return (
		db.query.landingPages.findFirst({
			where: eq(landingPages.id, id),
			with: {
				project: { columns: { id: true, name: true, slug: true } },
				form: true,
			},
		}) ?? null
	);
}

export async function createLandingPage(
	input: {
		title: string;
		type: LandingPage["type"];
		projectId?: string;
		campaignType?: string;
		audience?: string;
		crmTag?: string;
		formId?: string;
		metaTitle?: string;
		metaDescription?: string;
		focusKeyword?: string;
		hubspotListId?: string;
	},
	createdBy: string,
): Promise<LandingPage> {
	const slug = slugify(input.title);
	const existing = await db
		.select({ id: landingPages.id })
		.from(landingPages)
		.where(eq(landingPages.slug, slug))
		.limit(1);
	const finalSlug = existing.length
		? `${slug}-${Date.now().toString(36)}`
		: slug;

	const [page] = await db
		.insert(landingPages)
		.values({
			...input,
			slug: finalSlug,
			sections: DEFAULT_SECTIONS,
			status: "draft",
			createdBy,
		})
		.returning();

	return page;
}

export async function updateLandingPage(
	id: string,
	input: Partial<
		Parameters<typeof createLandingPage>[0] & {
			sections: PageSection[];
			status: LandingPage["status"];
		}
	>,
): Promise<LandingPage | null> {
	const [updated] = await db
		.update(landingPages)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(landingPages.id, id))
		.returning();
	return updated ?? null;
}

export async function deleteLandingPage(id: string): Promise<void> {
	await db.delete(landingPages).where(eq(landingPages.id, id));
}
