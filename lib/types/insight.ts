// // //@lib/types/insights

// export type InsightCategory = string; // dynamic now — validated against insight_categories in the DB

// export interface InsightCategoryOption {
// 	value: string;
// 	label: string;
// }

// export interface InsightRelatedProject {
// 	slug: string;
// 	name: string;
// }

// export type InsightBodyBlock =
// 	| { id: string; type: "paragraph"; text: string }
// 	| { id: string; type: "image"; src: string; alt: string };

// export interface InsightAuthor {
// 	id: string | null;
// 	name: string;
// 	avatarUrl: string | null;
// }

// export interface InsightSummary {
// 	id: string;
// 	slug: string;
// 	title: string;
// 	category: InsightCategory;
// 	categoryLabel: string;
// 	excerpt: string;
// 	publishedAt: string;
// 	readTimeMinutes: number;
// 	relatedProject?: InsightRelatedProject;
// 	coverImage: { src: string; alt: string };
// 	author: InsightAuthor;
// }

// export interface InsightDetail extends InsightSummary {
// 	body: InsightBodyBlock[];
// }


// lib/types/insight.ts
import type { JSONContent } from "@tiptap/react";

export type InsightCategory = string; // dynamic now — validated against insight_categories in the DB

export interface InsightCategoryOption {
	value: string;
	label: string;
}

export interface InsightRelatedProject {
	slug: string;
	name: string;
}

export interface InsightAuthor {
	id: string | null;
	name: string;
	avatarUrl: string | null;
}

export interface InsightSummary {
	id: string;
	slug: string;
	title: string;
	category: InsightCategory;
	categoryLabel: string;
	excerpt: string;
	publishedAt: string;
	readTimeMinutes: number;
	relatedProject?: InsightRelatedProject;
	coverImage: { src: string; alt: string };
	author: InsightAuthor;
}

export interface InsightDetail extends InsightSummary {
	content: JSONContent;
}