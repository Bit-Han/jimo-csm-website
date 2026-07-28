// // lib/actions/admin/seo-centre.ts
// "use server";

// import type { SeoGlobalSettingsData } from "@/lib/types/admin/seo-centre";

// export interface SeoActionResult {
// 	success: boolean;
// 	message: string;
// }

// export async function runSeoAudit(): Promise<SeoActionResult> {
// 	// TODO (integration stage):
// 	// 1. Fetch all published pages (projects, insights, company pages)
// 	// 2. For each page, check: meta title, meta description, alt text, duplicate titles
// 	// 3. Upsert results into seo_issues table
// 	// 4. Update seo_configs.seoScore per page
// 	// 5. revalidatePath("/admin/seo-centre")
// 	await new Promise((res) => setTimeout(res, 800));
// 	return {
// 		success: true,
// 		message: "SEO audit complete. Issues table updated.",
// 	};
// }

// export async function generateSitemap(): Promise<SeoActionResult> {
// 	// TODO (integration stage):
// 	// 1. Query all published projects, insights, company pages
// 	// 2. Build sitemap XML
// 	// 3. Write to public/sitemap.xml OR serve via /sitemap.xml route handler
// 	// 4. Ping Google Search Console
// 	await new Promise((res) => setTimeout(res, 600));
// 	return { success: true, message: "Sitemap generated at /sitemap.xml." };
// }

// export async function saveSeoGlobalSettings(
// 	data: SeoGlobalSettingsData,
// ): Promise<SeoActionResult> {
// 	// TODO (integration stage):
// 	// db.update(seoGlobalSettings).set({ ...data, updatedAt: new Date() }).where(eq(seoGlobalSettings.id, 1))
// 	console.log("[saveSeoGlobalSettings]", data);
// 	await new Promise((res) => setTimeout(res, 400));
// 	return { success: true, message: "Global SEO settings saved." };
// }

// export async function dismissSeoIssue(id: string): Promise<SeoActionResult> {
// 	// TODO (integration stage):
// 	// db.update(seoIssues).set({ status: "ignored" }).where(eq(seoIssues.id, id))
// 	console.log("[dismissSeoIssue]", id);
// 	return { success: true, message: "Issue dismissed." };
// }



// lib/actions/admin/seo-centre.ts
"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
	seoGlobalSettings,
	seoIssues,
	seoConfigs,
	projects,
	insights,
	landingPages,
	projectMedia,
} from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { withTimeout } from "@/lib/utils/timeout";
import { extractImagesMissingAlt } from "@/lib/utils/tiptap";
import type { SeoGlobalSettingsData } from "@/lib/types/admin/seo-centre";
import type { JSONContent } from "@tiptap/react";

export interface SeoActionResult {
	success: boolean;
	message: string;
}

const DB_TIMEOUT_MS = 8000;
const MIN_META_DESCRIPTION_LENGTH = 50;

type DetectedIssue = {
	pageUrl: string;
	pageTitle: string;
	pageType: "project" | "insight" | "landing-page";
	issueType: "meta" | "content" | "images" | "seo" | "technical";
	severity: "error" | "warning" | "info";
	description: string;
	focusKeyword: string | null;
};

/**
 * Real, DB-backed SEO audit. Scope, stated plainly:
 *  - Covers published projects, insights, and landing pages only.
 *  - Home/company pages are excluded — they're singleton JSONB blobs with
 *    no per-section publishStatus or natural slug, and auditing them
 *    meaningfully needs product decisions not yet made.
 *  - Projects and landing pages source meta title/description/focus
 *    keyword from seo_configs (no inline columns on those tables).
 *  - Insights source these directly from their own columns, since the
 *    article editor already writes there.
 */
