ALTER TABLE "site_settings" ADD COLUMN "whatsapp_number" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "new_lead_email_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "new_lead_notification_email" text;