// lib/db/queries/seo-centre.ts
import { and, count, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	seoGlobalSettings,
	seoIssues,
	seoConfigs,
	projects,
	insights,
	landingPages,
} from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import type {
	AdminSeoIssueRow,
	SeoChecklistItem,
	SeoGlobalSettingsData,
	SeoHealthStat,
	SitemapStats,
} from "@/lib/types/admin/seo-centre";

const DB_TIMEOUT_MS = 8000;
const SEO_GLOBAL_SETTINGS_TIMEOUT_MS = 15000;

// Weight per severity for the health score — simple, stated formula:
// 100 minus the weighted sum of every currently-open issue, floored at 0.
const SEVERITY_WEIGHT = { error: 5, warning: 2, info: 1 } as const;

export async function getSeoGlobalSettings(): Promise<SeoGlobalSettingsData> {
	console.info("[admin:getSeoGlobalSettings] Loading SEO global settings");
	const row = await withTimeout(
		db.query.seoGlobalSettings.findFirst({
			where: eq(seoGlobalSettings.id, 1),
		}),
		SEO_GLOBAL_SETTINGS_TIMEOUT_MS,
		"getSeoGlobalSettings",
	);
	console.info("[admin:getSeoGlobalSettings] Loaded SEO global settings");

	return {
		siteTitle: row?.siteTitle ?? "Jimo Property Development",
		metaDescription: row?.metaDescription ?? "",
		robotsTxt: row?.robotsTxt ?? "User-agent: *\nAllow: /",
		canonicalDomain: row?.canonicalDomain ?? "",
	};
}

export async function getAdminSeoIssues(): Promise<AdminSeoIssueRow[]> {
	console.info("[admin:getAdminSeoIssues] Loading admin SEO issues");
	const rows = await withTimeout(
		db.query.seoIssues.findMany({
			where: eq(seoIssues.status, "open"),
			orderBy: (i, { desc }) => [desc(i.detectedAt)],
		}),
		DB_TIMEOUT_MS,
		"getAdminSeoIssues",
	);
	console.info(`[admin:getAdminSeoIssues] Loaded ${rows.length} open SEO issues`);

	return rows.map((row) => ({
		id: row.id,
		pageTitle: row.pageTitle,
		pageUrl: row.pageUrl,
		issueType: row.issueType as AdminSeoIssueRow["issueType"],
		issue: row.description,
		focusKeyword: row.focusKeyword ?? "—",
		actionLabel: actionLabelFor(row.issueType),
		actionHref: actionHrefFor(row.pageType, row.pageUrl),
	}));
}

function actionLabelFor(issueType: string): string {
	return issueType === "seo" ? "View Duplicates" : "Fix Issue";
}

function actionHrefFor(pageType: string | null, pageUrl: string): string {
	if (pageType === "project") {
		const slug = pageUrl.replace("/projects/", "");
		return `/admin/projects/${slug}/edit?tab=seo`;
	}
	if (pageType === "insight") {
		const slug = pageUrl.replace("/insights/", "");
		return `/admin/news-insights/${slug}/edit`;
	}
	if (pageType === "landing-page") {
		const slug = pageUrl.replace("/lp/", "");
		return `/admin/landing-pages/${slug}/edit`;
	}
	return "/admin/seo-centre";
}

/** Computed live from the currently-stored open issues — updates the
 * instant Run SEO Audit finishes, since that's what repopulates seo_issues. */
export async function getSeoScore(): Promise<number> {
	console.info("[admin:getSeoScore] Loading SEO score");
	const rows = await withTimeout(
		db
			.select({ severity: seoIssues.severity })
			.from(seoIssues)
			.where(eq(seoIssues.status, "open")),
		DB_TIMEOUT_MS,
		"getSeoScore",
	);
	console.info(`[admin:getSeoScore] Loaded ${rows.length} SEO issue severities`);

	const penalty = rows.reduce(
		(sum, r) =>
			sum + SEVERITY_WEIGHT[r.severity as keyof typeof SEVERITY_WEIGHT],
		0,
	);

	return Math.max(0, Math.min(100, 100 - penalty));
}

