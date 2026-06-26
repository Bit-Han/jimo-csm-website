export type InsightCategory =
	| "location-analysis"
	| "investment-education"
	| "project-update";

export interface InsightCategoryOption {
	value: InsightCategory;
	label: string;
}

export interface InsightRelatedProject {
	slug: string;
	name: string;
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
	coverImage: {
		src: string;
		alt: string;
	};
}

export interface InsightDetail extends InsightSummary {
	body: string[];
}
