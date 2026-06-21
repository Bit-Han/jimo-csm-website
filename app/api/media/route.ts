// app/api/media/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getMedia,
	getMediaFolderStats,
	getStorageUsedMb,
} from "@/lib/services/media.service";
import { parseIntParam } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_media")) return forbidden();
		const { searchParams } = req.nextUrl;

		const [{ data, meta }, folderStats, storageMb] = await Promise.all([
			getMedia(
				{
					search: searchParams.get("search") ?? undefined,
					folder: searchParams.get("folder") ?? undefined,
					projectId: searchParams.get("projectId") ?? undefined,
					resourceType: searchParams.get("resourceType") ?? undefined,
				},
				{ page: parseIntParam(searchParams.get("page"), 1), pageSize: 40 },
			),
			getMediaFolderStats(),
			getStorageUsedMb(),
		]);

		return ok({ items: data, folderStats, storageMb }, meta);
	} catch (err) {
		return serverError("Failed to load media.", err);
	}
}