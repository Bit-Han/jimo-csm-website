// lib/services/seo.service.ts
import { db } from "@/lib/db";
import {
	seoSettings,
	projects,
	articles,
	companyPages,
	landingPages,
	media,
} from "@/lib/db/schema";
import { eq, isNull, or, sql } from "drizzle-orm";
import type { SeoSettings } from "@/lib/types";

type SeoIssue = {
	page: string;
	path: string;
	type: "Meta" | "Content" | "Images" | "SEO";
	issue: string;
	focusKeyword: string;
	actionLabel: string;
	entityId: string;
	entityType: "project" | "article" | "company_page" | "landing_page";
};

export async function getSeoSettings(): Promise<SeoSettings | null> {
	const [settings] = await db.select().from(seoSettings).limit(1);
	return settings ?? null;
}

export async function upsertSeoSettings(
	input: Partial<Omit<SeoSettings, "id" | "createdAt" | "updatedAt">>,
): Promise<SeoSettings> {
	const existing = await getSeoSettings();

	if (existing) {
		const [updated] = await db
			.update(seoSettings)
			.set({ ...input, updatedAt: new Date() })
			.where(eq(seoSettings.id, existing.id))
			.returning();
		return updated;
	}

	const [created] = await db.insert(seoSettings).values(input).returning();
	return created;
}

/**
 * Run SEO audit across all content types.
 * Collects issues, updates the health score, saves counts.
 */
export async function runSeoAudit(): Promise<{
	healthScore: number;
	issues: SeoIssue[];
	missingMetaTitlesCount: number;
	missingAltTextCount: number;
}> {
	const issues: SeoIssue[] = [];

	// ── Projects missing meta title ──
	const projectsMissingMeta = await db
		.select({ id: projects.id, name: projects.name, slug: projects.slug })
		.from(projects)
		.where(or(isNull(projects.metaTitle), eq(projects.metaTitle, "")));

	projectsMissingMeta.forEach((p) => {
		issues.push({
			page: p.name,
			path: `/projects/${p.slug}`,
			type: "Meta",
			issue: "Missing meta title",
			focusKeyword: p.name,
			actionLabel: "Fix Issue",
			entityId: p.id,
			entityType: "project",
		});
	});

	// ── Articles with duplicate meta titles ──
	const duplicateTitles = await db.execute(
		sql`SELECT meta_title, COUNT(*) as cnt FROM articles 
        WHERE meta_title IS NOT NULL AND meta_title != '' 
        GROUP BY meta_title HAVING COUNT(*) > 1`,
	);

	// ── Images missing alt text ──
	const [{ missingAlt }] = await db
		.select({ missingAlt: sql<number>`count(*)::int` })
		.from(media)
		.where(or(isNull(media.altText), eq(media.altText, "")));

	if (missingAlt > 0) {
		issues.push({
			page: "Media Library",
			path: "/dashboard/media",
			type: "Images",
			issue: `${missingAlt} images missing alt text`,
			focusKeyword: "",
			actionLabel: "Fix Issue",
			entityId: "media",
			entityType: "project",
		});
	}

	// ── Landing pages with short meta descriptions ──
	const shortMeta = await db
		.select({
			id: landingPages.id,
			title: landingPages.title,
			slug: landingPages.slug,
			metaDescription: landingPages.metaDescription,
		})
		.from(landingPages)
		.where(sql`char_length(meta_description) < 50 OR meta_description IS NULL`);

	shortMeta.forEach((lp) => {
		issues.push({
			page: lp.title,
			path: `/investors/${lp.slug}`,
			type: "Content",
			issue: "Meta description too short",
			focusKeyword: "Property investment in Lagos",
			actionLabel: "Fix Issue",
			entityId: lp.id,
			entityType: "landing_page",
		});
	});

	const totalChecks = 100;
	const deductions = Math.min(issues.length * 5, 40);
	const healthScore = totalChecks - deductions;

	// Save updated counts
	await upsertSeoSettings({
		missingMetaTitlesCount: projectsMissingMeta.length,
		missingAltTextCount: missingAlt,
		duplicateTitlesCount: (duplicateTitles.rows?.length as number) ?? 0,
		healthScore,
		sitemapLastGeneratedAt: new Date(),
	});

	return {
		healthScore,
		issues,
		missingMetaTitlesCount: projectsMissingMeta.length,
		missingAltTextCount: missingAlt,
	};
}