export async function getSeoHealthStats(): Promise<SeoHealthStat[]> {
	console.info("[admin:getSeoHealthStats] Loading SEO health stats");
	const [issueRows, indexedCount, noIndexCount, schemaCount] =
		await Promise.all([
			withTimeout(
				db
					.select({ issueType: seoIssues.issueType })
					.from(seoIssues)
					.where(eq(seoIssues.status, "open")),
				DB_TIMEOUT_MS,
				"getSeoHealthStats:issues",
			),
			withTimeout(
				db
					.select({ c: count() })
					.from(seoConfigs)
					.where(
						and(eq(seoConfigs.noIndex, false), isNotNull(seoConfigs.metaTitle)),
					),
				DB_TIMEOUT_MS,
				"getSeoHealthStats:indexed",
			),
			withTimeout(
				db
					.select({ c: count() })
					.from(seoConfigs)
					.where(eq(seoConfigs.noIndex, true)),
				DB_TIMEOUT_MS,
				"getSeoHealthStats:noindex",
			),
			withTimeout(
				db
					.select({ c: count() })
					.from(seoConfigs)
					.where(isNotNull(seoConfigs.schemaMarkup)),
				DB_TIMEOUT_MS,
				"getSeoHealthStats:schema",
			),
		]);
	console.info(
		`[admin:getSeoHealthStats] Loaded ${issueRows.length} issue rows and aggregate SEO counts`,
	);

	const countByType = (type: string) =>
		issueRows.filter((r) => r.issueType === type).length;

	const missingMeta = countByType("meta");
	const missingAlt = countByType("images");
	const duplicates = countByType("seo");

	return [
		{
			id: "missing-meta",
			label: "Missing Meta Titles",
			value: missingMeta,
			severity: missingMeta > 0 ? "needs-attention" : "good",
		},
		{
			id: "missing-alt",
			label: "Missing Alt Text",
			value: missingAlt,
			severity: missingAlt > 0 ? "needs-attention" : "good",
		},
		{
			id: "indexed-pages",
			label: "Indexed Pages",
			value: indexedCount[0]?.c ?? 0,
			severity: "good",
		},
		{
			id: "duplicate-titles",
			label: "Duplicate Titles",
			value: duplicates,
			severity: duplicates > 0 ? "needs-attention" : "good",
		},
		{
			id: "no-index-pages",
			label: "No-index Pages",
			value: noIndexCount[0]?.c ?? 0,
			severity: "good",
		},
		{
			id: "schema-blocks",
			label: "Schema Blocks",
			value: schemaCount[0]?.c ?? 0,
			severity: "good",
		},
	];
}

export async function getSitemapStats(): Promise<SitemapStats> {
	console.info("[admin:getSitemapStats] Loading sitemap stats");
	const [
		publishedProjects,
		publishedInsights,
		publishedLandingPages,
		noIndexCount,
	] = await Promise.all([
		withTimeout(
			db
				.select({ c: count() })
				.from(projects)
				.where(eq(projects.publishStatus, "published")),
			DB_TIMEOUT_MS,
			"getSitemapStats:projects",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(insights)
				.where(eq(insights.publishStatus, "published")),
			DB_TIMEOUT_MS,
			"getSitemapStats:insights",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(landingPages)
				.where(eq(landingPages.publishStatus, "published")),
			DB_TIMEOUT_MS,
			"getSitemapStats:landing",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(seoConfigs)
				.where(eq(seoConfigs.noIndex, true)),
			DB_TIMEOUT_MS,
			"getSitemapStats:noindex",
		),
	]);
	console.info("[admin:getSitemapStats] Loaded sitemap aggregate counts");

	// +1 accounts for the homepage itself, which isn't a row in any of
	// these tables. "errors" is honestly reported as 0 — with slug columns
	// constrained NOT NULL at the schema level, there's no realistic broken
	// -URL case to detect without an actual live crawler/link-checker,
	// which is a separate future integration, not something to fake here.
	const totalUrls =
		1 +
		(publishedProjects[0]?.c ?? 0) +
		(publishedInsights[0]?.c ?? 0) +
		(publishedLandingPages[0]?.c ?? 0);
	const noIndex = noIndexCount[0]?.c ?? 0;

	return {
		totalUrls,
		indexed: Math.max(0, totalUrls - noIndex),
		noIndex,
		errors: 0,
	};
}

