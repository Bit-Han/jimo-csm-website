// //@lib/types/admin/article.ts
// import type { InsightCategory } from "@/lib/types/insight";

// export type ArticlePublishStatus = "draft" | "published";

// export type ArticleSeoStatus =
// 	| "good"
// 	| "needs-attention"
// 	| "needs-internal-links";

// export interface AdminArticleListRow {
// 	id: string;
// 	slug: string;
// 	title: string;
// 	categoryLabel: string;
// 	relatedProjectName: string | null;
// 	publishStatus: ArticlePublishStatus;
// 	seoStatus: ArticleSeoStatus;
// 	seoStatusNote: string;
// 	readTimeMinutes: number;
// }

// export interface ArticleEditorState {
// 	slug: string;
// 	title: string;
// 	category: InsightCategory;
// 	categoryLabel: string;
// 	excerpt: string;
// 	body: string[];
// 	coverImageSrc: string;
// 	coverImageAlt: string;
// 	relatedProjectSlug: string;
// 	relatedProjectName: string;
// 	readTimeMinutes: number;
// 	publishedAt: string;
// 	seoTitle: string;
// 	seoDescription: string;
// 	focusKeyword: string;
// 	publishStatus: ArticlePublishStatus;
// }

// export type ArticleSaveStatus = "idle" | "saving" | "saved" | "error";

// export const DEFAULT_ARTICLE_STATE: ArticleEditorState = {
// 	slug: "",
// 	title: "",
// 	category: "location-analysis",
// 	categoryLabel: "Location Analysis",
// 	excerpt: "",
// 	body: [""],
// 	coverImageSrc: "",
// 	coverImageAlt: "",
// 	relatedProjectSlug: "",
// 	relatedProjectName: "",
// 	readTimeMinutes: 3,
// 	publishedAt: new Date().toISOString().slice(0, 10),
// 	seoTitle: "",
// 	seoDescription: "",
// 	focusKeyword: "",
// 	publishStatus: "draft",
// };

// export interface ArticleFilterState {
// 	search: string;
// 	status: string;
// 	type: string;
// 	sort: "newest" | "oldest";
// }

import type { InsightBodyBlock, InsightCategory } from "@/lib/types/insight";

export type ArticlePublishStatus = "draft" | "published";
export type ArticleSeoStatus =
	| "good"
	| "needs-attention"
	| "needs-internal-links";

export interface AdminArticleListRow {
	id: string;
	slug: string;
	title: string;
	categoryLabel: string;
	relatedProjectName: string | null;
	publishStatus: ArticlePublishStatus;
	seoStatus: ArticleSeoStatus;
	seoStatusNote: string;
	readTimeMinutes: number;
}

export interface AuthorOption {
	id: string;
	fullName: string;
	avatarUrl: string | null;
	role: string;
}

export interface ArticleEditorState {
	slug: string;
	title: string;
	category: InsightCategory;
	categoryLabel: string;
	excerpt: string;
	body: InsightBodyBlock[];
	coverImageSrc: string;
	coverImageAlt: string;
	relatedProjectSlug: string;
	relatedProjectName: string;
	readTimeMinutes: number;
	publishedAt: string;
	seoTitle: string;
	seoDescription: string;
	focusKeyword: string;
	publishStatus: ArticlePublishStatus;
	authorId: string;
	authorName: string;
	authorAvatarUrl: string;
}

export type ArticleSaveStatus = "idle" | "saving" | "saved" | "error";

export const DEFAULT_ARTICLE_STATE: ArticleEditorState = {
	slug: "",
	title: "",
	category: "",
	categoryLabel: "",
	excerpt: "",
	body: [{ id: "block-initial", type: "paragraph", text: "" }],
	coverImageSrc: "",
	coverImageAlt: "",
	relatedProjectSlug: "",
	relatedProjectName: "",
	readTimeMinutes: 3,
	publishedAt: new Date().toISOString().slice(0, 10),
	seoTitle: "",
	seoDescription: "",
	focusKeyword: "",
	publishStatus: "draft",
	authorId: "",
	authorName: "",
	authorAvatarUrl: "",
};

export interface ArticleFilterState {
	search: string;
	status: string;
	type: string;
	sort: "newest" | "oldest";
}