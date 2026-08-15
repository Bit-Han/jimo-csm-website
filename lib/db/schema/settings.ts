
//@/lib/db/schema/settings.ts
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Singleton — always upsert id=1.
// Drives siteConfig on the public site.
export const siteSettings = pgTable("site_settings", {
	id: integer("id").primaryKey().default(1),
	companyName: text("company_name").notNull(),
	legalName: text("legal_name").notNull(),
	companyEmail: text("company_email").notNull(),
	tagline: text("tagline").notNull().default("Property Development"),
	description: text("description").notNull().default("Premium residential, hospitality, and investment-led real estate developments built with structure, insight, and long-term value."),
	salesEmail: text("sales_email"),
	phone: text("phone").notNull(),
	whatsappNumber: text("whatsapp_number"), // raw, as entered by the admin
	whatsappHref: text("whatsapp_href").notNull(), // computed wa.me link — public-facing
	instagramHandle: text("instagram_handle"),
	address: text("address").notNull(),
	responseTimeNote: text("response_time_note").notNull(),

	instagramUrl: text("instagram_url"),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	youtubeUrl: text("youtube_url"),

	// Notifications
	newLeadEmailEnabled: boolean("new_lead_email_enabled")
		.notNull()
		.default(true),
	newLeadNotificationEmail: text("new_lead_notification_email"),

	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type NewSiteSettingsRow = typeof siteSettings.$inferInsert;