// lib/db/schema/leads.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	bigint,
	jsonb,
	index,
} from "drizzle-orm/pg-core";
import { leadStatusEnum, leadSourceEnum, leadActivityTypeEnum } from "./enums";
import { profiles } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// leads
// Captured from any form on the public site or landing pages.
// HubSpot is synced asynchronously — hubspotContactId set after sync.
// ─────────────────────────────────────────────────────────────────────────────
export const leads = pgTable(
	"leads",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		// ── Contact info ──
		name: text("name").notNull(),
		email: text("email"),
		phone: text("phone").notNull(),
		countryOfResidence: text("country_of_residence"),

		// ── What they're interested in ──
		projectId: uuid("project_id"), // FK → projects.id
		landingPageId: uuid("landing_page_id"), // FK → landing_pages.id
		formId: uuid("form_id").notNull(), // FK → forms.id

		unitInterest: text("unit_interest"), // "2 Bedroom Apartment"
		// Budget stored in Kobo; null if not provided
		budgetMinKobo: bigint("budget_min_kobo", { mode: "number" }),
		budgetMaxKobo: bigint("budget_max_kobo", { mode: "number" }),
		buyingPurpose: text("buying_purpose"), // "Owner Occupation", "Investment"
		preferredPlan: text("preferred_plan"), // "12 Months"
		message: text("message"),

		// ── Traffic / attribution ──
		source: leadSourceEnum("source").notNull().default("website"),
		sourcePage: text("source_page"),
		utmSource: text("utm_source"),
		utmMedium: text("utm_medium"),
		utmCampaign: text("utm_campaign"),
		utmContent: text("utm_content"),
		device: text("device"), // "Mobile Android"
		referrer: text("referrer"), // "google.com"
		ipAddress: text("ip_address"),

		// ── CRM workflow ──
		status: leadStatusEnum("status").notNull().default("new"),
		assignedTo: uuid("assigned_to").references(() => profiles.id, {
			onDelete: "set null",
		}),

		// ── HubSpot ──
		hubspotContactId: text("hubspot_contact_id"),
		hubspotDealId: text("hubspot_deal_id"),

		// ── Extra data from the form (any fields not mapped above) ──
		extraData: jsonb("extra_data").$type<Record<string, string>>(),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		statusIdx: index("leads_status_idx").on(table.status),
		projectIdIdx: index("leads_project_id_idx").on(table.projectId),
		assignedToIdx: index("leads_assigned_to_idx").on(table.assignedTo),
		hubspotContactIdx: index("leads_hubspot_contact_idx").on(
			table.hubspotContactId,
		),
		createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
	}),
);

// ─────────────────────────────────────────────────────────────────────────────
// lead_activities
// Append-only log of everything that happened to a lead.
// System actions (auto-response, brochure) set createdBy to null.
// ─────────────────────────────────────────────────────────────────────────────
export const leadActivities = pgTable(
	"lead_activities",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		leadId: uuid("lead_id")
			.notNull()
			.references(() => leads.id, { onDelete: "cascade" }),
		type: leadActivityTypeEnum("type").notNull(),
		description: text("description").notNull(),
		// null = system action; uuid = staff member who took the action
		createdBy: uuid("created_by").references(() => profiles.id, {
			onDelete: "set null",
		}),
		metadata: jsonb("metadata").$type<Record<string, unknown>>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		leadIdIdx: index("lead_activities_lead_id_idx").on(table.leadId),
	}),
);

// ─────────────────────────────────────────────────────────────────────────────
// lead_notes
// Sales team notes on a lead. Supports @mention via mentionedUsers array.
// ─────────────────────────────────────────────────────────────────────────────
export const leadNotes = pgTable(
	"lead_notes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		leadId: uuid("lead_id")
			.notNull()
			.references(() => leads.id, { onDelete: "cascade" }),
		content: text("content").notNull(),
		createdBy: uuid("created_by")
			.notNull()
			.references(() => profiles.id, { onDelete: "cascade" }),
		// Array of profile UUIDs who were @mentioned
		mentionedUsers: uuid("mentioned_users").array().default([]),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		leadIdIdx: index("lead_notes_lead_id_idx").on(table.leadId),
	}),
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type LeadNote = typeof leadNotes.$inferSelect;
