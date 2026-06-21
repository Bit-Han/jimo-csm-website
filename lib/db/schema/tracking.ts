// lib/db/schema/tracking.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import {
  trackingIntegrationEnum,
  trackingIntegrationStatusEnum,
  trackingEventCategoryEnum,
  trackingEventStatusEnum,
} from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// tracking_integrations
// Pixel / analytics connections (GTM, GA4, Meta, TikTok, LinkedIn etc.)
// One row per integration — upserted on save.
// ─────────────────────────────────────────────────────────────────────────────
export const trackingIntegrations = pgTable("tracking_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: trackingIntegrationEnum("name").notNull().unique(),
  status: trackingIntegrationStatusEnum("status")
    .notNull()
    .default("disconnected"),
  // The actual tracking ID / container ID / pixel ID
  trackingId: text("tracking_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// tracking_events
// Configured conversion events (fired on form submit, brochure download etc.)
// destinations is a text array: ["GTM", "GA4", "Meta"]
// ─────────────────────────────────────────────────────────────────────────────
export const trackingEvents = pgTable("tracking_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // "form_submit", "whatsapp_click"
  trigger: text("trigger").notNull(),    // "Form Submitted", "Click on WhatsApp Link"
  destinations: text("destinations").array().notNull().default([]),
  status: trackingEventStatusEnum("status").notNull().default("active"),
  category: trackingEventCategoryEnum("category")
    .notNull()
    .default("lead_generation"),
  // Rolling 30-day count — updated by analytics webhook / cron
  count30d: integer("count_30d").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// page_view_stats
// Denormalised stats updated by a cron / analytics sync job.
// One row per day per page — keeps the tracking dashboard fast.
// ─────────────────────────────────────────────────────────────────────────────
export const pageViewStats = pgTable("page_view_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  pagePath: text("page_path").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  views: integer("views").notNull().default(0),
  formSubmits: integer("form_submits").default(0),
  brochureLeads: integer("brochure_leads").default(0),
  whatsappClicks: integer("whatsapp_clicks").default(0),
  phoneClicks: integer("phone_clicks").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type TrackingIntegration = typeof trackingIntegrations.$inferSelect;
export type TrackingEvent = typeof trackingEvents.$inferSelect;