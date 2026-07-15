import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { insights } from "@/lib/db/schema";
import {
	mapInsightRowToDetail,
	mapInsightRowToSummary,
} from "@/lib/db/mappers/insights";
import type { InsightDetail, InsightSummary } from "@/lib/types/insight";
import type { AdminArticleListRow } from "@/lib/types/admin/article";

// ─── Public ───────────────────────────────────────────────────────────────

export async function getPublishedInsights(): Promise<InsightSummary[]> {
	const rows = await db.query.insights.findMany({
		where: eq(insights.publishStatus, "published"),
		orderBy: [desc(insights.publishedAt)],
	});
	return rows.map(mapInsightRowToSummary);
}

export async function getPublishedInsightBySlug(
	slug: string,
): Promise<InsightDetail | null> {
	const row = await db.query.insights.findFirst({
		where: eq(insights.slug, slug),
	});
	if (!row) return null;
	return mapInsightRowToDetail(row);
}

export async function getPublishedInsightSlugs(): Promise<string[]> {
	const rows = await db
		.select({ slug: insights.slug })
		.from(insights)
		.where(eq(insights.publishStatus, "published"));
	return rows.map((r) => r.slug);
}

// ─── Admin ────────────────────────────────────────────────────────────────

export async function getAdminArticleRows(): Promise<AdminArticleListRow[]> {
	const rows = await db.query.insights.findMany({
		orderBy: [desc(insights.updatedAt)],
	});

	return rows.map((row) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		categoryLabel: row.categoryLabel,
		relatedProjectName: row.relatedProjectName,
		publishStatus: row.publishStatus as "draft" | "published",
		seoStatus:
			row.seoTitle && row.seoDescription
				? ("good" as const)
				: ("needs-attention" as const),
		seoStatusNote:
			row.seoTitle && row.seoDescription ? "Good" : "Needs attention",
		readTimeMinutes: row.readTimeMinutes,
	}));
}

export async function getAdminArticleEditorState(slug: string) {
	return db.query.insights.findFirst({
		where: eq(insights.slug, slug),
	});
}
