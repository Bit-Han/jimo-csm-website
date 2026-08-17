// lib/constants/form-types.ts
export const FORM_TYPES = [
	{ value: "general_enquiry", label: "General Enquiry" },
	{ value: "brochure_request", label: "Brochure Request" },
	{ value: "newsletter", label: "Newsletter Signup" },
	{ value: "investor_interest", label: "Investor Interest" },
	{ value: "diaspora_buyer", label: "Diaspora Buyer" },
	{ value: "realtor_partner", label: "Realtor Partner" },
] as const;

export type FormTypeValue = (typeof FORM_TYPES)[number]["value"];
