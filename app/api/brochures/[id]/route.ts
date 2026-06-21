// app/api/brochures/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	noContent,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getBrochureById,
	updateBrochure,
	replaceBrochureFile,
	deleteBrochure,
} from "@/lib/services/brochures.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		const { id } = await params;
		const brochure = await getBrochureById(id);
		if (!brochure) return notFound("Brochure not found.");
		return ok(brochure);
	} catch (err) {
		return serverError("Failed to load brochure.", err);
	}
}

// PUT — update metadata OR replace file (if formData contains "file")
export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "publish_brochure")) return forbidden();
		const { id } = await params;
		const contentType = req.headers.get("content-type") ?? "";

		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			const file = formData.get("file") as File | null;
			if (file) {
				const buffer = Buffer.from(await file.arrayBuffer());
				const updated = await replaceBrochureFile(id, buffer);
				if (!updated) return notFound("Brochure not found.");
				return ok(updated);
			}
		}

		const body = await req.json();
		const updated = await updateBrochure(id, body);
		if (!updated) return notFound("Brochure not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update brochure.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "publish_brochure")) return forbidden();
		const { id } = await params;
		await deleteBrochure(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete brochure.", err);
	}
}
