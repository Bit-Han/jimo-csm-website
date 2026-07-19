//

import type {
	InsightBodyBlock,
	InsightDetail,
	InsightSummary,
} from "@/lib/types/insight";

export interface InsightQueryRow {
	id: string;
	slug: string;
	title: string;
	category: string;
	categoryLabel: string;
	excerpt: string;
	body: InsightBodyBlock[];
	publishedAt: Date | null;
	readTimeMinutes: number;
	relatedProjectSlug: string | null;
	relatedProjectName: string | null;
	coverImageSrc: string | null;
	coverImageAlt: string;
	authorId: string | null;
	authorName: string;
	authorAvatarUrl: string | null;
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
		category: row.category,
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
		coverImage: { src: row.coverImageSrc ?? "", alt: row.coverImageAlt },
		author: {
			id: row.authorId,
			name: row.authorName || "Jimo Property Development",
			avatarUrl: row.authorAvatarUrl,
		},
	};
}

export function mapInsightRowToDetail(row: InsightQueryRow): InsightDetail {
	return {
		...mapInsightRowToSummary(row),
		body: Array.isArray(row.body) ? row.body : [],
	};
}