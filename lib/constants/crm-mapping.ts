// lib/constants/crm-mapping.ts

export const CRM_MAPPING_OPTIONS = [
	{ value: "fullName", label: "Full Name" },
	{ value: "email", label: "Email Address" },
	{ value: "phoneNumber", label: "Phone Number" },
	{ value: "budgetRange", label: "Budget Range" },
	{ value: "enquiryType", label: "Enquiry Type" },
	{ value: "message", label: "Message / Notes" },
] as const;

export type CrmMappingValue = (typeof CRM_MAPPING_OPTIONS)[number]["value"];

export const CRM_MAPPING_VALUES: ReadonlySet<string> = new Set(
	CRM_MAPPING_OPTIONS.map((o) => o.value),
);

// Which mappings make sense per field type. Where there's exactly one
// valid option, the UI shows it as a locked, read-only badge instead of
// a dropdown — for those types there's nothing to mis-set.
export const ALLOWED_MAPPINGS_BY_FIELD_TYPE: Record<string, CrmMappingValue[]> =
	{
		text: ["fullName", "enquiryType", "message"],
		email: ["email"],
		phone: ["phoneNumber"],
		budget_range: ["budgetRange"],
		dropdown: ["enquiryType", "budgetRange"],
		radio: ["enquiryType", "budgetRange"],
		textarea: ["message"],
		hidden: ["enquiryType", "budgetRange", "message"],
		consent: [],
	};

export const DEFAULT_CRM_MAPPING_BY_TYPE: Partial<
	Record<string, CrmMappingValue>
> = {
	email: "email",
	phone: "phoneNumber",
	budget_range: "budgetRange",
	textarea: "message",
};
