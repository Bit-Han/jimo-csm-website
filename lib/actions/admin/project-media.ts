"use server";

import { getAdminUser } from "@/lib/auth/get-admin-user";
import { signImageUpload } from "@/lib/integrations/cloudinary";
import { deleteCloudinaryAssetById } from "@/lib/integrations/cloudinary";

const ALLOWED_PROJECT_MEDIA_FOLDERS: Record<"image" | "video", Set<string>> = {
	image: new Set([
		"jimo-property/project-renders",
		"jimo-property/interior-renders",
		"jimo-property/construction-updates",
	]),
	video: new Set(["jimo-property/videos"]),
};

export async function requestProjectMediaUploadSignature(
	folder: string,
	resourceType: "image" | "video",
) {
	const adminUser = await getAdminUser();
	if (!adminUser) throw new Error("Not authenticated.");

	if (!ALLOWED_PROJECT_MEDIA_FOLDERS[resourceType].has(folder)) {
		throw new Error("Invalid upload folder.");
	}

	return signImageUpload(folder, resourceType);
}

export interface DeleteMediaResult {
	success: boolean;
	message: string;
}

export async function deleteProjectMediaAsset(
	cloudinaryPublicId: string,
	resourceType: "image" | "video",
): Promise<DeleteMediaResult> {
	const adminUser = await getAdminUser();
	if (!adminUser) return { success: false, message: "Not authenticated." };

	try {
		await deleteCloudinaryAssetById(cloudinaryPublicId, resourceType);
		return { success: true, message: "Deleted." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Delete failed.";
		console.error("[deleteProjectMediaAsset]", message);
		return { success: false, message };
	}
}
