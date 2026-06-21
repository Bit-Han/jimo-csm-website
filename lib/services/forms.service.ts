// lib/services/forms.service.ts
import { db } from "@/lib/db";
import { forms, landingPages} from "@/lib/db/schema";
import { eq, ilike, sql, desc, and } from "drizzle-orm";
import { buildPaginationMeta } from "@/lib/utils/helpers";
import type { Form, PaginationParams } from "@/lib/types";
import type { CreateFormInput } from "@/lib/validations/forms";

export type FormFilters = {
	search?: string;
	status?: string;
	type?: string;
};

export async function getForms(
	filters: FormFilters = {},
	pagination: PaginationParams = {},
) {
	const { page = 1, pageSize = 25 } = pagination;
	const offset = (page - 1) * pageSize;

	const conditions = [];
	if (filters.search)
		conditions.push(ilike(forms.title, `%${filters.search}%`));
	if (filters.status)
		conditions.push(eq(forms.status, filters.status as Form["status"]));
	if (filters.type)
		conditions.push(eq(forms.type, filters.type as Form["type"]));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(forms)
		.where(where);

	const rows = await db
		.select()
		.from(forms)
		.where(where)
		.orderBy(desc(forms.createdAt))
		.limit(pageSize)
		.offset(offset);

	// Attach page usage count per form (landing pages + projects using it)
	const formIds = rows.map((r) => r.id);
	const landingPageCounts = formIds.length
		? await db
				.select({
					formId: landingPages.formId,
					count: sql<number>`count(*)::int`,
				})
				.from(landingPages)
				.where(
					sql`form_id = ANY(ARRAY[${sql.join(
						formIds.map((id) => sql`${id}::uuid`),
						sql`, `,
					)}])`,
				)
				.groupBy(landingPages.formId)
		: [];

	const usageMap = Object.fromEntries(
		landingPageCounts.map((l) => [l.formId, l.count]),
	);

	return {
		data: rows.map((r) => ({
			...r,
			pagesCount: usageMap[r.id] ?? 0,
		})),
		meta: buildPaginationMeta(total, page, pageSize),
	};
}

export async function getFormById(id: string): Promise<Form | null> {
	const [form] = await db.select().from(forms).where(eq(forms.id, id)).limit(1);
	return form ?? null;
}

export async function createForm(input: CreateFormInput): Promise<Form> {
	const [form] = await db.insert(forms).values(input).returning();
	return form;
}

export async function updateForm(
	id: string,
	input: Partial<CreateFormInput>,
): Promise<Form | null> {
	const [updated] = await db
		.update(forms)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(forms.id, id))
		.returning();
	return updated ?? null;
}

export async function deleteForm(id: string): Promise<void> {
	await db.delete(forms).where(eq(forms.id, id));
}

export async function getFormByType(type: Form["type"]): Promise<Form | null> {
  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.type, type), eq(forms.status, "active")))
    .limit(1);
  return form ?? null;
}