// app/api/media/[id]/route.ts
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
	getMediaById,
	updateMedia,
	deleteMedia,
} from "@/lib/services/media.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_media")) return forbidden();
		const { id } = await params;
		const item = await getMediaById(id);
		if (!item) return notFound("Media item not found.");
		return ok(item);
	} catch (err) {
		return serverError("Failed to load media item.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "upload_media")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const updated = await updateMedia(id, body);
		if (!updated) return notFound("Media item not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update media item.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "upload_media")) return forbidden();
		const { id } = await params;
		await deleteMedia(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete media item.", err);
	}
}
