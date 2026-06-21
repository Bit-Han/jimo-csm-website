// // lib/types/index.ts
// // ─────────────────────────────────────────────────────────────────────────────
// // Shared TypeScript types consumed by services, API routes, and hooks.
// // All entity types are inferred from Drizzle schema ($inferSelect).
// // ─────────────────────────────────────────────────────────────────────────────

// export type {
// 	Profile,
// 	NewProfile,
// 	Invitation,
// 	NewInvitation,
// } from "@/lib/db/schema/users";

// export type {
// 	Project,
// 	NewProject,
// 	ProjectUnit,
// 	NewProjectUnit,
// 	ProjectGalleryItem,
// } from "@/lib/db/schema/projects";

// export type { Media, NewMedia } from "@/lib/db/schema/media";
// export type { Form, NewForm, FormField } from "@/lib/db/schema/forms";
// export type {
// 	Lead,
// 	NewLead,
// 	LeadActivity,
// 	LeadNote,
// } from "@/lib/db/schema/leads";
// export type {
// 	LandingPage,
// 	NewLandingPage,
// 	PageSection,
// } from "@/lib/db/schema/landing-pages";
// export type { Brochure, NewBrochure } from "@/lib/db/schema/brochures";
// export type { Article, NewArticle } from "@/lib/db/schema/articles";
// export type {
// 	CompanyPage,
// 	NewCompanyPage,
// 	CompanyPageSection,
// } from "@/lib/db/schema/company-pages";
// export type { SeoSettings } from "@/lib/db/schema/seo";
// export type {
// 	TrackingIntegration,
// 	TrackingEvent,
// } from "@/lib/db/schema/tracking";
// export type { AppSettings } from "@/lib/db/schema/settings";

// // ─────────────────────────────────────────────────────────────────────────────
// // API Response wrapper — every API route returns this shape
// // ─────────────────────────────────────────────────────────────────────────────
// export type ApiResponse<T = unknown> =
// 	| { success: true; data: T; meta?: PaginationMeta }
// 	| { success: false; error: string; code?: string };

// export type PaginationMeta = {
// 	total: number;
// 	page: number;
// 	pageSize: number;
// 	totalPages: number;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Pagination query params (used by GET list endpoints)
// // ─────────────────────────────────────────────────────────────────────────────
// export type PaginationParams = {
// 	page?: number;
// 	pageSize?: number;
// 	sortBy?: string;
// 	sortOrder?: "asc" | "desc";
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Dashboard summary types (used by /api/dashboard)
// // ─────────────────────────────────────────────────────────────────────────────
// export type DashboardStats = {
// 	totalLeads: number;
// 	totalLeadsChange: number; // % change vs previous period
// 	brochureDownloads: number;
// 	brochureDownloadsChange: number;
// 	whatsappClicks: number;
// 	whatsappClicksChange: number;
// 	phoneClicks: number;
// 	phoneClicksChange: number;
// 	activeProjects: number;
// 	preLaunchProjects: number;
// 	activeCampaigns: number;
// 	campaignsNeedReview: number;
// };

// export type RecentEnquiry = {
// 	id: string;
// 	name: string;
// 	projectName: string;
// 	budgetRange: string;
// 	status: string;
// 	createdAt: string;
// };

// export type OperationalAlert = {
// 	id: string;
// 	message: string;
// 	detail: string;
// 	severity: "needs_attention" | "review" | "connected" | "info";
// 	actionLabel?: string;
// 	actionHref?: string;
// };

// export type ProjectPerformanceRow = {
// 	id: string;
// 	name: string;
// 	leads: number;
// 	brochureDownloads: number;
// 	whatsappClicks: number;
// 	status: string;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Permission check type (used by lib/utils/permissions.ts)
// // ─────────────────────────────────────────────────────────────────────────────
// export type Permission =
// 	| "view_dashboard"
// 	| "view_projects"
// 	| "edit_projects"
// 	| "edit_pricing"
// 	| "view_leads"
// 	| "edit_leads"
// 	| "assign_leads"
// 	| "export_leads"
// 	| "view_forms"
// 	| "edit_forms"
// 	| "view_brochures"
// 	| "publish_brochure"
// 	| "view_media"
// 	| "upload_media"
// 	| "view_articles"
// 	| "edit_articles"
// 	| "view_company_pages"
// 	| "edit_company_pages"
// 	| "view_landing_pages"
// 	| "edit_landing_pages"
// 	| "view_seo"
// 	| "edit_seo"
// 	| "view_tracking"
// 	| "edit_tracking"
// 	| "view_users"
// 	| "manage_users"
// 	| "view_settings"
// 	| "edit_settings";

// export type UserRole =
// 	| "super_admin"
// 	| "website_manager"
// 	| "content_seo"
// 	| "sales_crm"
// 	| "marketing_admin";




