// app/admin/forms/new/page.tsx
import { FormBuilderShell } from "@/components/admin/forms/builder/FormBuilderShell";
import type { FormBuilderState } from "@/lib/types/admin/form-builder";

const BLANK_STATE: FormBuilderState = {
	id: "new",
	title: "",
	formType: "general_enquiry",
	crmTag: "",
	fields: [],
};

export default function NewFormPage() {
	return <FormBuilderShell initialState={BLANK_STATE} mode="new" />;
}
