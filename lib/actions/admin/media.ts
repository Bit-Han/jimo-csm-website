"use server";

export interface MediaActionResult {
	success: boolean;
	message: string;
	assetId?: string;
}

export async function uploadMediaAsset(
	_formData: FormData,
): Promise<MediaActionResult> {
	// TODO (integration stage):
	// 1. Extract file from formData
	// 2. uploadToCloudinary(file, folder) from lib/cloudinary.ts
	// 3. db.insert(mediaAssets).values({ cloudinaryPublicId, url, ... })
	// 4. revalidatePath("/admin/media-library")
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: true,
		message: "Upload queued — Cloudinary integration pending.",
	};
}

export async function deleteMediaAsset(id: string): Promise<MediaActionResult> {
	// TODO (integration stage):
	// 1. Get cloudinaryPublicId from mediaAssets row
	// 2. deleteFromCloudinary(publicId, resourceType) from lib/cloudinary.ts
	// 3. db.delete(mediaAssets).where(eq(mediaAssets.id, id))
	// 4. revalidatePath("/admin/media-library")
	console.log("[deleteMediaAsset]", id);
	return { success: true, message: "Asset deleted." };
}
