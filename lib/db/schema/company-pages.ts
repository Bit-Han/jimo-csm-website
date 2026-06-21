// lib/db/schema/company-pages.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	jsonb,
	index,
} from "drizzle-orm/pg-core";
import { companyPageTypeEnum, contentStatusEnum } from "./enums";
import { profiles } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// CompanyPageSection — shape stored in companyPages.sections JSONB
// ─────────────────────────────────────────────────────────────────────────────
export type CompanyPageSection = {
	id: string;
	label: string; // "Hero", "Services Preview", "Final CTA"
	type: string; // section template type key
	status: "published" | "draft";
	seoScore?: "good" | "needs_attention" | "missing";
	content: Record<string, unknown>; // all editable fields for that section
	orderIndex: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// company_pages
// Static informational pages — Home, About Us, Services, Corporate Statement etc.
// ─────────────────────────────────────────────────────────────────────────────
export const companyPages = pgTable(
	"company_pages",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		type: companyPageTypeEnum("type").notNull(),
		status: contentStatusEnum("status").notNull().default("draft"),

		// Ordered sections (see CompanyPageSection type)
		sections: jsonb("sections")
			.$type<CompanyPageSection[]>()
			.notNull()
			.default([]),

		// SEO
		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		focusKeyword: text("focus_keyword"),

		lastEditedBy: uuid("last_edited_by").references(() => profiles.id, {
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
		slugIdx: index("company_pages_slug_idx").on(table.slug),
		typeIdx: index("company_pages_type_idx").on(table.type),
	}),
);

export type CompanyPage = typeof companyPages.$inferSelect;
export type NewCompanyPage = typeof companyPages.$inferInsert;
