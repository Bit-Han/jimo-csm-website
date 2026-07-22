CREATE TYPE "public"."admin_role" AS ENUM('super-admin', 'website-manager', 'content-seo', 'sales-crm', 'marketing-admin');--> statement-breakpoint
CREATE TYPE "public"."admin_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."ai_visibility_platform" AS ENUM('chatgpt', 'perplexity', 'claude', 'gemini', 'grok', 'copilot');--> statement-breakpoint
CREATE TYPE "public"."brochure_status" AS ENUM('draft', 'active');--> statement-breakpoint
CREATE TYPE "public"."form_field_type" AS ENUM('text', 'phone', 'email', 'dropdown', 'radio', 'budget_range', 'textarea', 'hidden', 'consent');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('active', 'review', 'draft');--> statement-breakpoint
CREATE TYPE "public"."gsc_search_type" AS ENUM('web', 'image', 'news', 'discover', 'video', 'ai_overview', 'ai_mode');--> statement-breakpoint
CREATE TYPE "public"."insight_category" AS ENUM('location-analysis', 'investment-education', 'project-update');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('website', 'landing_page', 'whatsapp', 'instagram', 'google', 'referral', 'brochure');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'inspection', 'negotiation', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."media_resource_type" AS ENUM('image', 'video', 'raw');--> statement-breakpoint
CREATE TYPE "public"."project_category" AS ENUM('residential', 'hospitality');--> statement-breakpoint
CREATE TYPE "public"."project_checklist_kind" AS ENUM('investment_highlight', 'payment_plan');--> statement-breakpoint
CREATE TYPE "public"."project_media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('completed', 'under-development');--> statement-breakpoint
CREATE TYPE "public"."project_unit_icon" AS ENUM('home', 'building');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."seo_issue_severity" AS ENUM('error', 'warning', 'info');--> statement-breakpoint
CREATE TYPE "public"."seo_issue_status" AS ENUM('open', 'resolved', 'ignored');--> statement-breakpoint
CREATE TYPE "public"."seo_issue_type" AS ENUM('meta', 'content', 'images', 'technical');--> statement-breakpoint
CREATE TYPE "public"."seo_page_type" AS ENUM('home', 'insight', 'project', 'company-page', 'landing-page');--> statement-breakpoint
CREATE TYPE "public"."tracking_event_category" AS ENUM('awareness', 'lead_generation', 'engagement', 'conversion');--> statement-breakpoint
CREATE TYPE "public"."tracking_event_status" AS ENUM('active', 'inactive', 'testing');--> statement-breakpoint
CREATE TYPE "public"."tracking_platform" AS ENUM('google_tag_manager', 'google_analytics_4', 'meta_pixel', 'tiktok_pixel', 'linkedin_insight_tag', 'x_pixel', 'snapchat_pixel');--> statement-breakpoint
CREATE TABLE "admin_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" NOT NULL,
	"token" text,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"accepted_by_user_id" uuid,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"role" "admin_role" DEFAULT 'sales-crm' NOT NULL,
	"status" "admin_status" DEFAULT 'active' NOT NULL,
	"invited_by_user_id" uuid,
	"last_active_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "project_amenities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"category" "project_category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_checklist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" "project_checklist_kind" NOT NULL,
	"label" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" "project_media_type" DEFAULT 'image' NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"src" text NOT NULL,
	"poster" text,
	"alt" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"label" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"icon" "project_unit_icon" DEFAULT 'home' NOT NULL,
	"price_label" text NOT NULL,
	"availability_label" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"status" "project_status" NOT NULL,
	"status_label" text NOT NULL,
	"category_label" text NOT NULL,
	"developer_label" text NOT NULL,
	"type_label" text NOT NULL,
	"description" text NOT NULL,
	"overview" text[] DEFAULT '{}' NOT NULL,
	"contact_cta_title" text NOT NULL,
	"contact_cta_description" text NOT NULL,
	"cover_image_src" text NOT NULL,
	"cover_image_alt" text NOT NULL,
	"publish_status" "publish_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"last_updated_by_user_id" uuid,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"url" text NOT NULL,
	"secure_url" text NOT NULL,
	"resource_type" "media_resource_type" NOT NULL,
	"format" text NOT NULL,
	"width" integer,
	"height" integer,
	"size_bytes" integer NOT NULL,
	"folder" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"linked_project_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"type" "form_field_type" NOT NULL,
	"label" text NOT NULL,
	"placeholder" text,
	"required" boolean DEFAULT true NOT NULL,
	"crm_mapping" text,
	"position" integer DEFAULT 0 NOT NULL,
	"options" jsonb
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"status" "form_status" DEFAULT 'draft' NOT NULL,
	"crm_tag" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"phone_number" text,
	"project_id" uuid,
	"project_slug" text,
	"source" "lead_source" DEFAULT 'website' NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"budget_range" text,
	"enquiry_type" text,
	"message" text,
	"notes" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"assigned_to_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brochures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"file_url" text NOT NULL,
	"status" "brochure_status" DEFAULT 'draft' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"category_label" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" jsonb DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb NOT NULL,
	"published_at" timestamp,
	"read_time_minutes" integer DEFAULT 3 NOT NULL,
	"related_project_slug" text,
	"related_project_name" text,
	"cover_image_src" text,
	"cover_image_alt" text DEFAULT '' NOT NULL,
	"author_id" uuid,
	"author_name" text DEFAULT '' NOT NULL,
	"author_avatar_url" text,
	"seo_title" text,
	"seo_description" text,
	"publish_status" "publish_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insights_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_visibility_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt" text NOT NULL,
	"category" text DEFAULT 'category' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_visibility_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_id" uuid NOT NULL,
	"platform" "ai_visibility_platform" NOT NULL,
	"was_mentioned" boolean DEFAULT false NOT NULL,
	"was_cited" boolean DEFAULT false NOT NULL,
	"cited_url" text,
	"sentiment" text DEFAULT 'not_mentioned' NOT NULL,
	"response_snippet" text,
	"tested_at" timestamp DEFAULT now() NOT NULL,
	"tested_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "gsc_performance_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_url" text NOT NULL,
	"query" text NOT NULL,
	"search_type" "gsc_search_type" DEFAULT 'web' NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"ctr" numeric,
	"avg_position" numeric,
	"date" text NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_type" "seo_page_type" NOT NULL,
	"page_slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"focus_keyword" text,
	"canonical_url" text,
	"no_index" boolean DEFAULT false NOT NULL,
	"schema_markup" jsonb,
	"og_title" text,
	"og_description" text,
	"og_image_url" text,
	"seo_score" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_configs_page_type_page_slug_unique" UNIQUE("page_type","page_slug")
);
--> statement-breakpoint
CREATE TABLE "seo_global_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_title" text DEFAULT 'Jimo Property Development' NOT NULL,
	"meta_description" text DEFAULT '' NOT NULL,
	"robots_txt" text DEFAULT 'User-agent: *
