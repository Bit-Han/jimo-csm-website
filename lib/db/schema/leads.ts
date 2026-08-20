// //@/lib/db/schema/leads.ts

// import {
// 	integer,
// 	pgTable,
// 	text,
// 	timestamp,
// 	uniqueIndex,
// 	uuid,
// } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";
// import { leadSourceEnum, leadStatusEnum } from "./enums";
// import { adminUsers } from "./users";
// import { projects } from "./projects";
// import { landingPages } from "./landing-page";

// export const leads = pgTable(
// 	"leads",
// 	{
// 		id: uuid("id").defaultRandom().primaryKey(),
// 		fullName: text("full_name").notNull(),
// 		email: text("email"),
// 		phoneNumber: text("phone_number"),

// 		projectId: uuid("project_id").references(() => projects.id, {
// 			onDelete: "set null",
// 		}),
// 		projectSlug: text("project_slug"),

// 		landingPageId: uuid("landing_page_id").references(() => landingPages.id, {
// 			onDelete: "set null",
// 		}),
// 		landingPageSlug: text("landing_page_slug"),

// 		source: leadSourceEnum("source").notNull().default("website"),
// 		status: leadStatusEnum("status").notNull().default("new"),
// 		budgetRange: text("budget_range"),
// 		enquiryType: text("enquiry_type"),
// 		message: text("message"),
// 		notes: text("notes"),

// 		utmSource: text("utm_source"),
// 		utmMedium: text("utm_medium"),
// 		utmCampaign: text("utm_campaign"),

// 		assignedToUserId: uuid("assigned_to_user_id").references(
// 			() => adminUsers.id,
// 			{ onDelete: "set null" },
// 		),

// 		brevoContactId: text("brevo_contact_id"),
// 		syncedToBrevoAt: timestamp("synced_to_brevo_at"),

// 		// ── Brochure delivery tracking — only meaningful when source = 'brochure'.
// 		// Lives directly on the lead row instead of a separate table: the
// 		// unique index below (not a second table) is what makes claiming
// 		// atomic, and keeping it here means there's only ever one write, one
// 		// row, and zero risk of a tracking table drifting out of sync with
// 		// the actual lead.
// 		brochureDeliveredAt: timestamp("brochure_delivered_at"),
// 		brochureLastAttemptAt: timestamp("brochure_last_attempt_at"),
// 		brochureAttemptCount: integer("brochure_attempt_count")
// 			.notNull()
// 			.default(1),

// 		createdAt: timestamp("created_at").defaultNow().notNull(),
// 		updatedAt: timestamp("updated_at").defaultNow().notNull(),
// 	},
// 	(table) => ({
// 		// Scoped to source = 'brochure' only — a website/whatsapp/instagram
// 		// lead, or a brochure request for a DIFFERENT project, never touches
// 		// this index at all. One brochure lead per project+email, full stop.
// 		brochureDedupeIdx: uniqueIndex("leads_brochure_dedupe_idx")
// 			.on(table.projectSlug, table.email)
// 			.where(
// 				sql`${table.source} = 'brochure' AND ${table.projectSlug} IS NOT NULL AND ${table.email} IS NOT NULL`,
// 			),
// 	}),
// ).enableRLS();

// export type LeadRow = typeof leads.$inferSelect;
// export type NewLeadRow = typeof leads.$inferInsert;

// lib/db/schema/leads.ts
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leadSourceEnum, leadStatusEnum } from "./enums";
import { adminUsers } from "./users";
import { projects } from "./projects";
import { landingPages } from "./landing-page";

// NOTE: the partial unique index on (project_slug, lower(email)) WHERE
// source = 'brochure' is NOT declared here. Drizzle's schema-diffing
// doesn't reliably express a functional (lower(...)) partial index across
// versions, and this index is exactly what makes brochure dedupe safe —
// too important to risk drizzle-kit silently regenerating it wrong on a
// future `push`. It's created and owned by the raw migration SQL. Treat
// `leads_brochure_dedupe_idx` as a permanent fixture: don't let
// `drizzle-kit push` or `generate` touch it, and if you ever regenerate
// migrations from scratch, re-add this index manually at the end.
export const leads = pgTable("leads", {
	id: uuid("id").defaultRandom().primaryKey(),
	fullName: text("full_name").notNull(),
	email: text("email"),
	phoneNumber: text("phone_number"),

	projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
	projectSlug: text("project_slug"),

	landingPageId: uuid("landing_page_id").references(() => landingPages.id, { onDelete: "set null" }),
	landingPageSlug: text("landing_page_slug"),

	source: leadSourceEnum("source").notNull().default("website"),
	status: leadStatusEnum("status").notNull().default("new"),
	budgetRange: text("budget_range"),
	enquiryType: text("enquiry_type"),
	message: text("message"),
	notes: text("notes"),

	utmSource: text("utm_source"),
	utmMedium: text("utm_medium"),
	utmCampaign: text("utm_campaign"),

	assignedToUserId: uuid("assigned_to_user_id").references(() => adminUsers.id, { onDelete: "set null" }),

	brevoContactId: text("brevo_contact_id"),
	syncedToBrevoAt: timestamp("synced_to_brevo_at"),

	// Brochure delivery tracking — only meaningful when source = 'brochure'.
	brochureDeliveredAt: timestamp("brochure_delivered_at"),
	brochureLastAttemptAt: timestamp("brochure_last_attempt_at"),
	brochureAttemptCount: integer("brochure_attempt_count").notNull().default(1),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;