//@/lib/data/admin/forms.ts
export {
	getAdminFormListRows as getAdminForms,
	getFormBuilderStateById as getFormBuilderState,
} from "@/lib/db/queries/forms";

import type { FormBuilderState } from "@/lib/types/admin/form-builder";

export const DEFAULT_NEW_FORM_STATE: FormBuilderState = {
	id: "new",
	title: "New Form",
	formType: "Project",
	crmTag: "",
	fields: [],
};