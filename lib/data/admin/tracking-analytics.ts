import type {
  AdminTrackingEventRow,
  AdminTrackingIntegration,
  ConversionEventBar,
  TrackingStatCard,
} from "@/lib/types/admin/tracking-analytics";

// TODO (integration stage):
// integrations → db.query.trackingIntegrations.findMany()
// events       → db.query.trackingEvents.findMany({ with: { destinations: true } })
// stat cards   → real counts from GA4 Reporting API or cached in analytics_cache table

export const mockTrackingStats: TrackingStatCard[] = [
  { id: "page-views", label: "Page Views", value: 28540, changePercent: 18 },
  { id: "form-submits", label: "Form Submits", value: 346, changePercent: 22 },
  { id: "brochure-leads", label: "Brochure Leads", value: 193, changePercent: 19 },
  { id: "whatsapp-clicks", label: "WhatsApp Clicks", value: 87, changePercent: 16 },
];

export const mockConversionEvents: ConversionEventBar[] = [
  { id: "lpv", eventName: "landing_page_view", count: 28540, percentage: 68 },
  { id: "fs", eventName: "form_submit", count: 346, percentage: 33 },
  { id: "bfs", eventName: "brochure_form_submit", count: 193, percentage: 25 },
  { id: "wc", eventName: "whatsapp_click", count: 87, percentage: 14 },
  { id: "pc", eventName: "phone_click", count: 42, percentage: 8 },
];

// isConnected reflects seeded state — all false until real IDs are entered.
// The screenshot shows "Connected" because it is a design mockup.
export const mockTrackingIntegrations: AdminTrackingIntegration[] = [
  {
    platform: "google_tag_manager",
    label: "Google Tag Manager",
    isConnected: false,
    configKey: "containerId",
    configLabel: "Container ID",
    configPlaceholder: "GTM-XXXXXXX",
    currentValue: "",
  },
  {
    platform: "google_analytics_4",
    label: "Google Analytics 4",
    isConnected: false,
    configKey: "measurementId",
    configLabel: "Measurement ID",
    configPlaceholder: "G-XXXXXXXXXX",
    currentValue: "",
  },
  {
    platform: "meta_pixel",
    label: "Meta Pixel",
    isConnected: false,
    configKey: "pixelId",
    configLabel: "Pixel ID",
    configPlaceholder: "1234567890123456",
    currentValue: "",
  },
  {
    platform: "tiktok_pixel",
    label: "TikTok Pixel",
    isConnected: false,
    configKey: "pixelId",
    configLabel: "Pixel ID",
    configPlaceholder: "CXXXXXXXXXXXXXXXXXXXXXXXXXX",
    currentValue: "",
  },
  {
    platform: "linkedin_insight_tag",
    label: "LinkedIn Insight Tag",
    isConnected: false,
    configKey: "partnerId",
    configLabel: "Partner ID",
    configPlaceholder: "1234567",
    currentValue: "",
  },
  {
    platform: "x_pixel",
    label: "X / Twitter Pixel",
    isConnected: false,
    configKey: "pixelId",
    configLabel: "Pixel ID",
    configPlaceholder: "o1234",
    currentValue: "",
  },
  {
    platform: "snapchat_pixel",
    label: "Snapchat Pixel",
    isConnected: false,
    configKey: "pixelId",
    configLabel: "Pixel ID",
    configPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    currentValue: "",
  },
];

export const mockTrackingEventRows: AdminTrackingEventRow[] = [
  {
    id: "ev-1",
    eventName: "landing_page_view",
    trigger: "All Page Views",
    destinations: "GTM · GA4 · Meta",
    status: "active",
    category: "awareness",
  },
  {
    id: "ev-2",
    eventName: "form_submit",
    trigger: "Form Submitted",
    destinations: "GTM · GA4 · CRM",
    status: "active",
    category: "lead_generation",
  },
  {
    id: "ev-3",
    eventName: "brochure_form_submit",
    trigger: "Form Submitted (Brochure)",
    destinations: "GTM · GA4",
    status: "active",
    category: "lead_generation",
  },
  {
    id: "ev-4",
    eventName: "whatsapp_click",
    trigger: "Click on WhatsApp Link",
    destinations: "GTM · Meta",
    status: "active",
    category: "engagement",
  },
  {
    id: "ev-5",
    eventName: "phone_click",
    trigger: "Click on Phone Link",
    destinations: "GTM · Google Ads",
    status: "active",
    category: "engagement",
  },
];