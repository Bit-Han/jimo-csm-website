// app/sitemap.ts
import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, insights, landingPages } from "@/lib/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base =
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://jimopropertydevelopment.com";

	const [publishedProjects, publishedInsights, publishedLandingPages] =
		await Promise.all([
			db.query.projects.findMany({
				where: eq(projects.publishStatus, "published"),
			}),
			db.query.insights.findMany({
				where: eq(insights.publishStatus, "published"),
			}),
			db.query.landingPages.findMany({
				where: eq(landingPages.publishStatus, "published"),
			}),
		]);

	return [
		{ url: base, lastModified: new Date() },
		...publishedProjects.map((p) => ({
			url: `${base}/projects/${p.slug}`,
			lastModified: p.updatedAt,
		})),
		...publishedInsights.map((i) => ({
			url: `${base}/insights/${i.slug}`,
			lastModified: i.updatedAt,
		})),
		// Landing pages deliberately excluded from the public sitemap — they
		// carry noindex/nofollow (see app/lp/[slug]/page.tsx from the
		// Landing Pages build) since campaign pages shouldn't compete for
		// organic search.
	];
}
