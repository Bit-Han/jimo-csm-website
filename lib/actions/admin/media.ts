

"use server";

import { getAdminUser } from "@/lib/auth/get-admin-user";
import { signImageUpload } from "@/lib/integrations/cloudinary";

// // Server-side allowlist — a client could otherwise pass any folder string,
// // and while a bad folder can't do real damage, constraining it keeps your
// // Cloudinary media library organized and catches typos immediately.
// const ALLOWED_IMAGE_FOLDERS = new Set([
// 	"jimo-property/site-images",
// 	"jimo-property/team-photos",
// 	"jimo-property/project-renders",
// 	"jimo-property/interior-renders",
// 	"jimo-property/construction-updates",
// 	"jimo-property/logos-icons",
// ]);

// export async function requestImageUploadSignature(folder: string) {
// 	const adminUser = await getAdminUser();
// 	if (!adminUser) throw new Error("Not authenticated.");

// 	if (!ALLOWED_IMAGE_FOLDERS.has(folder)) {
// 		throw new Error("Invalid upload folder.");
// 	}

// 	return signImageUpload(folder, "image");
// }


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
]);

export async function requestImageUploadSignature(folder: string) {
	const adminUser = await getAdminUser();
	if (!adminUser) throw new Error("Not authenticated.");

	if (!ALLOWED_IMAGE_FOLDERS.has(folder)) {
		throw new Error("Invalid upload folder.");
	}

	return signImageUpload(folder, "image");
}