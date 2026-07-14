// lib/db/seeds/tracking.ts
import { seedDb } from "../seed-client"; // ← direct connection, not db
import { trackingEvents, trackingIntegrations } from "../schema";

export async function seedTracking() {
  // ── Integrations ──────────────────────────────────────────────────────────
  await seedDb
    .insert(trackingIntegrations)
    .values([
      { platform: "google_tag_manager", label: "Google Tag Manager", isConnected: false },
      { platform: "google_analytics_4", label: "Google Analytics 4", isConnected: false },
      { platform: "meta_pixel", label: "Meta Pixel", isConnected: false },
      { platform: "tiktok_pixel", label: "TikTok Pixel", isConnected: false },
      { platform: "linkedin_insight_tag", label: "LinkedIn Insight Tag", isConnected: false },
      { platform: "x_pixel", label: "X / Twitter Pixel", isConnected: false },
      { platform: "snapchat_pixel", label: "Snapchat Pixel", isConnected: false },
    ])
    .onConflictDoNothing();

  console.log("✓ Tracking integrations seeded.");

  // ── Events ────────────────────────────────────────────────────────────────
  await seedDb
    .insert(trackingEvents)
    .values([
      { eventName: "landing_page_view", trigger: "All Page Views", category: "awareness", status: "active" },
      { eventName: "form_submit", trigger: "Form Submitted", category: "lead_generation", status: "active" },
      { eventName: "brochure_form_submit", trigger: "Form Submitted (Brochure)", category: "lead_generation", status: "active" },
      { eventName: "whatsapp_click", trigger: "Click on WhatsApp Link", category: "engagement", status: "active" },
      { eventName: "phone_click", trigger: "Click on Phone Link", category: "engagement", status: "active" },
    ])
    .onConflictDoNothing();

  console.log("✓ Tracking events seeded.");
}