Allow: /' NOT NULL,
	"canonical_domain" text DEFAULT '' NOT NULL,
	"gsc_service_account_json" text,
	"gsc_site_url" text,
	"llms_txt_enabled" boolean DEFAULT false NOT NULL,
	"llms_txt_content" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_url" text NOT NULL,
	"page_type" "seo_page_type",
	"issue_type" "seo_issue_type" NOT NULL,
	"severity" "seo_issue_severity" NOT NULL,
	"description" text NOT NULL,
	"focus_keyword" text,
	"status" "seo_issue_status" DEFAULT 'open' NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tracking_event_destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"platform" "tracking_platform" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text NOT NULL,
	"trigger" text NOT NULL,
	"category" "tracking_event_category" NOT NULL,
	"status" "tracking_event_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_events_event_name_unique" UNIQUE("event_name")
);
--> statement-breakpoint
CREATE TABLE "tracking_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "tracking_platform" NOT NULL,
	"label" text NOT NULL,
	"is_connected" boolean DEFAULT false NOT NULL,
	"config" jsonb,
	"last_verified_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_integrations_platform_unique" UNIQUE("platform")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"company_name" text NOT NULL,
	"legal_name" text NOT NULL,
	"company_email" text NOT NULL,
	"sales_email" text,
	"phone" text NOT NULL,
	"whatsapp_href" text NOT NULL,
	"instagram_handle" text,
	"address" text NOT NULL,
	"response_time_note" text NOT NULL,
	"instagram_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"youtube_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insight_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insight_categories_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "company_content" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"who_we_are" jsonb NOT NULL,
	"core_values" jsonb NOT NULL,
	"services" jsonb NOT NULL,
	"property_types" jsonb NOT NULL,
	"company_promise" jsonb NOT NULL,
	"team_members" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_content" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_invited_by_user_id_admin_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_accepted_by_user_id_admin_users_id_fk" FOREIGN KEY ("accepted_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_invited_by_user_id_admin_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_amenities" ADD CONSTRAINT "project_amenities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_checklist_items" ADD CONSTRAINT "project_checklist_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_facts" ADD CONSTRAINT "project_facts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_last_updated_by_user_id_admin_users_id_fk" FOREIGN KEY ("last_updated_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_linked_project_id_projects_id_fk" FOREIGN KEY ("linked_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_user_id_admin_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brochures" ADD CONSTRAINT "brochures_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insights" ADD CONSTRAINT "insights_author_id_admin_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_visibility_results" ADD CONSTRAINT "ai_visibility_results_prompt_id_ai_visibility_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."ai_visibility_prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_visibility_results" ADD CONSTRAINT "ai_visibility_results_tested_by_user_id_admin_users_id_fk" FOREIGN KEY ("tested_by_user_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_event_destinations" ADD CONSTRAINT "tracking_event_destinations_event_id_tracking_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."tracking_events"("id") ON DELETE cascade ON UPDATE no action;