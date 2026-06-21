// lib/validations/forms.ts
import { z } from "zod";

const formFieldSchema = z.object({
	id: z.string(),
	type: z.enum([
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
	]),
	label: z.string().min(1),
	placeholder: z.string().optional(),
	required: z.boolean().default(false),
	crmMapping: z.string().optional(),
	options: z.array(z.string()).optional(),
	orderIndex: z.number().int().min(0),
	defaultValue: z.string().optional(),
	hiddenValue: z.string().optional(),
	validationPattern: z.string().optional(),
});

export const createFormSchema = z.object({
	title: z.string().min(2, "Form title is required"),
	type: z
		.enum([
			"project_enquiry",
			"brochure_download",
			"diaspora",
			"realtor",
			"newsletter",
		])
		.default("project_enquiry"),
	crmMappingLabel: z.string().optional(),
	status: z.enum(["active", "review", "inactive"]).default("active"),
	fields: z.array(formFieldSchema).default([]),
	successMessage: z.string().optional(),
	redirectUrl: z.string().url().optional().or(z.literal("")),
	hubspotFormId: z.string().optional(),
	autoSendBrochure: z.boolean().default(false),
	brochureId: z.string().uuid().optional(),
});

export const updateFormSchema = createFormSchema.partial();

export type CreateFormInput = z.infer<typeof createFormSchema>;
