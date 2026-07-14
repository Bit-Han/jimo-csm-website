import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { formFields, forms } from "@/lib/db/schema";
import {
	mapFormRowToBuilderState,
	mapFormRowToListRow,
} from "@/lib/db/mappers/form";
import type {
	AdminFormListRow,
	FormBuilderState,
} from "@/lib/types/admin/form-builder";

export async function getAdminFormListRows(): Promise<AdminFormListRow[]> {
	const allForms = await db.query.forms.findMany({
		orderBy: [desc(forms.updatedAt)],
		with: {
			fields: { orderBy: [asc(formFields.position)] },
		},
	});

	return allForms.map(mapFormRowToListRow);
}

export async function getFormBuilderStateById(
	id: string,
): Promise<FormBuilderState | null> {
	const row = await db.query.forms.findFirst({
		where: eq(forms.id, id),
		with: {
			fields: { orderBy: [asc(formFields.position)] },
		},
	});

	if (!row) return null;
	return mapFormRowToBuilderState(row);
}