export async function runSeoAudit(): Promise<SeoActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const detected: DetectedIssue[] = [];
		const titleRegistry: { title: string; pageUrl: string; pageTitle: string; pageType: DetectedIssue["pageType"] }[] = [];

		// ── Projects ──────────────────────────────────────────────────────
		const publishedProjects = await withTimeout(
			db.query.projects.findMany({
				where: eq(projects.publishStatus, "published"),
				with: { media: true },
			}),
			DB_TIMEOUT_MS,
			"runSeoAudit:projects",
		);

		for (const project of publishedProjects) {
			const pageUrl = `/projects/${project.slug}`;
			const config = await withTimeout(
				db.query.seoConfigs.findFirst({
					where: (c, { and: andOp, eq: eqOp }) => andOp(eqOp(c.pageType, "project"), eqOp(c.pageSlug, project.slug)),
				}),
				DB_TIMEOUT_MS,
				"runSeoAudit:projectConfig",
			);

			if (!config?.metaTitle?.trim()) {
				detected.push({ pageUrl, pageTitle: project.name, pageType: "project", issueType: "meta", severity: "error", description: "Missing meta title", focusKeyword: config?.focusKeyword ?? null });
			}
			if (!config?.metaDescription?.trim()) {
				detected.push({ pageUrl, pageTitle: project.name, pageType: "project", issueType: "content", severity: "warning", description: "Missing meta description", focusKeyword: config?.focusKeyword ?? null });
			} else if (config.metaDescription.length < MIN_META_DESCRIPTION_LENGTH) {
				detected.push({ pageUrl, pageTitle: project.name, pageType: "project", issueType: "content", severity: "warning", description: "Meta description too short", focusKeyword: config?.focusKeyword ?? null });
			}

			const missingAltCount = project.media.filter((m) => !m.alt?.trim()).length;
			if (missingAltCount > 0) {
				detected.push({ pageUrl, pageTitle: project.name, pageType: "project", issueType: "images", severity: "warning", description: `${missingAltCount} image${missingAltCount === 1 ? "" : "s"} missing alt text`, focusKeyword: config?.focusKeyword ?? null });
			}

			titleRegistry.push({ title: (config?.metaTitle || project.name).trim().toLowerCase(), pageUrl, pageTitle: project.name, pageType: "project" });
		}

		// ── Insights ──────────────────────────────────────────────────────
		const publishedInsights = await withTimeout(
			db.query.insights.findMany({ where: eq(insights.publishStatus, "published") }),
			DB_TIMEOUT_MS,
			"runSeoAudit:insights",
		);

		for (const insight of publishedInsights) {
			const pageUrl = `/insights/${insight.slug}`;

			if (!insight.seoTitle?.trim()) {
				detected.push({ pageUrl, pageTitle: insight.title, pageType: "insight", issueType: "meta", severity: "error", description: "Missing meta title", focusKeyword: insight.focusKeyword });
			}
			if (!insight.seoDescription?.trim()) {
				detected.push({ pageUrl, pageTitle: insight.title, pageType: "insight", issueType: "content", severity: "warning", description: "Missing meta description", focusKeyword: insight.focusKeyword });
			} else if (insight.seoDescription.length < MIN_META_DESCRIPTION_LENGTH) {
				detected.push({ pageUrl, pageTitle: insight.title, pageType: "insight", issueType: "content", severity: "warning", description: "Meta description too short", focusKeyword: insight.focusKeyword });
			}

			let missingAltCount = extractImagesMissingAlt(insight.content as JSONContent | null);
			if (!insight.coverImageAlt?.trim()) missingAltCount += 1;
			if (missingAltCount > 0) {
				detected.push({ pageUrl, pageTitle: insight.title, pageType: "insight", issueType: "images", severity: "warning", description: `${missingAltCount} image${missingAltCount === 1 ? "" : "s"} missing alt text`, focusKeyword: insight.focusKeyword });
			}

			titleRegistry.push({ title: (insight.seoTitle || insight.title).trim().toLowerCase(), pageUrl, pageTitle: insight.title, pageType: "insight" });
		}

		// ── Landing pages ─────────────────────────────────────────────────
		const publishedLandingPages = await withTimeout(
			db.query.landingPages.findMany({ where: eq(landingPages.publishStatus, "published") }),
			DB_TIMEOUT_MS,
			"runSeoAudit:landingPages",
		);

		for (const page of publishedLandingPages) {
			const pageUrl = `/lp/${page.slug}`;
			const config = await withTimeout(
				db.query.seoConfigs.findFirst({
					where: (c, { and: andOp, eq: eqOp }) => andOp(eqOp(c.pageType, "landing-page"), eqOp(c.pageSlug, page.slug)),
				}),
				DB_TIMEOUT_MS,
				"runSeoAudit:landingConfig",
			);

			if (!config?.metaTitle?.trim()) {
				detected.push({ pageUrl, pageTitle: page.title, pageType: "landing-page", issueType: "meta", severity: "error", description: "Missing meta title", focusKeyword: config?.focusKeyword ?? null });
			}
			if (!page.hero.backgroundImageUrl ? false : !page.hero.backgroundImageAlt?.trim()) {
				detected.push({ pageUrl, pageTitle: page.title, pageType: "landing-page", issueType: "images", severity: "warning", description: "Hero image missing alt text", focusKeyword: config?.focusKeyword ?? null });
			}

			titleRegistry.push({ title: (config?.metaTitle || page.hero.headline || page.title).trim().toLowerCase(), pageUrl, pageTitle: page.title, pageType: "landing-page" });
		}

		// ── Duplicate titles — global check across everything above ──────
		const titleCounts = new Map<string, number>();
		for (const entry of titleRegistry) {
			if (!entry.title) continue;
			titleCounts.set(entry.title, (titleCounts.get(entry.title) ?? 0) + 1);
		}
		for (const entry of titleRegistry) {
			if (entry.title && (titleCounts.get(entry.title) ?? 0) > 1) {
				detected.push({ pageUrl: entry.pageUrl, pageTitle: entry.pageTitle, pageType: entry.pageType, issueType: "seo", severity: "warning", description: "Duplicate title", focusKeyword: null });
			}
		}

		// ── Preserve dismissed issues, replace everything else ────────────
		const ignoredRows = await withTimeout(
			db.select({ pageUrl: seoIssues.pageUrl, description: seoIssues.description }).from(seoIssues).where(eq(seoIssues.status, "ignored")),
			DB_TIMEOUT_MS,
			"runSeoAudit:ignored",
		);
		const ignoredSet = new Set(ignoredRows.map((r) => `${r.pageUrl}::${r.description}`));

		const toInsert = detected.filter((d) => !ignoredSet.has(`${d.pageUrl}::${d.description}`));

		await withTimeout(
			db.delete(seoIssues).where(eq(seoIssues.status, "open")),
			DB_TIMEOUT_MS,
			"runSeoAudit:clearOpen",
		);

		if (toInsert.length > 0) {
			await withTimeout(
				db.insert(seoIssues).values(
					toInsert.map((d) => ({
						pageUrl: d.pageUrl,
						pageTitle: d.pageTitle,
						pageType: d.pageType,
						issueType: d.issueType,
						severity: d.severity,
						description: d.description,
						focusKeyword: d.focusKeyword,
						status: "open" as const,
					})),
				),
				DB_TIMEOUT_MS,
				"runSeoAudit:insert",
			);
		}

		revalidatePath("/admin/seo-centre", "layout");
		return { success: true, message: `SEO audit complete. ${toInsert.length} issue${toInsert.length === 1 ? "" : "s"} found.` };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[runSeoAudit]", message);
		return { success: false, message };
	}
}

