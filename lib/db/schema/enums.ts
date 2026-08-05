//@/lib/db/schema/enums.ts

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

export const seoPageTypeEnum = pgEnum("seo_page_type", [
	"home",
	"insight",
	"project",
	"company-page",
	"landing-page",
]);

// Added "seo" — mockSeoIssues already used this value for duplicate-title
// issues, and the audit will need it for anything that's purely an SEO
// ranking concern rather than missing metadata/content/images/technical.
export const seoIssueTypeEnum = pgEnum("seo_issue_type", [
	"meta",
	"content",
	"images",
	"seo",
	"technical",
]);

export const seoIssueSeverityEnum = pgEnum("seo_issue_severity", [
	"error",
	"warning",
	"info",
]);

export const seoIssueStatusEnum = pgEnum("seo_issue_status", [
	"open",
	"resolved",
	"ignored",
]);

export const gscSearchTypeEnum = pgEnum("gsc_search_type", [
	"web",
	"image",
	"news",
	"discover",
	"video",
	"ai_overview",
	"ai_mode",
]);

// aiVisibilityPlatformEnum removed — no unified API exists across AI
// chat providers to automate this, per your call to drop it.