import type {
	AdminFormListRow,
	FormBuilderState,
} from "@/lib/types/admin/form-builder";

// TODO (integration stage): db.query.forms.findMany({ with: { fields: true } })
export const mockAdminForms: AdminFormListRow[] = [
	{
		id: "project-enquiry-form",
		title: "Project Enquiry Form",
		type: "Project",
		relatedLabel: "6 pages",
		status: "active",
		crmTag: "Project Lead",
	},
	{
		id: "brochure-download-form",
		title: "Brochure Download Form",
		type: "Brochure",
		relatedLabel: "4 pages",
		status: "active",
		crmTag: "Brochure Lead",
	},
	{
		id: "diaspora-buyer-form",
		title: "Diaspora Buyer Form",
		type: "Diaspora",
		relatedLabel: "2 pages",
		status: "review",
		crmTag: "Diaspora",
	},
];

const mockProjectEnquiryFormState: FormBuilderState = {
	id: "project-enquiry-form",
	title: "Project Enquiry Form",
	formType: "Project",
	crmTag: "Project Lead",
	fields: [
		{
			id: "f-name",
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			options: [],
			width: "half",
		},
		{
			id: "f-phone",
			type: "phone",
			label: "Phone Number",
			placeholder: "Your phone number",
			required: true,
			crmMapping: "lead.phone",
			options: [],
			width: "half",
		},
		{
			id: "f-email",
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			options: [],
			width: "full",
		},
		{
			id: "f-unit",
			type: "dropdown",
			label: "Interested Unit",
			placeholder: "Select an option",
			required: true,
			crmMapping: "lead.interested_unit",
			options: [
				{ id: "opt-studio", label: "Studio Apartment" },
				{ id: "opt-1bed", label: "1-Bedroom Apartment" },
				{ id: "opt-penthouse", label: "Penthouse" },
			],
			width: "full",
		},
		{
			id: "f-budget",
			type: "budget_range",
			label: "Budget Range",
			placeholder: "Select budget range",
			required: true,
			crmMapping: "lead.budget",
			options: [],
			width: "full",
		},
		{
			id: "f-purpose",
			type: "dropdown",
			label: "Buying Purpose",
			placeholder: "Select purpose",
			required: true,
			crmMapping: "lead.buying_purpose",
			options: [
				{ id: "opt-invest", label: "Investment" },
				{ id: "opt-own", label: "Owner Occupation" },
			],
			width: "half",
		},
		{
			id: "f-plan",
			type: "dropdown",
			label: "Preferred Payment Plan",
			placeholder: "Select plan",
			required: false,
			crmMapping: "lead.preferred_plan",
			options: [
				{ id: "opt-outright", label: "Outright" },
				{ id: "opt-6m", label: "6 Months" },
				{ id: "opt-12m", label: "12 Months" },
			],
			width: "half",
		},
		{
			id: "f-message",
			type: "textarea",
			label: "Message",
			placeholder: "Tell us what you would like to discuss",
			required: false,
			crmMapping: "lead.message",
			options: [],
			width: "full",
		},
	],
};

const mockBrochureFormState: FormBuilderState = {
	id: "brochure-download-form",
	title: "Brochure Download Form",
	formType: "Brochure",
	crmTag: "Brochure Lead",
	fields: [
		{
			id: "bf-name",
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			options: [],
			width: "full",
		},
		{
			id: "bf-email",
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			options: [],
			width: "full",
		},
		{
			id: "bf-phone",
			type: "phone",
			label: "Phone Number",
			placeholder: "Your phone number",
			required: true,
			crmMapping: "lead.phone",
			options: [],
			width: "full",
		},
	],
};

const mockDiasporaFormState: FormBuilderState = {
	id: "diaspora-buyer-form",
	title: "Diaspora Buyer Form",
	formType: "Diaspora",
	crmTag: "Diaspora",
	fields: [
		{
			id: "df-name",
			type: "text",
			label: "Full Name",
			placeholder: "Your full name",
			required: true,
			crmMapping: "lead.full_name",
			options: [],
			width: "full",
		},
		{
			id: "df-email",
			type: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			crmMapping: "lead.email",
			options: [],
			width: "full",
		},
		{
			id: "df-country",
			type: "dropdown",
			label: "Country of Residence",
			placeholder: "Select country",
			required: true,
			crmMapping: "lead.country",
			options: [
				{ id: "opt-uk", label: "United Kingdom" },
				{ id: "opt-us", label: "United States" },
				{ id: "opt-ca", label: "Canada" },
				{ id: "opt-other", label: "Other" },
			],
			width: "full",
		},
	],
};

const formStates: Record<string, FormBuilderState> = {
	"project-enquiry-form": mockProjectEnquiryFormState,
	"brochure-download-form": mockBrochureFormState,
	"diaspora-buyer-form": mockDiasporaFormState,
};

export function getAdminForms(): AdminFormListRow[] {
	return mockAdminForms;
}

export function getFormBuilderState(id: string): FormBuilderState | undefined {
	return formStates[id];
}

export const DEFAULT_NEW_FORM_STATE: FormBuilderState = {
	id: "new",
	title: "New Form",
	formType: "Project",
	crmTag: "",
	fields: [],
};