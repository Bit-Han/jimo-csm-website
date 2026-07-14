// "use server";

// export interface MediaActionResult {
// 	success: boolean;
// 	message: string;
// 	assetId?: string;
// }

// export async function uploadMediaAsset(
// 	_formData: FormData,
// ): Promise<MediaActionResult> {
// 	// TODO (integration stage):
// 	// 1. Extract file from formData
// 	// 2. uploadToCloudinary(file, folder) from lib/cloudinary.ts
// 	// 3. db.insert(mediaAssets).values({ cloudinaryPublicId, url, ... })
// 	// 4. revalidatePath("/admin/media-library")
// 	await new Promise((res) => setTimeout(res, 600));
// 	return {
// 		success: true,
// 		message: "Upload queued — Cloudinary integration pending.",
// 	};
// }

// export async function deleteMediaAsset(id: string): Promise<MediaActionResult> {
// 	// TODO (integration stage):
// 	// 1. Get cloudinaryPublicId from mediaAssets row
// 	// 2. deleteFromCloudinary(publicId, resourceType) from lib/cloudinary.ts
// 	// 3. db.delete(mediaAssets).where(eq(mediaAssets.id, id))
// 	// 4. revalidatePath("/admin/media-library")
// 	console.log("[deleteMediaAsset]", id);
// 	return { success: true, message: "Asset deleted." };
// }

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteFromCloudinary } from "@/lib/integrations/cloudinary";

export interface MediaActionResult {
	success: boolean;
	message: string;
}

export async function deleteMediaAsset(id: string): Promise<MediaActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const asset = await db.query.mediaAssets.findFirst({
			where: eq(mediaAssets.id, id),
		});

		if (!asset) {
			return { success: false, message: "Asset not found." };
		}

		// Skip deletion for placeholder entries (seeded data)
		if (!asset.cloudinaryPublicId.startsWith("placeholder-")) {
			await deleteFromCloudinary(asset.cloudinaryPublicId, asset.resourceType);
		}

		await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

		revalidatePath("/admin/media-library");

		return { success: true, message: "Asset deleted." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteMediaAsset]", message);
		return { success: false, message };
	}
}

// The uploadMediaAsset Server Action is now replaced by the API route
// (src/app/api/admin/media/upload/route.ts) which Cloudinary credentials
// are used server-side only. Keeping this stub for backwards compatibility.
export async function uploadMediaAsset(
	_formData: FormData,
): Promise<MediaActionResult> {
	return {
		success: false,
		message: "Use the /api/admin/media/upload route instead.",
	};
}