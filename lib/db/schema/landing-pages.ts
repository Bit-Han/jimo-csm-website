// lib/db/schema/landing-pages.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	real,
	jsonb,
	index,
} from "drizzle-orm/pg-core";
import { landingPageTypeEnum, contentStatusEnum } from "./enums";
import { profiles } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// PageSection — shape of each section in landingPages.sections JSONB
// TypeScript type only (not a DB table)
// ─────────────────────────────────────────────────────────────────────────────
export type PageSection = {
	id: string;
	type:
		| "hero"
		| "project_facts"
		| "investment_benefits"
		| "unit_pricing"
		| "location_advantage"
		| "gallery"
		| "brochure_download"
		| "register_interest_form"
		| "faq"
		| "testimonials"
		| "video"
		| "custom_text";
	label: string;
	visible: boolean;
	orderIndex: number;
	config: Record<string, unknown>; // section-specific overrides
};

// ─────────────────────────────────────────────────────────────────────────────
// landing_pages
// Campaign-specific pages for investors, diaspora buyers, realtors etc.
// sections JSONB drives the builder UI section list.
// ─────────────────────────────────────────────────────────────────────────────
export const landingPages = pgTable(
	"landing_pages",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		type: landingPageTypeEnum("type").notNull().default("general"),
		status: contentStatusEnum("status").notNull().default("draft"),

		// Optional link to a project
		projectId: uuid("project_id"),

		// Campaign metadata (displayed / used for CRM tagging)
		campaignType: text("campaign_type"), // "Investment Campaign"
		audience: text("audience"), // "Diaspora Investors"
		crmTag: text("crm_tag"), // "Shortlet Investor, High Intent"

		// Ordered page sections (see PageSection type)
		sections: jsonb("sections").$type<PageSection[]>().notNull().default([]),

		// The form embedded on this page
		formId: uuid("form_id"),

		// Analytics (stored periodically by a background job / webhook)
		conversionRate: real("conversion_rate"),

		// SEO
		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		focusKeyword: text("focus_keyword"),

		// HubSpot list this page feeds into
		hubspotListId: text("hubspot_list_id"),

		createdBy: uuid("created_by").references(() => profiles.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		slugIdx: index("landing_pages_slug_idx").on(table.slug),
		statusIdx: index("landing_pages_status_idx").on(table.status),
	}),
);

export type LandingPage = typeof landingPages.$inferSelect;
export type NewLandingPage = typeof landingPages.$inferInsert;