// lib/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// CONVENTION (so this never drifts again):
//   • Entity types (DB row shapes)        → declared here, inferred from schema
//   • Composed types (entity + relations) → declared here, built with Pick/&
//   • Input/payload types (create/update) → live in lib/validations/*, NEVER
//     re-exported here. Services and hooks import those directly from
//     "@/lib/validations/[module]" — not from this file.
// ─────────────────────────────────────────────────────────────────────────────

export type { Profile, NewProfile, Invitation, NewInvitation } from "@/lib/db/schema/users";
export type { Project, NewProject, ProjectUnit, NewProjectUnit, ProjectGalleryItem } from "@/lib/db/schema/projects";
export type { Media, NewMedia } from "@/lib/db/schema/media";
export type { Form, NewForm, FormField } from "@/lib/db/schema/forms";
export type { Lead, NewLead, LeadActivity, LeadNote } from "@/lib/db/schema/leads";
export type { LandingPage, NewLandingPage, PageSection } from "@/lib/db/schema/landing-pages";
export type { Brochure, NewBrochure } from "@/lib/db/schema/brochures";
export type { Article, NewArticle } from "@/lib/db/schema/articles";
export type { CompanyPage, NewCompanyPage, CompanyPageSection } from "@/lib/db/schema/company-pages";
export type { SeoSettings } from "@/lib/db/schema/seo";
export type { TrackingIntegration, TrackingEvent } from "@/lib/db/schema/tracking";
export type { AppSettings } from "@/lib/db/schema/settings";

import type { Project, ProjectUnit, ProjectGalleryItem } from "@/lib/db/schema/projects";
import type { Lead, LeadActivity, LeadNote } from "@/lib/db/schema/leads";
import type { Profile } from "@/lib/db/schema/users";
import type { Form } from "@/lib/db/schema/forms";
import type { LandingPage } from "@/lib/db/schema/landing-pages";

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSED TYPES — these match exactly what the service layer returns.
// Declaring them here means no component should ever need `as Record<string, unknown>`.
// ─────────────────────────────────────────────────────────────────────────────

/** Shape returned by projects.service.getProjects() — one row per table listing */
export type ProjectListItem = Project & { leadsCount: number };

/** Shape returned by projects.service.getProjectById() — full editor detail */
export type ProjectDetail = Project & {
  units: ProjectUnit[];
  gallery: ProjectGalleryItem[];
};

/** Shape returned by leads.service.getLeads() — table row with joined names */
export type LeadListItem = Lead & {
  project: Pick<Project, "name" | "slug"> | null;
  assignedTo: Pick<Profile, "name"> | null;
};

/** Shape returned by leads.service.getLeadById() — full lead profile */
export type LeadDetail = Lead & {
  project: Pick<Project, "id" | "name" | "slug"> | null;
  assignedTo: Pick<Profile, "id" | "name" | "email"> | null;
  form: Pick<Form, "id" | "title"> | null;
  landingPage: Pick<LandingPage, "id" | "title" | "slug"> | null;
  activities: Array<LeadActivity & { actor: Pick<Profile, "name"> | null }>;
  notes: Array<LeadNote & { author: Pick<Profile, "id" | "name"> }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// API envelope + pagination (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
export type ApiResponse<T = unknown> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: string; code?: string };

export type PaginationMeta = { total: number; page: number; pageSize: number; totalPages: number };
export type PaginationParams = { page?: number; pageSize?: number; sortBy?: string; sortOrder?: "asc" | "desc" };

export type DashboardStats = {
  totalLeads: number; totalLeadsChange: number;
  brochureDownloads: number; brochureDownloadsChange: number;
  whatsappClicks: number; whatsappClicksChange: number;
  phoneClicks: number; phoneClicksChange: number;
  activeProjects: number; preLaunchProjects: number;
  activeCampaigns: number; campaignsNeedReview: number;
};

export type RecentEnquiry = { id: string; name: string; projectName: string; budgetRange: string; status: string; createdAt: string };
export type OperationalAlert = { id: string; message: string; detail: string; severity: "needs_attention" | "review" | "connected" | "info"; actionLabel?: string; actionHref?: string };
export type ProjectPerformanceRow = { id: string; name: string; leadsCount: number; brochureDownloads: number; whatsappClicks: number; status: string };

export type Permission =
  | "view_dashboard" | "view_projects" | "edit_projects" | "edit_pricing"
  | "view_leads" | "edit_leads" | "assign_leads" | "export_leads"
  | "view_forms" | "edit_forms" | "view_brochures" | "publish_brochure"
  | "view_media" | "upload_media" | "view_articles" | "edit_articles"
  | "view_company_pages" | "edit_company_pages" | "view_landing_pages" | "edit_landing_pages"
  | "view_seo" | "edit_seo" | "view_tracking" | "edit_tracking"
  | "view_users" | "manage_users" | "view_settings" | "edit_settings";

export type UserRole = "super_admin" | "website_manager" | "content_seo" | "sales_crm" | "marketing_admin";