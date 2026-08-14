// lib/constants/tracking-events.ts
import type { AdminTrackingEventCategory } from "@/lib/types/admin/tracking-analytics";

export const TRACKING_EVENT_NAMES = [
	"landing_page_view",
	"form_submit",
	"brochure_form_submit",
	"landing_page_form_submit",
	"whatsapp_click",
	"phone_click",
] as const;

export type TrackingEventName = (typeof TRACKING_EVENT_NAMES)[number];

export const TRACKING_EVENT_META: Record<
	TrackingEventName,
	{ trigger: string; category: AdminTrackingEventCategory }
> = {
	landing_page_view: { trigger: "All Page Views", category: "awareness" },
	form_submit: { trigger: "Form Submitted", category: "lead_generation" },
	brochure_form_submit: {
		trigger: "Form Submitted (Brochure)",
		category: "lead_generation",
	},
	landing_page_form_submit: {
		trigger: "Form Submitted (Landing Page)",
		category: "lead_generation",
	},
	whatsapp_click: { trigger: "Click on WhatsApp Link", category: "engagement" },
	phone_click: { trigger: "Click on Phone Link", category: "engagement" },
};