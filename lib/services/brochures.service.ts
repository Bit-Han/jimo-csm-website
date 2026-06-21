// lib/services/brochures.service.ts
import { db } from "@/lib/db";
import { brochures } from "@/lib/db/schema";
import { eq, ilike, sql, desc, and } from "drizzle-orm";
import { buildPaginationMeta } from "@/lib/utils/helpers";
import {
	uploadToCloudinary,
	deleteFromCloudinary,
	getCloudinaryFolder,
} from "@/lib/integrations/cloudinary";
import type { Brochure, PaginationParams } from "@/lib/types";

export type BrochureFilters = {
	search?: string;
	status?: string;
	projectId?: string;
};

export async function getBrochures(
	filters: BrochureFilters = {},
	pagination: PaginationParams = {},
) {
	const { page = 1, pageSize = 25 } = pagination;
	const offset = (page - 1) * pageSize;

	const conditions = [];
	if (filters.search)
		conditions.push(ilike(brochures.title, `%${filters.search}%`));
	if (filters.status)
		conditions.push(eq(brochures.status, filters.status as Brochure["status"]));
	if (filters.projectId)
		conditions.push(eq(brochures.projectId, filters.projectId));

	const where = conditions.length ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(brochures)
		.where(where);

	const rows = await db.query.brochures.findMany({
		where,
		with: { project: { columns: { name: true } } },
		orderBy: [desc(brochures.createdAt)],
		limit: pageSize,
		offset,
	});

	return { data: rows, meta: buildPaginationMeta(total, page, pageSize) };
}

export async function getBrochureById(id: string) {
	return (
		db.query.brochures.findFirst({
			where: eq(brochures.id, id),
			with: { project: { columns: { id: true, name: true } } },
		}) ?? null
	);
}

export async function createBrochure(
	input: {
		title: string;
		projectId?: string;
		gateFormId?: string;
		isGated?: boolean;
		createdBy: string;
	},
	fileBuffer: Buffer,
): Promise<Brochure> {
	const folder = getCloudinaryFolder("brochures");
	const result = await uploadToCloudinary(fileBuffer, {
		folder,
		resourceType: "raw", // PDF is a raw resource in Cloudinary
	});

	const [brochure] = await db
		.insert(brochures)
		.values({
			title: input.title,
			projectId: input.projectId,
			gateFormId: input.gateFormId,
			isGated: input.isGated ?? true,
			status: "draft",
			fileUrl: result.secureUrl,
			cloudinaryPublicId: result.publicId,
			fileSizeMb: Math.round(result.bytes / (1024 * 1024)),
			createdBy: input.createdBy,
		})
		.returning();

	return brochure;
}

export async function updateBrochure(
	id: string,
	input: Partial<Omit<Brochure, "id" | "createdAt">>,
): Promise<Brochure | null> {
	const [updated] = await db
		.update(brochures)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(brochures.id, id))
		.returning();
	return updated ?? null;
}

export async function replaceBrochureFile(
	id: string,
	fileBuffer: Buffer,
): Promise<Brochure | null> {
	const existing = await getBrochureById(id);
	if (!existing) return null;

	// Delete old file from Cloudinary
	if (existing.cloudinaryPublicId) {
		await deleteFromCloudinary(existing.cloudinaryPublicId, "raw");
	}

	const folder = getCloudinaryFolder("brochures");
	const result = await uploadToCloudinary(fileBuffer, {
		folder,
		resourceType: "raw",
	});

	const [updated] = await db
		.update(brochures)
		.set({
			fileUrl: result.secureUrl,
			cloudinaryPublicId: result.publicId,
			fileSizeMb: Math.round(result.bytes / (1024 * 1024)),
			version: (existing.version ?? 1) + 1,
			updatedAt: new Date(),
		})
		.where(eq(brochures.id, id))
		.returning();

	return updated ?? null;
}

export async function deleteBrochure(id: string): Promise<void> {
	const existing = await getBrochureById(id);
	if (existing?.cloudinaryPublicId) {
		await deleteFromCloudinary(existing.cloudinaryPublicId, "raw").catch(
			console.error,
		);
	}
	await db.delete(brochures).where(eq(brochures.id, id));
}

/** Increment the denormalised lead count — called after a brochure lead is created */
export async function incrementBrochureLeadCount(
	brochureId: string,
): Promise<void> {
	await db
		.update(brochures)
		.set({
			leadsCapturedCount: sql`leads_captured_count + 1`,
			updatedAt: new Date(),
		})
		.where(eq(brochures.id, brochureId));
}

export async function getActiveBrochureForProject(
	projectId: string,
): Promise<Brochure | null> {
	const [brochure] = await db
		.select()
		.from(brochures)
		.where(
			and(eq(brochures.projectId, projectId), eq(brochures.status, "active")),
		)
		.limit(1);
	return brochure ?? null;
}