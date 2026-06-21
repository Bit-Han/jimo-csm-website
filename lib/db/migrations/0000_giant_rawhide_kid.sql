CREATE TYPE "public"."article_category" AS ENUM('location_analysis', 'investment_education', 'project_update', 'market_insight', 'construction_update');--> statement-breakpoint
CREATE TYPE "public"."brochure_status" AS ENUM('active', 'draft', 'archived');--> statement-breakpoint
CREATE TYPE "public"."company_page_type" AS ENUM('home', 'about', 'services', 'corporate_statement', 'contact', 'custom');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('published', 'draft', 'archived');--> statement-breakpoint
CREATE TYPE "public"."form_field_type" AS ENUM('text', 'phone', 'email', 'dropdown', 'radio', 'budget_range', 'textarea', 'hidden', 'consent', 'country', 'checkbox');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('active', 'review', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."form_type" AS ENUM('project_enquiry', 'brochure_download', 'diaspora', 'realtor', 'newsletter');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."landing_page_type" AS ENUM('investment', 'unit_campaign', 'realtor', 'diaspora', 'general');--> statement-breakpoint
CREATE TYPE "public"."lead_activity_type" AS ENUM('form_submitted', 'auto_response_sent', 'brochure_sent', 'sales_notified', 'status_changed', 'note_added', 'called', 'whatsapp_sent', 'assigned', 'hubspot_synced');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('website', 'landing_page', 'whatsapp', 'instagram', 'google', 'tiktok', 'brochure', 'referral', 'direct');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'inspection', 'negotiation', 'closed_won', 'closed_lost');--> statement-breakpoint
CREATE TYPE "public"."media_folder" AS ENUM('project_renders', 'interior_renders', 'construction_updates', 'brochures', 'team_photos', 'logos_icons', 'documents', 'videos');--> statement-breakpoint
CREATE TYPE "public"."media_usage_tag" AS ENUM('project_render', 'interior', 'construction', 'brochure', 'logo', 'team', 'document', 'video');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('selling_now', 'active', 'pre_launch', 'draft', 'sold_out');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('residential', 'commercial', 'mixed_use', 'hospitality', 'land');--> statement-breakpoint
CREATE TYPE "public"."tracking_event_category" AS ENUM('awareness', 'lead_generation', 'engagement');--> statement-breakpoint
CREATE TYPE "public"."tracking_event_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."tracking_integration_name" AS ENUM('google_tag_manager', 'google_analytics_4', 'meta_pixel', 'tiktok_pixel', 'linkedin_insight_tag', 'x_pixel', 'snapchat_pixel');--> statement-breakpoint
CREATE TYPE "public"."tracking_integration_status" AS ENUM('connected', 'disconnected', 'error');--> statement-breakpoint
CREATE TYPE "public"."unit_status" AS ENUM('active', 'sold_out', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'website_manager', 'content_seo', 'sales_crm', 'marketing_admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" NOT NULL,
	"invited_by" uuid NOT NULL,
	"supabase_user_id" uuid,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'sales_crm' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"invited_by" uuid,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "project_gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"status" "unit_status" DEFAULT 'active' NOT NULL,
	"total_units" integer DEFAULT 0 NOT NULL,
	"available_units" integer DEFAULT 0 NOT NULL,
	"launch_price_kobo" bigint,
	"current_price_kobo" bigint,
	"cta_label" text,
	"cta_link" text,
	"image_url" text,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"location" text NOT NULL,
	"location_area" text NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"type" "project_type" DEFAULT 'residential' NOT NULL,
	"description" text,
	"hero_headline" text,
	"hero_subtext" text,
	"hero_image_url" text,
	"video_url" text,
	"starting_price_kobo" bigint,
	"delivery_timeline" text,
	"construction_status" text,
	"total_units" integer DEFAULT 0,
	"available_units" integer DEFAULT 0,
	"investment_highlights" jsonb DEFAULT '[]'::jsonb,
	"location_advantages" jsonb DEFAULT '[]'::jsonb,
	"features_amenities" jsonb DEFAULT '[]'::jsonb,
	"payment_plan_details" jsonb,
	"whatsapp_number" text,
	"call_number" text,
	"meta_title" text,
	"meta_description" text,
	"focus_keyword" text,
	"schema_markup" jsonb,
	"hubspot_deal_id" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"last_edited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"project_id" uuid,
	"folder" "media_folder" DEFAULT 'project_renders' NOT NULL,
	"usage_tag" "media_usage_tag" DEFAULT 'project_render' NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"cloudinary_url" text NOT NULL,
	"resource_type" text DEFAULT 'image' NOT NULL,
	"format" text,
	"alt_text" text,
	"file_size_mb" real,
	"width" integer,
	"height" integer,
	"duration_seconds" real,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"type" "form_type" DEFAULT 'project_enquiry' NOT NULL,
	"crm_mapping_label" text,
	"status" "form_status" DEFAULT 'active' NOT NULL,
	"fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"success_message" text DEFAULT 'Thank you! We will be in touch shortly.',
	"redirect_url" text,
	"hubspot_form_id" text,
	"auto_send_brochure" boolean DEFAULT false NOT NULL,
	"brochure_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"type" "lead_activity_type" NOT NULL,
	"description" text NOT NULL,
	"created_by" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_by" uuid NOT NULL,
	"mentioned_users" uuid[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"country_of_residence" text,
	"project_id" uuid,
	"landing_page_id" uuid,
	"form_id" uuid NOT NULL,
	"unit_interest" text,
	"budget_min_kobo" bigint,
	"budget_max_kobo" bigint,
	"buying_purpose" text,
	"preferred_plan" text,
	"message" text,
	"source" "lead_source" DEFAULT 'website' NOT NULL,
	"source_page" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"device" text,
	"referrer" text,
	"ip_address" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"assigned_to" uuid,
	"hubspot_contact_id" text,
	"hubspot_deal_id" text,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" "landing_page_type" DEFAULT 'general' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"project_id" uuid,
	"campaign_type" text,
	"audience" text,
	"crm_tag" text,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"form_id" uuid,
	"conversion_rate" real,
	"meta_title" text,
	"meta_description" text,
	"focus_keyword" text,
	"hubspot_list_id" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "landing_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "brochures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"file_type" text DEFAULT 'PDF' NOT NULL,
	"project_id" uuid,
	"status" "brochure_status" DEFAULT 'draft' NOT NULL,
	"file_url" text NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"file_size_mb" integer,
	"version" integer DEFAULT 1 NOT NULL,
	"is_gated" boolean DEFAULT true NOT NULL,
	"gate_form_id" uuid,
	"leads_captured_count" integer DEFAULT 0 NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" "article_category" NOT NULL,
	"project_id" uuid,
	"content" jsonb,
	"excerpt" text,
	"featured_image_id" uuid,
	"featured_image_url" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"focus_keyword" text,
	"internal_links_count" integer DEFAULT 0,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" "company_page_type" NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"focus_keyword" text,
	"last_edited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seo_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_title" text DEFAULT 'Jimo Property Development' NOT NULL,
	"meta_description" text,
	"robots_txt" text DEFAULT 'User-agent: *
Allow: /' NOT NULL,
	"canonical_domain" text,
	"google_search_console_verified" boolean DEFAULT false,
	"sitemap_last_generated_at" timestamp with time zone,
	"missing_meta_titles_count" integer DEFAULT 0,
	"missing_alt_text_count" integer DEFAULT 0,
	"indexed_pages_count" integer DEFAULT 0,
	"duplicate_titles_count" integer DEFAULT 0,
	"no_index_pages_count" integer DEFAULT 0,
	"schema_blocks_count" integer DEFAULT 0,
	"health_score" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_view_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_path" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"form_submits" integer DEFAULT 0,
	"brochure_leads" integer DEFAULT 0,
	"whatsapp_clicks" integer DEFAULT 0,
	"phone_clicks" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"destinations" text[] DEFAULT '{}' NOT NULL,
	"status" "tracking_event_status" DEFAULT 'active' NOT NULL,
	"category" "tracking_event_category" DEFAULT 'lead_generation' NOT NULL,
	"count_30d" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_events_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tracking_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "tracking_integration_name" NOT NULL,
	"status" "tracking_integration_status" DEFAULT 'disconnected' NOT NULL,
	"tracking_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_integrations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text DEFAULT 'Jimo Property Development Limited' NOT NULL,
	"company_email" text,
	"sales_email" text,
	"phone_number" text,
	"whatsapp_number" text,
	"office_address" text,
	"instagram_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"youtube_url" text,
	"resend_api_key_encrypted" text,
	"hubspot_access_token_encrypted" text,
	"cloudinary_cloud_name" text,
	"cloudinary_api_key_encrypted" text,
	"cloudinary_api_secret_encrypted" text,
	"crm_connected" boolean DEFAULT false,
	"email_connected" boolean DEFAULT false,
	"backup_schedule" text DEFAULT 'daily_02_00_WAT',
	"last_backup_at" timestamp with time zone,
	"default_currency" text DEFAULT 'NGN' NOT NULL,
	"timezone" text DEFAULT 'Africa/Lagos' NOT NULL,
	"google_analytics_id" text,
	"google_tag_manager_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_profiles_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_gallery" ADD CONSTRAINT "project_gallery_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_last_edited_by_profiles_id_fk" FOREIGN KEY ("last_edited_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_profiles_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_profiles_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brochures" ADD CONSTRAINT "brochures_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_pages" ADD CONSTRAINT "company_pages_last_edited_by_profiles_id_fk" FOREIGN KEY ("last_edited_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_gallery_project_id_idx" ON "project_gallery" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_units_project_id_idx" ON "project_units" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_location_area_idx" ON "projects" USING btree ("location_area");--> statement-breakpoint
CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "media_project_id_idx" ON "media" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "media_cloudinary_pub_idx" ON "media" USING btree ("cloudinary_public_id");--> statement-breakpoint
CREATE INDEX "forms_type_idx" ON "forms" USING btree ("type");--> statement-breakpoint
CREATE INDEX "forms_status_idx" ON "forms" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lead_activities_lead_id_idx" ON "lead_activities" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_notes_lead_id_idx" ON "lead_notes" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_project_id_idx" ON "leads" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "leads_hubspot_contact_idx" ON "leads" USING btree ("hubspot_contact_id");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "landing_pages_slug_idx" ON "landing_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "landing_pages_status_idx" ON "landing_pages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "brochures_project_id_idx" ON "brochures" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "brochures_status_idx" ON "brochures" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "company_pages_slug_idx" ON "company_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "company_pages_type_idx" ON "company_pages" USING btree ("type");