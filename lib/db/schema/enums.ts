import { pgEnum } from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
	"completed",
	"under-development",
]);

export const projectCategoryEnum = pgEnum("project_category", [
	"residential",
	"hospitality",
]);

export const projectUnitIconEnum = pgEnum("project_unit_icon", [
	"home",
	"building",
]);

export const projectChecklistKindEnum = pgEnum("project_checklist_kind", [
	"investment_highlight",
	"payment_plan",
]);

export const projectMediaTypeEnum = pgEnum("project_media_type", [
	"image",
	"video",
]);

export const publishStatusEnum = pgEnum("publish_status", [
	"draft",
	"published",
]);

export const leadSourceEnum = pgEnum("lead_source", [
	"website",
	"landing_page",
	"whatsapp",
	"instagram",
	"google",
	"referral",
	"brochure",
]);

export const leadStatusEnum = pgEnum("lead_status", [
	"new",
	"contacted",
	"qualified",
	"inspection",
	"negotiation",
	"won",
	"lost",
]);

export const brochureStatusEnum = pgEnum("brochure_status", [
	"draft",
	"active",
]);

export const insightCategoryEnum = pgEnum("insight_category", [
	"location-analysis",
	"investment-education",
	"project-update",
]);

export const mediaResourceTypeEnum = pgEnum("media_resource_type", [
	"image",
	"video",
	"raw",
]);

export const formStatusEnum = pgEnum("form_status", [
	"active",
	"review",
	"draft",
]);

export const formFieldTypeEnum = pgEnum("form_field_type", [
	"text",
	"phone",
	"email",
	"dropdown",
	"radio",
	"budget_range",
	"textarea",
	"hidden",
	"consent",
]);

export const adminRoleEnum = pgEnum("admin_role", [
	"super-admin",
	"website-manager",
	"content-seo",
	"sales-crm",
	"marketing-admin",
]);

export const adminStatusEnum = pgEnum("admin_status", ["active", "inactive"]);

// ─── New ──────────────────────────────────────────────────────────────────
// Tracks the lifecycle of an invitation link.
// pending  → sent, waiting for the recipient to click and sign up
// accepted → recipient completed signup; a matching admin_users row exists
// expired  → token passed its expiry window without being used
// revoked  → SuperAdmin cancelled the invite before it was accepted
export const invitationStatusEnum = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"expired",
	"revoked",
]);

export const trackingPlatformEnum = pgEnum("tracking_platform", [
	"google_tag_manager",
	"google_analytics_4",
	"meta_pixel",
	"tiktok_pixel",
	"linkedin_insight_tag",
	"x_pixel",
	"snapchat_pixel",
]);

export const trackingEventCategoryEnum = pgEnum("tracking_event_category", [
	"awareness",
	"lead_generation",
	"engagement",
	"conversion",
]);

export const trackingEventStatusEnum = pgEnum("tracking_event_status", [
	"active",
	"inactive",
	"testing",
]);
// ─── SEO ──────────────────────────────────────────────────────────────────

export const seoPageTypeEnum = pgEnum("seo_page_type", [
  "home",
  "insight",
  "project",
  "company-page",
  "landing-page",
]);

export const seoIssueTypeEnum = pgEnum("seo_issue_type", [
  "meta",      // missing title, description
  "content",   // thin content, missing keywords
  "images",    // missing alt text
  "technical", // no-index, duplicate title, canonical missing
]);

export const seoIssueSeverityEnum = pgEnum("seo_issue_severity", [
  "error",    // blocks indexing / ranking
  "warning",  // degrades performance
  "info",     // best-practice suggestion
]);

export const seoIssueStatusEnum = pgEnum("seo_issue_status", [
  "open",
  "resolved",
  "ignored",
]);

// search_type maps directly to Google Search Console's `searchType` field.
// ai_overview and ai_mode are the new values added with the June 2026 report.
export const gscSearchTypeEnum = pgEnum("gsc_search_type", [
  "web",
  "image",
  "news",
  "discover",
  "video",
  "ai_overview", // page appeared inside a Google AI Overview summary
  "ai_mode",     // page appeared in Google's dedicated AI Mode search
]);

// Platforms we run manual or automated AI visibility tests against.
export const aiVisibilityPlatformEnum = pgEnum("ai_visibility_platform", [
  "chatgpt",
  "perplexity",
  "claude",
  "gemini",
  "grok",
  "copilot",
]);