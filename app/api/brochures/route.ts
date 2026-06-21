// app/api/brochures/route.ts
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
import { getBrochures, createBrochure } from "@/lib/services/brochures.service";
import { parseIntParam } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_brochures")) return forbidden();
		const { searchParams } = req.nextUrl;
		const { data, meta } = await getBrochures(
			{
				search: searchParams.get("search") ?? undefined,
				status: searchParams.get("status") ?? undefined,
				projectId: searchParams.get("projectId") ?? undefined,
			},
			{ page: parseIntParam(searchParams.get("page"), 1) },
		);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load brochures.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "publish_brochure")) return forbidden();

		const formData = await req.formData();
		const file = formData.get("file") as File | null;
		if (!file) return badRequest("PDF file required.");

		const title = formData.get("title") as string;
		if (!title) return badRequest("Title required.");

		const buffer = Buffer.from(await file.arrayBuffer());
		const brochure = await createBrochure(
			{
				title,
				projectId: formData.get("projectId") as string | undefined,
				gateFormId: formData.get("gateFormId") as string | undefined,
				isGated: formData.get("isGated") !== "false",
				createdBy: auth.profile.id,
			},
			buffer,
			file.name,
		);
		return created(brochure);
	} catch (err) {
		return serverError("Failed to upload brochure.", err);
	}
}