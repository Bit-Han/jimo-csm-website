// lib/db/schema/tracking-logs.ts
import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// tracking_event_logs
//
// Our own first-party record of every trackEvent() call fired from the
// public site. This is what actually powers the stat cards and conversion
// bars on the Tracking & Analytics admin page — independent of whether any
// third-party pixel is even connected yet. Real GA4/pixel numbers live in
// Google/Meta's own systems and require their reporting APIs (a later,
// separate integration); this table is ours, always available, and free.
// ─────────────────────────────────────────────────────────────────────────────
export const trackingEventLogs = pgTable(
	"tracking_event_logs",
	{
		id: uuid("id").defaultRandom().primaryKey(),

		// Free text, validated against a fixed constant list at the API
		// route layer (lib/constants/tracking-events.ts) rather than a
		// Postgres enum — same reasoning as insights.category: extensible
		// without a migration, and the allow-list still guards against junk.
		eventName: text("event_name").notNull(),

		pagePath: text("page_path").notNull(),
		landingPageSlug: text("landing_page_slug"),
		projectSlug: text("project_slug"),

		referrer: text("referrer"),
		userAgent: text("user_agent"),

		metadata: jsonb("metadata").$type<Record<string, string>>(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		eventCreatedIdx: index("tracking_event_logs_event_created_idx").on(
			table.eventName,
			table.createdAt,
		),
	}),
).enableRLS();

export type TrackingEventLogRow = typeof trackingEventLogs.$inferSelect;
export type NewTrackingEventLogRow = typeof trackingEventLogs.$inferInsert;
