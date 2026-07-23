
import {
	boolean,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import {
	trackingEventCategoryEnum,
	trackingEventStatusEnum,
	trackingPlatformEnum,
} from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// Platform config shapes
//
// Each platform stores a different set of credentials in its JSONB config
// column. TypeScript types ensure the CMS editor sends the right shape and
// the public site reads it safely.
//
// These are stored as JSONB (not separate columns) because:
//   1. Each platform has a different config structure
//   2. Platforms can be added without schema migrations
//   3. The Tracking & Analytics CMS screen renders them generically
// ─────────────────────────────────────────────────────────────────────────────

export interface GtmConfig {
	containerId: string; // GTM-XXXXXXX
}

export interface Ga4Config {
	measurementId: string; // G-XXXXXXXXXX
	// Optional: send server-side events via Measurement Protocol
	apiSecret?: string;
}

export interface MetaPixelConfig {
	pixelId: string; // numeric string, e.g. "1234567890123456"
	// Optional: Meta Conversions API token for server-side event matching
	// This improves attribution accuracy when browser ad blockers are present
	conversionApiToken?: string;
	testEventCode?: string; // Used during testing: "TEST12345"
}

export interface TikTokPixelConfig {
	pixelId: string; // CXXXXXXXXXXXXXXXXXXXXXXXXXX
	// Optional: TikTok Events API access token for server-side events
	eventsApiAccessToken?: string;
}

export interface LinkedInInsightConfig {
	partnerId: string; // numeric string, e.g. "1234567"
}

export interface XPixelConfig {
	pixelId: string; // alphanumeric, e.g. "o1234"
}

export interface SnapchatPixelConfig {
	pixelId: string; // UUID format, e.g. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}

export type TrackingPlatformConfig =
	| GtmConfig
	| Ga4Config
	| MetaPixelConfig
	| TikTokPixelConfig
	| LinkedInInsightConfig
	| XPixelConfig
	| SnapchatPixelConfig;

// ─────────────────────────────────────────────────────────────────────────────
// tracking_integrations
//
// One row per platform. The CMS Tracking & Analytics screen reads this table
// to show connection status and lets the admin update config values.
// The public site reads this at build time (or on-demand) to inject the
// correct script tags into layout.tsx.
//
// isConnected is set to true when:
//   - The config has been saved with valid credentials
//   - The admin clicks "Test Events" and the platform responds successfully
// ─────────────────────────────────────────────────────────────────────────────
export const trackingIntegrations = pgTable("tracking_integrations", {
	id: uuid("id").defaultRandom().primaryKey(),
	platform: trackingPlatformEnum("platform").notNull().unique(),

	// Human-readable label shown in the CMS table
	label: text("label").notNull(),

	isConnected: boolean("is_connected").notNull().default(false),

	// Platform-specific credentials — see type above
	// Encrypted at rest via Supabase Vault in the production integration stage
	config: jsonb("config").$type<TrackingPlatformConfig>(),

	// Last time the admin saved/tested this integration
	lastVerifiedAt: timestamp("last_verified_at"),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

// ─────────────────────────────────────────────────────────────────────────────
// tracking_events
//
// Defines the conversion events the site fires. Each event maps to one or
// more platform destinations (stored in tracking_event_destinations below).
//
// Examples from the Tracking & Analytics screenshot:
//   landing_page_view  → trigger: All Page Views       → GTM · GA4 · Meta
//   form_submit        → trigger: Form Submitted        → GTM · GA4 · CRM
//   brochure_form_submit → Form Submitted (Brochure)   → GTM · GA4
//   whatsapp_click     → Click on WhatsApp Link         → GTM · Meta
//   phone_click        → Click on Phone Link            → GTM · Google Ads
// ─────────────────────────────────────────────────────────────────────────────
export const trackingEvents = pgTable("tracking_events", {
	id: uuid("id").defaultRandom().primaryKey(),

	// The technical event name sent to platforms, e.g. "form_submit"
	// Snake case, no spaces — this is what goes into dataLayer.push()
	eventName: text("event_name").notNull().unique(),

	// Human-readable trigger description shown in the CMS table
	// e.g. "Form Submitted", "Click on WhatsApp Link"
	trigger: text("trigger").notNull(),

	category: trackingEventCategoryEnum("category").notNull(),
	status: trackingEventStatusEnum("status").notNull().default("active"),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

// ─────────────────────────────────────────────────────────────────────────────
// tracking_event_destinations
//
// Junction table: which platforms each event fires to.
// A single event (e.g. form_submit) can go to GTM, GA4, and Meta simultaneously.
// This lets the admin add or remove a destination without editing the event itself.
// ─────────────────────────────────────────────────────────────────────────────
export const trackingEventDestinations = pgTable(
	"tracking_event_destinations",
	{
		id: uuid("id").defaultRandom().primaryKey(),

		eventId: uuid("event_id")
			.notNull()
			.references(() => trackingEvents.id, { onDelete: "cascade" }),

		platform: trackingPlatformEnum("platform").notNull(),
	},
).enableRLS();

export type TrackingIntegrationRow = typeof trackingIntegrations.$inferSelect;
export type NewTrackingIntegrationRow =
	typeof trackingIntegrations.$inferInsert;
export type TrackingEventRow = typeof trackingEvents.$inferSelect;
export type NewTrackingEventRow = typeof trackingEvents.$inferInsert;
export type TrackingEventDestinationRow =
	typeof trackingEventDestinations.$inferSelect;