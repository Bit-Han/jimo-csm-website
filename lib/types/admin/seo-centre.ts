export type SeoIssueType = "meta" | "content" | "images" | "seo" | "technical";

export interface SeoHealthStat {
	id: string;
	label: string;
	value: number;
	severity: "needs-attention" | "good";
}

export interface AdminSeoIssueRow {
	id: string;
	pageTitle: string;
	pageUrl: string;
	issueType: SeoIssueType;
	issue: string;
	focusKeyword: string;
	actionLabel: string;
	actionHref: string;
}

export interface SeoChecklistItem {
	id: string;
	label: string;
	checked: boolean;
	isWarning: boolean;
}

export interface SitemapStats {
	totalUrls: number;
	indexed: number;
	noIndex: number;
	errors: number;
}

export interface SeoGlobalSettingsData {
	siteTitle: string;
	metaDescription: string;
	robotsTxt: string;
	canonicalDomain: string;
}
