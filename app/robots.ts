// app/robots.ts
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { seoGlobalSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const settings = await db.query.seoGlobalSettings.findFirst({
		where: eq(seoGlobalSettings.id, 1),
	});
	const base =
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://jimopropertydevelopment.com";

	return {
		rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
		sitemap: `${base}/sitemap.xml`,
		host: settings?.canonicalDomain || base,
	};
}
