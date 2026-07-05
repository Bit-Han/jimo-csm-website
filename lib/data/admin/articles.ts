import { insights } from "@/lib/data/insights";
import type {
	AdminArticleListRow,
	ArticleEditorState,
	ArticleSeoStatus,
} from "@/lib/types/admin/article";

// Compute SEO status from the insight's own SEO fields.
// TODO (integration stage): read from seo_configs table where pageType = 'insight'
function computeSeoStatus(slug: string): {
	status: ArticleSeoStatus;
	note: string;
} {
	const seoMap: Record<string, { status: ArticleSeoStatus; note: string }> = {
		"why-yaba-is-becoming-premium": {
			status: "good",
			note: "Good",
		},
		"shortlet-vs-hotel-management": {
			status: "needs-attention",
			note: "Needs attention",
		},
		"vatican-court-update": {
			status: "good",
			note: "Good",
		},
	};

	return seoMap[slug] ?? { status: "needs-attention", note: "Needs attention" };
}

// TODO (integration stage):
// db.query.insights.findMany({ orderBy: [desc(insights.updatedAt)] })
export function getAdminArticleRows(): AdminArticleListRow[] {
	return insights.map((insight) => {
		const seo = computeSeoStatus(insight.slug);
		return {
			id: insight.id,
			slug: insight.slug,
			title: insight.title,
			categoryLabel: insight.categoryLabel,
			relatedProjectName: insight.relatedProject?.name ?? null,
			publishStatus:
				insight.slug === "shortlet-vs-hotel-management" ? "draft" : "published",
			seoStatus: seo.status,
			seoStatusNote: seo.note,
			readTimeMinutes: insight.readTimeMinutes,
		};
	});
}

// TODO (integration stage):
// db.query.insights.findFirst({ where: eq(insights.slug, slug) })
export function getArticleEditorState(
	slug: string,
): ArticleEditorState | undefined {
	const insight = insights.find((a) => a.slug === slug);
	if (!insight) return undefined;

	return {
		slug: insight.slug,
		title: insight.title,
		category: insight.category,
		categoryLabel: insight.categoryLabel,
		excerpt: insight.excerpt,
		body: insight.body.length > 0 ? insight.body : [""],
		coverImageSrc: insight.coverImage.src,
		coverImageAlt: insight.coverImage.alt,
		relatedProjectSlug: insight.relatedProject?.slug ?? "",
		relatedProjectName: insight.relatedProject?.name ?? "",
		readTimeMinutes: insight.readTimeMinutes,
		publishedAt: insight.publishedAt,
		seoTitle: `${insight.title} | Jimo Property Development`,
		seoDescription: insight.excerpt.slice(0, 160),
		focusKeyword: "",
		publishStatus:
			insight.slug === "shortlet-vs-hotel-management" ? "draft" : "published",
	};
}
