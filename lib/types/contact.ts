//@lib/types/contact.ts

export type EnquiryType =
	| "buyer"
	| "investor"
	| "partner"
	| "diaspora-buyer"
	| "realtor"
	| "general";

export interface EnquiryTypeOption {
	value: EnquiryType;
	label: string;
}

export type ContactFormField =
	| "fullName"
	| "phoneNumber"
	| "email"
	| "enquiryType"
	| "projectOfInterest"
	| "message";

export interface ContactFormState {
	status: "idle" | "success" | "error";
	message: string;
	fieldErrors: Partial<Record<ContactFormField, string>>;
}
