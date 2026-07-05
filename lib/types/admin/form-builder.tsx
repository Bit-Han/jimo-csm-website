export type FormFieldType =
	| "text"
	| "phone"
	| "email"
	| "dropdown"
	| "radio"
	| "budget_range"
	| "textarea"
	| "hidden"
	| "consent";

export type FormFieldWidth = "full" | "half";

export interface FormFieldOption {
	id: string;
	label: string;
}

export interface FormBuilderField {
	id: string;
	type: FormFieldType;
	label: string;
	placeholder: string;
	required: boolean;
	crmMapping: string;
	options: FormFieldOption[];
	width: FormFieldWidth;
}

export interface FormBuilderState {
	id: string;
	title: string;
	formType: string;
	crmTag: string;
	fields: FormBuilderField[];
}

export interface AvailableFieldType {
	type: FormFieldType;
	label: string;
	shortCode: string;
}

export const AVAILABLE_FIELD_TYPES: AvailableFieldType[] = [
	{ type: "text", label: "Text", shortCode: "T" },
	{ type: "phone", label: "Phone", shortCode: "P" },
	{ type: "email", label: "Email", shortCode: "E" },
	{ type: "dropdown", label: "Dropdown", shortCode: "D" },
	{ type: "radio", label: "Radio Button", shortCode: "R" },
	{ type: "budget_range", label: "Budget Range", shortCode: "B" },
	{ type: "textarea", label: "Textarea", shortCode: "T" },
	{ type: "hidden", label: "Hidden Field", shortCode: "H" },
	{ type: "consent", label: "Consent", shortCode: "C" },
];

export type AdminFormStatus = "active" | "review" | "draft";

export interface AdminFormListRow {
	id: string;
	title: string;
	type: string;
	relatedLabel: string;
	status: AdminFormStatus;
	crmTag: string;
}

export type FormBuilderSaveStatus = "idle" | "saving" | "saved" | "error";
