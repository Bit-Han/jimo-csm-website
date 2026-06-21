// lib/validations/leads.ts
import { z } from "zod";

// ── Public form submission (from anonymous visitors) ──────────────────────────
export const submitLeadSchema = z.object({
	name: z.string().min(2, "Full name is required"),
	email: z.string().email().optional().or(z.literal("")),
	phone: z.string().min(7, "Valid phone number is required"),
	countryOfResidence: z.string().optional(),
	projectId: z.string().uuid().optional(),
	landingPageId: z.string().uuid().optional(),
	formId: z.string().uuid(),
	brochureId: z.string().uuid().optional(),
	unitInterest: z.string().optional(),
	budgetMinKobo: z.number().int().positive().optional(),
	budgetMaxKobo: z.number().int().positive().optional(),
	buyingPurpose: z.string().optional(),
	preferredPlan: z.string().optional(),
	message: z.string().optional(),
	source: z
		.enum([
			"website",
			"landing_page",
			"whatsapp",
			"instagram",
			"google",
			"tiktok",
			"brochure",
			"referral",
			"direct",
		])
		.default("website"),
	sourcePage: z.string().optional(),
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
	utmContent: z.string().optional(),
	device: z.string().optional(),
	referrer: z.string().optional(),
	extraData: z.record(z.string()).optional(),
});

// ── CMS: update lead status / assignment ─────────────────────────────────────
export const updateLeadSchema = z.object({
	status: z
		.enum([
			"new",
			"contacted",
			"qualified",
			"inspection",
			"negotiation",
			"closed_won",
			"closed_lost",
		])
		.optional(),
	assignedTo: z.string().uuid().nullable().optional(),
	notes: z.string().optional(),
});

export const createLeadNoteSchema = z.object({
	content: z.string().min(1, "Note cannot be empty"),
	mentionedUsers: z.array(z.string().uuid()).default([]),
});

export const assignLeadSchema = z.object({
	assignedTo: z.string().uuid().nullable(),
});

export type SubmitLeadInput = z.infer<typeof submitLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
