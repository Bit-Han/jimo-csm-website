// app/api/forms/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	noContent,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import {
	getFormById,
	updateForm,
	deleteForm,
} from "@/lib/services/forms.service";
import { updateFormSchema } from "@/lib/validations/forms";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_forms")) return forbidden();
		const { id } = await params;
		const form = await getFormById(id);
		if (!form) return notFound("Form not found.");
		return ok(form);
	} catch (err) {
		return serverError("Failed to load form.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_forms")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const parsed = updateFormSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		const updated = await updateForm(id, parsed.data);
		if (!updated) return notFound("Form not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update form.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_forms")) return forbidden();
		const { id } = await params;
		await deleteForm(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete form.", err);
	}
}