export async function generateSitemap(): Promise<SeoActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		// Next.js's app/sitemap.ts already regenerates content on request —
		// this just forces an immediate revalidation and records when it
		// last happened, which is what the "Sitemap needs refresh" checklist
		// item now checks against.
		revalidatePath("/sitemap.xml");

		await withTimeout(
			db
				.update(seoGlobalSettings)
				.set({ sitemapLastGeneratedAt: new Date() })
				.where(eq(seoGlobalSettings.id, 1)),
			DB_TIMEOUT_MS,
			"generateSitemap",
		);

		revalidatePath("/admin/seo-centre", "layout");
		return { success: true, message: "Sitemap regenerated at /sitemap.xml." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[generateSitemap]", message);
		return { success: false, message };
	}
}

export async function saveSeoGlobalSettings(data: SeoGlobalSettingsData): Promise<SeoActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await withTimeout(
			db.query.seoGlobalSettings.findFirst({ where: eq(seoGlobalSettings.id, 1) }),
			DB_TIMEOUT_MS,
			"saveSeoGlobalSettings:find",
		);

		const values = { ...data, updatedAt: new Date() };

		if (existing) {
			await withTimeout(db.update(seoGlobalSettings).set(values).where(eq(seoGlobalSettings.id, 1)), DB_TIMEOUT_MS, "saveSeoGlobalSettings:update");
		} else {
			await withTimeout(db.insert(seoGlobalSettings).values({ id: 1, ...values }), DB_TIMEOUT_MS, "saveSeoGlobalSettings:insert");
		}

		revalidatePath("/admin/seo-centre", "layout");
		revalidatePath("/robots.txt");
		return { success: true, message: "Global SEO settings saved." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveSeoGlobalSettings]", message);
		return { success: false, message };
	}
}

export async function dismissSeoIssue(id: string): Promise<SeoActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await withTimeout(
			db.update(seoIssues).set({ status: "ignored", resolvedAt: new Date() }).where(eq(seoIssues.id, id)),
			DB_TIMEOUT_MS,
			"dismissSeoIssue",
		);

		revalidatePath("/admin/seo-centre", "layout");
		return { success: true, message: "Issue dismissed." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}