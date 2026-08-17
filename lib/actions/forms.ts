// //@lib/actions/forms.ts

// "use server";

// import type { FormBuilderState } from "@/lib/types/admin/form-builder";

// export interface FormActionResult {
// 	success: boolean;
// 	message: string;
// }

// export async function saveForm(
// 	state: FormBuilderState,
// ): Promise<FormActionResult> {
// 	// TODO (integration stage):
// 	// 1. Validate state with Zod
// 	// 2. Upsert into forms table
// 	// 3. Delete existing form_fields rows for this form
// 	// 4. Insert new form_fields rows in order
// 	// 5. revalidatePath("/admin/forms")
// 	console.log("[saveForm]", state.id, "fields:", state.fields.length);
// 	await new Promise((res) => setTimeout(res, 400));
// 	return { success: true, message: "Form saved." };
// }

// lib/actions/forms.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { formFields, forms } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { getFormUsage } from "@/lib/db/queries/forms";
import { ALLOWED_MAPPINGS_BY_FIELD_TYPE, type CrmMappingValue } from "@/lib/constants/crm-mapping";
import { FORM_TYPES } from "@/lib/types/forms";
import type { FormBuilderState } from "@/lib/types/admin/form-builder";
import type { FormUsageRow } from "@/lib/db/queries/forms";

export interface FormActionResult {
	success: boolean;
	message: string;
	id?: string;
	usage?: FormUsageRow[];
}

const VALID_FORM_TYPES = new Set<string>(FORM_TYPES.map((t) => t.value));

export async function saveForm(state: FormBuilderState): Promise<FormActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (!state.title.trim()) {
			return { success: false, message: "Form title is required." };
		}

		if (!VALID_FORM_TYPES.has(state.formType)) {
			return { success: false, message: "Select a valid form type." };
		}

		// Mirrors the locked UI — rejects anything that could only have
		// gotten here by bypassing the builder (bad import, stale client, etc).
		const badField = state.fields.find((f) => {
			if (!f.crmMapping) return false;
			const allowed = ALLOWED_MAPPINGS_BY_FIELD_TYPE[f.type] ?? [];
			return !allowed.includes(f.crmMapping as CrmMappingValue);
		});
		if (badField) {
			return { success: false, message: `"${badField.label}" has an invalid CRM mapping for its field type.` };
		}

		if (!state.fields.some((f) => f.crmMapping === "fullName")) {
			return {
				success: false,
				message: 'Add a field mapped to "Full Name" before saving — leads need a name to be usable.',
			};
		}

		const formValues = {
			title: state.title,
			type: state.formType,
			status: "active" as const,
			crmTag: state.crmTag || null,
			updatedAt: new Date(),
		};

		let formId: string;

		if (state.id === "new") {
			const [inserted] = await db.insert(forms).values(formValues).returning({ id: forms.id });
			formId = inserted!.id;
		} else {
			const existing = await db.query.forms.findFirst({ where: eq(forms.id, state.id) });
			if (!existing) return { success: false, message: "Form not found." };
			await db.update(forms).set(formValues).where(eq(forms.id, state.id));
			formId = state.id;
		}

		await db.delete(formFields).where(eq(formFields.formId, formId));

		if (state.fields.length > 0) {
			await db.insert(formFields).values(
				state.fields.map((f, i) => ({
					formId,
					type: f.type,
					label: f.label,
					placeholder: f.placeholder || null,
					required: f.required,
					crmMapping: f.crmMapping || null,
					position: i,
					options:
						f.options.length > 0
							? f.options.map((opt) => ({
									label: opt.label,
									value: opt.label.toLowerCase().replace(/\s+/g, "_"),
								}))
							: null,
				})),
			);
		}

		revalidatePath("/admin/forms", "layout");
		return { success: true, message: "Form saved.", id: formId };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveForm]", message);
		return { success: false, message };
	}
}

export async function deleteForm(id: string): Promise<FormActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const usage = await getFormUsage(id);
		if (usage.length > 0) {
			return {
				success: false,
				message: `In use by ${usage.length} landing page${usage.length !== 1 ? "s" : ""} — unlink it there first.`,
				usage,
			};
		}

		await db.delete(forms).where(eq(forms.id, id));
		revalidatePath("/admin/forms", "layout");
		return { success: true, message: "Form deleted." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteForm]", message);
		return { success: false, message };
	}
}