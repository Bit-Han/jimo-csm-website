// lib/db/schema/seo.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	integer,
	boolean,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// seo_settings
// Single-row table — global SEO config (upserted on save, never deleted).
// ─────────────────────────────────────────────────────────────────────────────
export const seoSettings = pgTable("seo_settings", {
	id: uuid("id").primaryKey().defaultRandom(),
	siteTitle: text("site_title").notNull().default("Jimo Property Development"),
	metaDescription: text("meta_description"),
	robotsTxt: text("robots_txt").notNull().default("User-agent: *\nAllow: /"),
	canonicalDomain: text("canonical_domain"),
	googleSearchConsoleVerified: boolean(
		"google_search_console_verified",
	).default(false),
	sitemapLastGeneratedAt: timestamp("sitemap_last_generated_at", {
		withTimezone: true,
	}),
	// Aggregated counts (refreshed by the SEO audit job)
	missingMetaTitlesCount: integer("missing_meta_titles_count").default(0),
	missingAltTextCount: integer("missing_alt_text_count").default(0),
	indexedPagesCount: integer("indexed_pages_count").default(0),
	duplicateTitlesCount: integer("duplicate_titles_count").default(0),
	noIndexPagesCount: integer("no_index_pages_count").default(0),
	schemaBlocksCount: integer("schema_blocks_count").default(0),
	// Computed health score 0–100
	healthScore: integer("health_score").default(0),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type SeoSettings = typeof seoSettings.$inferSelect;