export async function getSeoChecklist(): Promise<SeoChecklistItem[]> {
	console.info("[admin:getSeoChecklist] Loading SEO checklist");
	const [stats, settingsRow] = await Promise.all([
		getSeoHealthStats(),
		withTimeout(
			db.query.seoGlobalSettings.findFirst({
				where: eq(seoGlobalSettings.id, 1),
			}),
			DB_TIMEOUT_MS,
			"getSeoChecklist:settings",
		),
	]);
	console.info(
		`[admin:getSeoChecklist] Loaded SEO checklist inputs with ${stats.length} stats and ${settingsRow ? "a" : "no"} settings row`,
	);

	const missingMeta = stats.find((s) => s.id === "missing-meta")?.value ?? 0;
	const missingAlt = stats.find((s) => s.id === "missing-alt")?.value ?? 0;
	const schemaBlocks = stats.find((s) => s.id === "schema-blocks")?.value ?? 0;

	// "Needs refresh" if any published content changed after the last
	// sitemap generation — a genuinely meaningful staleness check now that
	// sitemapLastGeneratedAt is a real, stored timestamp.
	const lastGenerated = settingsRow?.sitemapLastGeneratedAt;
	let needsRefresh = !lastGenerated;
	if (lastGenerated) {
		const [recentProject, recentInsight] = await Promise.all([
			withTimeout(
				db.query.projects.findFirst({
					where: eq(projects.publishStatus, "published"),
					orderBy: (p, { desc }) => [desc(p.updatedAt)],
				}),
				DB_TIMEOUT_MS,
				"getSeoChecklist:recentProject",
			),
			withTimeout(
				db.query.insights.findFirst({
					where: eq(insights.publishStatus, "published"),
					orderBy: (i, { desc }) => [desc(i.updatedAt)],
				}),
				DB_TIMEOUT_MS,
				"getSeoChecklist:recentInsight",
			),
		]);
		const mostRecentUpdate = [
			recentProject?.updatedAt,
			recentInsight?.updatedAt,
		]
			.filter((d): d is Date => Boolean(d))
			.sort((a, b) => b.getTime() - a.getTime())[0];
		needsRefresh = Boolean(
			mostRecentUpdate && mostRecentUpdate > lastGenerated,
		);
	}

	return [
		{
			id: "meta-titles",
			label: "Meta titles added",
			checked: missingMeta === 0,
			isWarning: missingMeta > 0,
		},
		{
			id: "descriptions",
			label: "Add descriptions to all pages",
			checked: missingMeta === 0,
			isWarning: missingMeta > 0,
		},
		{
			id: "alt-text",
			label: "Alt text added to images",
			checked: missingAlt === 0,
			isWarning: missingAlt > 0,
		},
		{
			id: "schema",
			label:
				schemaBlocks > 0
					? "Schema markup present"
					: "Schema markup not yet generated",
			checked: schemaBlocks > 0,
			isWarning: schemaBlocks === 0,
		},
		{
			id: "sitemap",
			label: needsRefresh ? "Sitemap needs refresh" : "Sitemap up to date",
			checked: !needsRefresh,
			isWarning: needsRefresh,
		},
	];
}
