

"use server";

import { getAdminUser } from "@/lib/auth/get-admin-user";
import { signImageUpload } from "@/lib/integrations/cloudinary";


const ALLOWED_IMAGE_FOLDERS = new Set([
	"jimo-property/site-images",
	"jimo-property/team-photos",
	"jimo-property/project-renders",
	"jimo-property/interior-renders",
	"jimo-property/construction-updates",
	"jimo-property/logos-icons",
	"jimo-property/insights",
	"jimo-property/insights-body",
	"jimo-property/admin-avatars",
	"jimo-property/landing-pages",
]);

export async function requestImageUploadSignature(folder: string) {
	const adminUser = await getAdminUser();
	if (!adminUser) throw new Error("Not authenticated.");

	if (!ALLOWED_IMAGE_FOLDERS.has(folder)) {
		throw new Error("Invalid upload folder.");
	}

	return signImageUpload(folder, "image");
}