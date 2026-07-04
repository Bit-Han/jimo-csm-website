// // lib/db/schema/seo.ts
// import {
// 	pgTable,
// 	uuid,
// 	text,
// 	timestamp,
// 	integer,
// 	boolean,
// } from "drizzle-orm/pg-core";

// // ─────────────────────────────────────────────────────────────────────────────
// // seo_settings
// // Single-row table — global SEO config (upserted on save, never deleted).
// // ─────────────────────────────────────────────────────────────────────────────
// export const seoSettings = pgTable("seo_settings", {
// 	id: uuid("id").primaryKey().defaultRandom(),
// 	siteTitle: text("site_title").notNull().default("Jimo Property Development"),
// 	metaDescription: text("meta_description"),
// 	robotsTxt: text("robots_txt").notNull().default("User-agent: *\nAllow: /"),
// 	canonicalDomain: text("canonical_domain"),
// 	googleSearchConsoleVerified: boolean(
// 		"google_search_console_verified",
// 	).default(false),
// 	sitemapLastGeneratedAt: timestamp("sitemap_last_generated_at", {
// 		withTimezone: true,
// 	}),
// 	// Aggregated counts (refreshed by the SEO audit job)
// 	missingMetaTitlesCount: integer("missing_meta_titles_count").default(0),
// 	missingAltTextCount: integer("missing_alt_text_count").default(0),
// 	indexedPagesCount: integer("indexed_pages_count").default(0),
// 	duplicateTitlesCount: integer("duplicate_titles_count").default(0),
// 	noIndexPagesCount: integer("no_index_pages_count").default(0),
// 	schemaBlocksCount: integer("schema_blocks_count").default(0),
// 	// Computed health score 0–100
// 	healthScore: integer("health_score").default(0),
// 	createdAt: timestamp("created_at", { withTimezone: true })
// 		.notNull()
// 		.defaultNow(),
// 	updatedAt: timestamp("updated_at", { withTimezone: true })
// 		.notNull()
// 		.defaultNow(),
// });

// export type SeoSettings = typeof seoSettings.$inferSelect;

