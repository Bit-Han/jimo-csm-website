// import { db } from "../index";
// import { aiVisibilityPrompts, seoGlobalSettings } from "../schema";

// export async function seedSeo() {
// 	// ── Global settings singleton ─────────────────────────────────────────────
// 	await db
// 		.insert(seoGlobalSettings)
// 		.values({
// 			id: 1,
// 			siteTitle: "Jimo Property Development",
// 			metaDescription:
// 				"Premium residential, hospitality, and investment-led real estate developments in Lagos, built with structure, insight, and long-term value.",
// 			robotsTxt:
// 				"User-agent: *\nAllow: /\n\nSitemap: https://jimopropertydevelopment.com/sitemap.xml",
// 			canonicalDomain: "https://jimopropertydevelopment.com",
// 			llmsTxtEnabled: false,
// 			llmsTxtContent: null,
// 		})
// 		.onConflictDoNothing();

// 	// ── Starter AI visibility prompts ─────────────────────────────────────────
// 	// Real estate buyer/investor queries relevant to Jimo's Lagos market.
// 	await db
// 		.insert(aiVisibilityPrompts)
// 		.values([
// 			{
// 				prompt: "Jimo Property Development Lagos",
// 				category: "branded",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "best serviced apartments for investment in Yaba Lagos",
// 				category: "category",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "real estate investment opportunities Lagos Nigeria 2026",
// 				category: "category",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "shortlet apartment investment Lagos",
// 				category: "category",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "premium apartments in Yaba Lagos to buy",
// 				category: "location",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "diaspora real estate investment Nigeria",
// 				category: "category",
// 				isActive: true,
// 			},
// 			{
// 				prompt: "hospitality real estate development Lagos Nigeria",
// 				category: "category",
// 				isActive: true,
// 			},
// 		])
// 		.onConflictDoNothing();

// 	console.log("SEO seed complete.");
// }



// lib/db/seeds/seo.ts
import { seedDb } from "../seed-client"; // ← direct connection, not db
import { aiVisibilityPrompts, seoGlobalSettings } from "../schema";

export async function seedSeo() {
  // ── Global settings singleton ─────────────────────────────────────────────
  await seedDb
    .insert(seoGlobalSettings)
    .values({
      id: 1,
      siteTitle: "Jimo Property Development",
      metaDescription:
        "Premium residential, hospitality, and investment-led real estate developments in Lagos, built with structure, insight, and long-term value.",
      robotsTxt:
        "User-agent: *\nAllow: /\n\nSitemap: https://jimopropertydevelopment.com/sitemap.xml",
      canonicalDomain: "https://jimopropertydevelopment.com",
      llmsTxtEnabled: false,
      llmsTxtContent: null,
    })
    .onConflictDoNothing();

  console.log("✓ SEO global settings seeded.");

  // ── AI visibility prompts ─────────────────────────────────────────────────
  await seedDb
    .insert(aiVisibilityPrompts)
    .values([
      { prompt: "Jimo Property Development Lagos", category: "branded", isActive: true },
      { prompt: "best serviced apartments for investment in Yaba Lagos", category: "category", isActive: true },
      { prompt: "real estate investment opportunities Lagos Nigeria 2026", category: "category", isActive: true },
      { prompt: "shortlet apartment investment Lagos", category: "category", isActive: true },
      { prompt: "premium apartments in Yaba Lagos to buy", category: "location", isActive: true },
      { prompt: "diaspora real estate investment Nigeria", category: "category", isActive: true },
      { prompt: "hospitality real estate development Lagos Nigeria", category: "category", isActive: true },
    ])
    .onConflictDoNothing();

  console.log("✓ AI visibility prompts seeded.");
}