import type {
	AdminSeoIssueRow,
	SeoChecklistItem,
	SeoGlobalSettingsData,
	SeoHealthStat,
	SitemapStats,
} from "@/lib/types/admin/seo-centre";

// TODO (integration stage):
// seoScore     → computed from seo_issues counts vs total pages
// healthStats  → aggregated counts from seo_configs + seo_issues tables
// issues       → db.query.seoIssues.findMany({ where: eq(seoIssues.status, "open") })
// globalSettings → db.query.seoGlobalSettings.findFirst()

export const mockSeoScore = 78;

export const mockSeoHealthStats: SeoHealthStat[] = [
	{
		id: "missing-meta",
		label: "Missing Meta Titles",
		value: 12,
		severity: "needs-attention",
	},
	{
		id: "missing-alt",
		label: "Missing Alt Text",
		value: 36,
		severity: "needs-attention",
	},
	{ id: "indexed-pages", label: "Indexed Pages", value: 142, severity: "good" },
	{
		id: "duplicate-titles",
		label: "Duplicate Titles",
		value: 7,
		severity: "needs-attention",
	},
	{ id: "no-index-pages", label: "No-index Pages", value: 6, severity: "good" },
	{ id: "schema-blocks", label: "Schema Blocks", value: 42, severity: "good" },
];

export const mockSeoIssues: AdminSeoIssueRow[] = [
	{
		id: "issue-1",
		pageTitle: "Jimo Residences Yaba",
		pageUrl: "/projects/jimo-residences-yaba",
		issueType: "meta",
		issue: "Missing meta title",
		focusKeyword: "Jimo Residences Yaba",
		actionLabel: "Fix Issue",
		actionHref: "/admin/projects/jimo-residences-yaba/edit?tab=seo",
	},
	{
		id: "issue-2",
		pageTitle: "Investor Landing Page",
		pageUrl: "/investors",
		issueType: "content",
		issue: "Meta description too short",
		focusKeyword: "Property investment in Lagos",
		actionLabel: "Fix Issue",
		actionHref: "/admin/landing-pages",
	},
	{
		id: "issue-3",
		pageTitle: "Vatican Court",
		pageUrl: "/projects/vatican-court",
		issueType: "images",
		issue: "8 images missing alt text",
		focusKeyword: "Vatican Court apartments",
		actionLabel: "Fix Issue",
		actionHref: "/admin/projects/vatican-court/edit?tab=gallery",
	},
	{
		id: "issue-4",
		pageTitle: "Why Invest in Yaba",
		pageUrl: "/insights/why-invest-in-yaba",
		issueType: "seo",
		issue: "Duplicate title",
		focusKeyword: "Invest in Yaba",
		actionLabel: "View Duplicates",
		actionHref: "/admin/news-insights",
	},
];

export const mockSeoChecklist: SeoChecklistItem[] = [
	{
		id: "meta-titles",
		label: "Meta titles added",
		checked: true,
		isWarning: false,
	},
	{
		id: "descriptions",
		label: "Add descriptions to all pages",
		checked: false,
		isWarning: true,
	},
	{
		id: "schema",
		label: "Schema markup valid",
		checked: true,
		isWarning: false,
	},
	{
		id: "sitemap",
		label: "Sitemap needs refresh",
		checked: false,
		isWarning: true,
	},
];

export const mockSitemapStats: SitemapStats = {
	totalUrls: 168,
	indexed: 142,
	noIndex: 6,
	errors: 4,
};

export const mockSeoGlobalSettings: SeoGlobalSettingsData = {
	siteTitle: "Jimo Property Development",
	metaDescription: "Building tomorrow...",
	robotsTxt: "Allow all",
	canonicalDomain: "jimopropertydevelopment.com",
};