import {
	boolean,
	integer,
	jsonb,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import {
	aiVisibilityPlatformEnum,
	gscSearchTypeEnum,
	seoIssueStatusEnum,
	seoIssueSeverityEnum,
	seoIssueTypeEnum,
	seoPageTypeEnum,
} from "./enums";
import { adminUsers } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// seo_global_settings (singleton — upsert id = 1)
//
// Drives the "Global SEO Settings" card on the SEO Centre screen:
//   Site Title, Meta Description, Robots.txt, Canonical Domain
// Also holds the llms.txt content for the public site to serve at /llms.txt
// ─────────────────────────────────────────────────────────────────────────────
export const seoGlobalSettings = pgTable("seo_global_settings", {
	id: integer("id").primaryKey().default(1),

	siteTitle: text("site_title").notNull().default("Jimo Property Development"),
	metaDescription: text("meta_description").notNull().default(""),
	robotsTxt: text("robots_txt").notNull().default("User-agent: *\nAllow: /"),
	canonicalDomain: text("canonical_domain").notNull().default(""),

	// Google Search Console service account key JSON — stored encrypted
	// in Supabase Vault once integration stage lands; plain text for now
	gscServiceAccountJson: text("gsc_service_account_json"),
	gscSiteUrl: text("gsc_site_url"), // e.g. "sc-domain:jimopropertydevelopment.com"

	// llms.txt — a curated Markdown file at /llms.txt describing the site
	// to AI crawlers. Low cost to ship, small upside for agentic tools.
	// Generated and edited from the SEO Centre; served by a Next.js route handler.
	llmsTxtEnabled: boolean("llms_txt_enabled").notNull().default(false),
	llmsTxtContent: text("llms_txt_content"),

	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// seo_configs
//
// One row per public page. Stores the SEO metadata the CMS admin edits —
// meta title, description, focus keyword, and JSON-LD structured data
// (Article schema for insights, Product/RealEstateListing for projects, etc.)
//
// pageType + pageSlug is unique — the same slug can exist for different types
// (an insight and a project both named "yaba" would have different pageTypes)
// ─────────────────────────────────────────────────────────────────────────────
export const seoConfigs = pgTable(
	"seo_configs",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		pageType: seoPageTypeEnum("page_type").notNull(),
		pageSlug: text("page_slug").notNull(),

		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		focusKeyword: text("focus_keyword"),
		canonicalUrl: text("canonical_url"),

		// noIndex = true prevents Google indexing this page
		noIndex: boolean("no_index").notNull().default(false),

		// JSON-LD structured data injected into <head>.
		// For insights: Article + FAQPage schema.
		// For projects: RealEstateListing + Organization schema.
		// Stored as JSONB — the CMS generates it, the public site renders it.
		schemaMarkup: jsonb("schema_markup"),

		// Open Graph overrides — default to metaTitle / metaDescription if null
		ogTitle: text("og_title"),
		ogDescription: text("og_description"),
		ogImageUrl: text("og_image_url"),

		// Calculated SEO score (0–100) set when an SEO audit runs
		seoScore: integer("seo_score"),

		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		uniquePageRef: unique().on(table.pageType, table.pageSlug),
	}),
);

// ─────────────────────────────────────────────────────────────────────────────
// seo_issues
//
// One row per issue found by the SEO audit (Run SEO Audit button).
// Drives the issues table on the SEO Centre screen:
//   Page | Type | Issue | Focus Keyword | Action
// ─────────────────────────────────────────────────────────────────────────────
export const seoIssues = pgTable("seo_issues", {
	id: uuid("id").defaultRandom().primaryKey(),

	// The public URL of the page that has the issue, e.g. /insights/why-yaba
	pageUrl: text("page_url").notNull(),
	pageType: seoPageTypeEnum("page_type"),
	issueType: seoIssueTypeEnum("issue_type").notNull(),
	severity: seoIssueSeverityEnum("severity").notNull(),
	description: text("description").notNull(),
	focusKeyword: text("focus_keyword"),
	status: seoIssueStatusEnum("status").notNull().default("open"),

	detectedAt: timestamp("detected_at").defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at"),
});

// ─────────────────────────────────────────────────────────────────────────────
// gsc_performance_cache
//
// Rows synced daily from the Google Search Console Search Analytics API.
// Dimensions: query + page + date. Metrics: clicks, impressions, ctr, position.
//
// search_type is key here — as of June 2026, Google's new AI performance
// reports expose "ai_overview" and "ai_mode" as separate search types.
// This means we can see exactly how many times an insight page appeared
// inside a Google AI Overview, and how many people clicked through.
//
// Integration note: the GSC API has a 2-3 day data lag and a 16-month
// rolling window. Set up a daily cron job (Supabase scheduled function)
// to call the API and upsert rows here.
// ─────────────────────────────────────────────────────────────────────────────
export const gscPerformanceCache = pgTable("gsc_performance_cache", {
	id: uuid("id").defaultRandom().primaryKey(),

	pageUrl: text("page_url").notNull(),
	query: text("query").notNull(),
	searchType: gscSearchTypeEnum("search_type").notNull().default("web"),

	clicks: integer("clicks").notNull().default(0),
	impressions: integer("impressions").notNull().default(0),
	// Stored as a numeric string e.g. "0.12" = 12% CTR
	ctr: numeric("ctr"),
	avgPosition: numeric("avg_position"),

	// The date this performance row covers (GSC data is per-day)
	date: text("date").notNull(), // ISO date string e.g. "2026-07-01"

	syncedAt: timestamp("synced_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// ai_visibility_prompts
//
// The queries we test against AI chatbots to see if Jimo's content appears.
// For a real estate developer in Lagos, these would be prompts like:
//   "best serviced apartments in Yaba Lagos"
//   "real estate investment opportunities in Lagos"
//   "shortlet apartments Yaba Nigeria"
//   "Jimo Property Development"
//
// The admin creates these in the SEO Centre and runs them manually
// (or later via a third-party tool integration like OtterlyAI or Frase).
// ─────────────────────────────────────────────────────────────────────────────
export const aiVisibilityPrompts = pgTable("ai_visibility_prompts", {
	id: uuid("id").defaultRandom().primaryKey(),

	prompt: text("prompt").notNull(),

	// Category groups prompts for analysis:
	// "branded"  — "Jimo Property Development apartments"
	// "category" — "best serviced apartments in Yaba"
	// "location" — "real estate investment Lagos Nigeria"
	// "compare"  — "Vatican Court vs Jimo Residences"
	category: text("category").notNull().default("category"),

	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// ai_visibility_results
//
// One row per prompt-platform-date test run.
// Populated manually (admin runs the prompt and records what they see)
// or automatically via a tool integration in the future.
//
// wasMentioned = brand name "Jimo" appeared anywhere in the response
// wasCited = the actual site URL was linked/referenced
// citedUrl = which specific page was cited if wasCited is true
// sentiment = rough classification of how the brand was framed
// responseSnippet = the relevant excerpt (never the full response — copyright)
// ─────────────────────────────────────────────────────────────────────────────
export const aiVisibilityResults = pgTable("ai_visibility_results", {
	id: uuid("id").defaultRandom().primaryKey(),

	promptId: uuid("prompt_id")
		.notNull()
		.references(() => aiVisibilityPrompts.id, { onDelete: "cascade" }),
	platform: aiVisibilityPlatformEnum("platform").notNull(),

	wasMentioned: boolean("was_mentioned").notNull().default(false),
	wasCited: boolean("was_cited").notNull().default(false),
	citedUrl: text("cited_url"),
	sentiment: text("sentiment", {
		enum: ["positive", "neutral", "negative", "not_mentioned"],
	})
		.notNull()
		.default("not_mentioned"),

	// A short excerpt from the AI response showing context around the mention.
	// Store the smallest snippet needed — never the full response.
	responseSnippet: text("response_snippet"),

	testedAt: timestamp("tested_at").defaultNow().notNull(),
	// Which admin ran this test (for audit trail)
	testedByUserId: uuid("tested_by_user_id").references(() => adminUsers.id, {
		onDelete: "set null",
	}),
});

export type SeoGlobalSettingsRow = typeof seoGlobalSettings.$inferSelect;
export type SeoConfigRow = typeof seoConfigs.$inferSelect;
export type NewSeoConfigRow = typeof seoConfigs.$inferInsert;
export type SeoIssueRow = typeof seoIssues.$inferSelect;
export type NewSeoIssueRow = typeof seoIssues.$inferInsert;
export type GscPerformanceCacheRow = typeof gscPerformanceCache.$inferSelect;
export type NewGscPerformanceCacheRow = typeof gscPerformanceCache.$inferInsert;
export type AiVisibilityPromptRow = typeof aiVisibilityPrompts.$inferSelect;
export type AiVisibilityResultRow = typeof aiVisibilityResults.$inferSelect;