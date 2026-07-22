// lib/db/mappers/insights.ts
import type { JSONContent } from "@tiptap/react";
import type { InsightDetail, InsightSummary } from "@/lib/types/insight";
import { EMPTY_TIPTAP_DOC, isValidTiptapDoc } from "@/lib/utils/tiptap";

export interface InsightQueryRow {
	id: string;
	slug: string;
	title: string;
	category: string;
	categoryLabel: string;
	excerpt: string;
	content: JSONContent;
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
		// Strict shape check — not just "is it an object." Old block-array
		// data from before the body→content migration, or a malformed/empty
		// doc, silently falls back to a valid empty document instead of
		// crashing Tiptap's schema builder.
		content: isValidTiptapDoc(row.content) ? row.content : EMPTY_TIPTAP_DOC,
	};
}