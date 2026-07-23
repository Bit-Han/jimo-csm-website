// lib/db/queries/landing-pages.ts
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema";
import type { AdminLandingPageListRow, LandingPagePublishStatus } from "@/lib/types/admin/landing-page";

function formatUpdatedAt(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export async function getAdminLandingPageRows(): Promise<AdminLandingPageListRow[]> {
	const rows = await db.query.landingPages.findMany({
		orderBy: [desc(landingPages.updatedAt)],
		with: {
			linkedProject: { columns: { name: true } },
		},
	});

	return rows.map((row) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		campaignType: row.campaignType,
		audience: row.audience,
		crmTag: row.crmTag,
		linkedProjectName:
		row.linkedProject?.name ?? row.linkedProjectSlug ?? null,
		publishStatus: row.publishStatus as LandingPagePublishStatus,
		updatedAt: formatUpdatedAt(row.updatedAt),
	}));
}

export async function getAdminLandingPageBySlug(slug: string) {
	return db.query.landingPages.findFirst({
		where: eq(landingPages.slug, slug),
	});
}