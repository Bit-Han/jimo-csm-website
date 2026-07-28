ALTER TABLE "insights" ADD COLUMN "focus_keyword" text;--> statement-breakpoint
ALTER TABLE "seo_global_settings" ADD COLUMN "sitemap_last_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "seo_issues" ADD COLUMN "page_title" text NOT NULL;