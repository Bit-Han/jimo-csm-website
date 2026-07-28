ALTER TYPE "public"."seo_issue_type" ADD VALUE 'seo' BEFORE 'technical';--> statement-breakpoint
CREATE TABLE "tracking_event_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text NOT NULL,
	"page_path" text NOT NULL,
	"landing_page_slug" text,
	"project_slug" text,
	"referrer" text,
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracking_event_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ai_visibility_results" CASCADE;--> statement-breakpoint
CREATE INDEX "tracking_event_logs_event_created_idx" ON "tracking_event_logs" USING btree ("event_name","created_at");--> statement-breakpoint
DROP TYPE "public"."ai_visibility_platform";