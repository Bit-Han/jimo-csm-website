"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { formFields, forms } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { FormBuilderState } from "@/lib/types/admin/form-builder";

export interface FormActionResult {
	success: boolean;
	message: string;
	id?: string;
}

export async function saveForm(
	state: FormBuilderState,
): Promise<FormActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (!state.title.trim()) {
			return { success: false, message: "Form title is required." };
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
			const [inserted] = await db
				.insert(forms)
				.values(formValues)
				.returning({ id: forms.id });
			formId = inserted!.id;
		} else {
			const existing = await db.query.forms.findFirst({
				where: eq(forms.id, state.id),
			});
			if (!existing) {
				return { success: false, message: "Form not found." };
			}
			await db.update(forms).set(formValues).where(eq(forms.id, state.id));
			formId = state.id;
		}

		// Replace all fields
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
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveForm]", message);
		return { success: false, message };
	}
}

export async function deleteForm(id: string): Promise<FormActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await db.delete(forms).where(eq(forms.id, id));
		revalidatePath("/admin/forms", "layout");

		return { success: true, message: "Form deleted." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}
