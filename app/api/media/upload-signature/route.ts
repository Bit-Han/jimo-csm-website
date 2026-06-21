// app/api/media/upload-signature/route.ts
// Returns a signed upload signature for large file client-side uploads to Cloudinary
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import {
	generateSignedUploadParams,
	getCloudinaryFolder,
} from "@/lib/integrations/cloudinary";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "upload_media")) return forbidden();
		const folder = req.nextUrl.searchParams.get("folder") ?? "project_renders";
		const cloudinaryFolder = getCloudinaryFolder(folder);
		const params = generateSignedUploadParams(cloudinaryFolder);
		return ok(params);
	} catch (err) {
		return serverError("Failed to generate upload signature.", err);
	}
}
