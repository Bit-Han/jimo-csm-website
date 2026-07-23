// lib/db/schema/landing-pages.ts
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { publishStatusEnum } from "./enums";
import { adminUsers } from "./users";
import { projects } from "./projects";
import { forms } from "./forms";
import type { LandingHeroContent } from "@/lib/types/landing-page";

export const landingPages = pgTable("landing_pages", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),

	// Internal name only — shown in the admin table, never rendered
	// publicly. Same convention as forms.title / insights.title.
	title: text("title").notNull(),

	campaignType: text("campaign_type"),
	audience: text("audience"),
	crmTag: text("crm_tag"),

	// Optional — lets the builder prefill hero copy from a real project and
	// lets the admin list show "Linked: Jimo Residences Yaba." Denormalised
	// slug alongside the FK for the same reason leads does it: display
	// keeps working even if the project is later deleted.
	linkedProjectId: uuid("linked_project_id").references(() => projects.id, {
		onDelete: "set null",
	}),
	linkedProjectSlug: text("linked_project_slug"),

	// Everything the hero needs to render — theme id + all editable
	// copy/media — see lib/types/landing-page.ts. One JSONB column, not a
	// table-per-field, because the hero *is* the entire page here: there's
	// no multi-section builder to normalise, matching "only the hero
	// section, no need to go further down."
	hero: jsonb("hero").$type<LandingHeroContent>().notNull(),

	// Which existing Form (from the Forms module) the hero's CTA(s) open as
	// an overlay. Nullable at draft time — the publish guard requires it.
	formId: uuid("form_id").references(() => forms.id, { onDelete: "set null" }),

	publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),

	createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export type LandingPageRow = typeof landingPages.$inferSelect;
export type NewLandingPageRow = typeof landingPages.$inferInsert;
