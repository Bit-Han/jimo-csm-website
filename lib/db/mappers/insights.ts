import type { InsightDetail, InsightSummary } from "@/lib/types/insight";
import type { InsightCategory } from "@/lib/types/insight";

export interface InsightQueryRow {
	id: string;
	slug: string;
	title: string;
	category: string;
	categoryLabel: string;
	excerpt: string;
	body: string[];
	publishedAt: Date | null;
	readTimeMinutes: number;
	relatedProjectSlug: string | null;
	relatedProjectName: string | null;
	coverImageSrc: string | null;
	coverImageAlt: string;
	seoTitle: string | null;
	seoDescription: string | null;
	publishStatus: string;
}

function formatPublishedAt(date: Date | null): string {
	if (!date) return new Date().toISOString().slice(0, 10);
	return date.toISOString().slice(0, 10);
}

export function mapInsightRowToSummary(row: InsightQueryRow): InsightSummary {
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		category: row.category as InsightCategory,
		categoryLabel: row.categoryLabel,
		excerpt: row.excerpt,
		publishedAt: formatPublishedAt(row.publishedAt),
		readTimeMinutes: row.readTimeMinutes,
		relatedProject: row.relatedProjectSlug
			? {
					slug: row.relatedProjectSlug,
					name: row.relatedProjectName ?? row.relatedProjectSlug,
				}
			: undefined,
		coverImage: {
			src: row.coverImageSrc ?? "",
			alt: row.coverImageAlt,
		},
	};
}

export function mapInsightRowToDetail(row: InsightQueryRow): InsightDetail {
	return {
		...mapInsightRowToSummary(row),
		body: row.body,
	};
}
