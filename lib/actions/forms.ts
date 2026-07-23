//@lib/actions/forms.ts

"use server";

import type { FormBuilderState } from "@/lib/types/admin/form-builder";

export interface FormActionResult {
	success: boolean;
	message: string;
}

export async function saveForm(
	state: FormBuilderState,
): Promise<FormActionResult> {
	// TODO (integration stage):
	// 1. Validate state with Zod
	// 2. Upsert into forms table
	// 3. Delete existing form_fields rows for this form
	// 4. Insert new form_fields rows in order
	// 5. revalidatePath("/admin/forms")
	console.log("[saveForm]", state.id, "fields:", state.fields.length);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: "Form saved." };
}
