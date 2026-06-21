// app/api/forms/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { getForms, createForm } from "@/lib/services/forms.service";
import { createFormSchema } from "@/lib/validations/forms";
import { parseIntParam } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_forms")) return forbidden();
		const { searchParams } = req.nextUrl;
		const { data, meta } = await getForms(
			{
				search: searchParams.get("search") ?? undefined,
				status: searchParams.get("status") ?? undefined,
			},
			{ page: parseIntParam(searchParams.get("page"), 1) },
		);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load forms.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_forms")) return forbidden();
		const body = await req.json();
		const parsed = createFormSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		const form = await createForm(parsed.data);
		return created(form);
	} catch (err) {
		return serverError("Failed to create form.", err);
	}
}
