//@lib/db/schema/leads.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leadSourceEnum, leadStatusEnum } from "./enums";
import { adminUsers } from "./users";
import { projects } from "./projects";

export const leads = pgTable("leads", {
	id: uuid("id").defaultRandom().primaryKey(),
	fullName: text("full_name").notNull(),
	email: text("email"),
	phoneNumber: text("phone_number"),

	// projectId nullable — a lead might come in without specifying a project
	projectId: uuid("project_id").references(() => projects.id, {
		onDelete: "set null",
	}),
	// Denormalised slug for display if the project row is later deleted
	projectSlug: text("project_slug"),

	source: leadSourceEnum("source").notNull().default("website"),
	status: leadStatusEnum("status").notNull().default("new"),
	budgetRange: text("budget_range"),
	enquiryType: text("enquiry_type"),
	message: text("message"),
	notes: text("notes"),

	// UTM tracking (from query params at submission time)
	utmSource: text("utm_source"),
	utmMedium: text("utm_medium"),
	utmCampaign: text("utm_campaign"),

	assignedToUserId: uuid("assigned_to_user_id").references(
		() => adminUsers.id,
		{ onDelete: "set null" },
	),

	createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;