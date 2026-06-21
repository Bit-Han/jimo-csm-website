// lib/db/schema/settings.ts
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// app_settings
// Single-row table holding all global company + integration settings.
// Sensitive API keys are encrypted at the application layer before storage
// (see lib/utils/crypto.ts). Never return raw keys to the client.
// ─────────────────────────────────────────────────────────────────────────────
export const appSettings = pgTable("app_settings", {
	id: uuid("id").primaryKey().defaultRandom(),

	// ── Company info ──
	companyName: text("company_name")
		.notNull()
		.default("Jimo Property Development Limited"),
	companyEmail: text("company_email"),
	salesEmail: text("sales_email"),
	phoneNumber: text("phone_number"),
	whatsappNumber: text("whatsapp_number"),
	officeAddress: text("office_address"),

	// ── Social media ──
	instagramUrl: text("instagram_url"),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	youtubeUrl: text("youtube_url"),

	// ── Integrations (encrypted values stored as AES-256 cipher text) ──
	resendApiKeyEncrypted: text("resend_api_key_encrypted"),
	hubspotAccessTokenEncrypted: text("hubspot_access_token_encrypted"),
	cloudinaryCloudName: text("cloudinary_cloud_name"),
	cloudinaryApiKeyEncrypted: text("cloudinary_api_key_encrypted"),
	cloudinaryApiSecretEncrypted: text("cloudinary_api_secret_encrypted"),

	// ── System status flags (refreshed by health-check cron) ──
	crmConnected: boolean("crm_connected").default(false),
	emailConnected: boolean("email_connected").default(false),
	backupSchedule: text("backup_schedule").default("daily_02_00_WAT"),
	lastBackupAt: timestamp("last_backup_at", { withTimezone: true }),

	// ── Website defaults ──
	defaultCurrency: text("default_currency").notNull().default("NGN"),
	timezone: text("timezone").notNull().default("Africa/Lagos"),
	googleAnalyticsId: text("google_analytics_id"),
	googleTagManagerId: text("google_tag_manager_id"),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type AppSettings = typeof appSettings.$inferSelect;
