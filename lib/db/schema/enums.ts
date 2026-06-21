// lib/db/schema/enums.ts
// ─────────────────────────────────────────────────────
// All PostgreSQL enums live here so they can be imported
// cleanly by any schema file without circular deps.
// ─────────────────────────────────────────────────────
import { pgEnum } from "drizzle-orm/pg-core";

// ── Users ─────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
	"super_admin",
	"website_manager",
	"content_seo",
	"sales_crm",
	"marketing_admin",
]);

export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);

export const invitationStatusEnum = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"expired",
	"revoked",
]);

// ── Projects ──────────────────────────────────────────
export const projectStatusEnum = pgEnum("project_status", [
	"selling_now",
	"active",
	"pre_launch",
	"draft",
	"sold_out",
]);

export const projectTypeEnum = pgEnum("project_type", [
	"residential",
	"commercial",
	"mixed_use",
	"hospitality",
	"land",
]);

export const unitStatusEnum = pgEnum("unit_status", [
	"active",
	"sold_out",
	"inactive",
]);

// ── Leads ─────────────────────────────────────────────
export const leadStatusEnum = pgEnum("lead_status", [
	"new",
	"contacted",
	"qualified",
	"inspection",
	"negotiation",
	"closed_won",
	"closed_lost",
]);

export const leadSourceEnum = pgEnum("lead_source", [
	"website",
	"landing_page",
	"whatsapp",
	"instagram",
	"google",
	"tiktok",
	"brochure",
	"referral",
	"direct",
]);

export const leadActivityTypeEnum = pgEnum("lead_activity_type", [
	"form_submitted",
	"auto_response_sent",
	"brochure_sent",
	"sales_notified",
	"status_changed",
	"note_added",
	"called",
	"whatsapp_sent",
	"assigned",
	"hubspot_synced",
]);

// ── Landing Pages ─────────────────────────────────────
export const landingPageTypeEnum = pgEnum("landing_page_type", [
	"investment",
	"unit_campaign",
	"realtor",
	"diaspora",
	"general",
]);

export const contentStatusEnum = pgEnum("content_status", [
	"published",
	"draft",
	"archived",
]);

// ── Forms ─────────────────────────────────────────────

// formTypeEnum — add "general_contact" to the existing array:
export const formTypeEnum = pgEnum("form_type", [
  "project_enquiry", "brochure_download", "diaspora", "realtor", "newsletter", "general_contact",
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
	"country",
	"checkbox",
]);

export const formStatusEnum = pgEnum("form_status", [
	"active",
	"review",
	"inactive",
]);

// ── Brochures ─────────────────────────────────────────
export const brochureStatusEnum = pgEnum("brochure_status", [
	"active",
	"draft",
	"archived",
]);

// ── Media ─────────────────────────────────────────────
export const mediaFolderEnum = pgEnum("media_folder", [
	"project_renders",
	"interior_renders",
	"construction_updates",
	"brochures",
	"team_photos",
	"logos_icons",
	"documents",
	"videos",
]);

export const mediaUsageTagEnum = pgEnum("media_usage_tag", [
	"project_render",
	"interior",
	"construction",
	"brochure",
	"logo",
	"team",
	"document",
	"video",
]);

// ── Articles ──────────────────────────────────────────
export const articleCategoryEnum = pgEnum("article_category", [
	"location_analysis",
	"investment_education",
	"project_update",
	"market_insight",
	"construction_update",
]);

// ── Company Pages ─────────────────────────────────────
export const companyPageTypeEnum = pgEnum("company_page_type", [
	"home",
	"about",
	"services",
	"corporate_statement",
	"contact",
	"custom",
]);

// ── Tracking ──────────────────────────────────────────
export const trackingIntegrationEnum = pgEnum("tracking_integration_name", [
	"google_tag_manager",
	"google_analytics_4",
	"meta_pixel",
	"tiktok_pixel",
	"linkedin_insight_tag",
	"x_pixel",
	"snapchat_pixel",
]);

export const trackingIntegrationStatusEnum = pgEnum(
	"tracking_integration_status",
	["connected", "disconnected", "error"],
);

export const trackingEventCategoryEnum = pgEnum("tracking_event_category", [
	"awareness",
	"lead_generation",
	"engagement",
]);

export const trackingEventStatusEnum = pgEnum("tracking_event_status", [
	"active",
	"inactive",
]);


export const listingTypeEnum = pgEnum("listing_type", ["for_sale", "for_rent", "sold"]);
export const constructionStatusEnum = pgEnum("construction_status", ["planning", "under_construction", "completed"]);

