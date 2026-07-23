// //@lib/db/schema/leads.ts
// import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
// import { leadSourceEnum, leadStatusEnum } from "./enums";
// import { adminUsers } from "./users";
// import { projects } from "./projects";

// export const leads = pgTable("leads", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	fullName: text("full_name").notNull(),
// 	email: text("email"),
// 	phoneNumber: text("phone_number"),

// 	// projectId nullable — a lead might come in without specifying a project
// 	projectId: uuid("project_id").references(() => projects.id, {
// 		onDelete: "set null",
// 	}),
// 	// Denormalised slug for display if the project row is later deleted
// 	projectSlug: text("project_slug"),

// 	source: leadSourceEnum("source").notNull().default("website"),
// 	status: leadStatusEnum("status").notNull().default("new"),
// 	budgetRange: text("budget_range"),
// 	enquiryType: text("enquiry_type"),
// 	message: text("message"),
// 	notes: text("notes"),

// 	// UTM tracking (from query params at submission time)
// 	utmSource: text("utm_source"),
// 	utmMedium: text("utm_medium"),
// 	utmCampaign: text("utm_campaign"),

// 	assignedToUserId: uuid("assigned_to_user_id").references(
// 		() => adminUsers.id,
// 		{ onDelete: "set null" },
// 	),

// 	createdAt: timestamp("created_at").defaultNow().notNull(),
// }).enableRLS();

// export type LeadRow = typeof leads.$inferSelect;
// export type NewLeadRow = typeof leads.$inferInsert;

//@lib/db/schema/leads.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leadSourceEnum, leadStatusEnum } from "./enums";
import { adminUsers } from "./users";
import { projects } from "./projects";
import { landingPages } from "./landing-page";

export const leads = pgTable("leads", {
	id: uuid("id").defaultRandom().primaryKey(),
	fullName: text("full_name").notNull(),
	email: text("email"),
	phoneNumber: text("phone_number"),

	projectId: uuid("project_id").references(() => projects.id, {
		onDelete: "set null",
	}),
	projectSlug: text("project_slug"),

	// Same denormalisation pattern as project — a lead that came from a
	// landing page keeps showing which one, and its slug, even if that
	// landing page is later deleted.
	landingPageId: uuid("landing_page_id").references(() => landingPages.id, {
		onDelete: "set null",
	}),
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

	assignedToUserId: uuid("assigned_to_user_id").references(
		() => adminUsers.id,
		{ onDelete: "set null" },
	),

	// Forward-compatible fields for the Brevo email-campaign sync.
	brevoContactId: text("brevo_contact_id"),
	syncedToBrevoAt: timestamp("synced_to_brevo_at"),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;