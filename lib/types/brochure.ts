export type BrochureFormField = "fullName" | "email" | "phoneNumber";

export interface BrochureLeadFormState {
	status: "idle" | "success" | "error";
	message: string;
	fieldErrors: Partial<Record<BrochureFormField, string>>;
}
