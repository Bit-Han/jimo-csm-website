// "use server";

// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { db } from "@/lib/db";
// import { adminUsers } from "@/lib/db/schema";
// import { getAdminUser } from "@/lib/auth/get-admin-user";
// import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";

// export interface ProfileActionResult {
// 	success: boolean;
// 	message: string;
// }

// /**
//  * No id parameter, on purpose — this can only ever update the currently
//  * logged-in admin's own avatar, never someone else's.
//  */
// export async function updateOwnAvatar(
// 	url: string,
// 	previousUrlToDelete?: string,
// ): Promise<ProfileActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };

// 		await db
// 			.update(adminUsers)
// 			.set({ avatarUrl: url || null })
// 			.where(eq(adminUsers.id, adminUser.id));

// 		if (previousUrlToDelete)
// 			await deleteCloudinaryAssetSafe(previousUrlToDelete, "image");

// 		revalidatePath("/admin", "layout");
// 		return { success: true, message: "Profile photo updated." };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[updateOwnAvatar]", message);
// 		return { success: false, message };
// 	}
// }

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";

export interface ProfileActionResult {
	success: boolean;
	message: string;
}

const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}\s'-]{1,99}$/u;

export async function updateOwnAvatar(
	url: string,
	previousUrlToDelete?: string,
): Promise<ProfileActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await db
			.update(adminUsers)
			.set({ avatarUrl: url || null })
			.where(eq(adminUsers.id, adminUser.id));

		if (previousUrlToDelete)
			await deleteCloudinaryAssetSafe(previousUrlToDelete, "image");

		revalidatePath("/admin", "layout");
		return { success: true, message: "Profile photo updated." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[updateOwnAvatar]", message);
		return { success: false, message };
	}
}

export async function updateOwnName(
	fullName: string,
): Promise<ProfileActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const trimmed = fullName.trim();
		if (trimmed.length < 2)
			return { success: false, message: "Please enter your full name." };
		if (trimmed.length > 100)
			return { success: false, message: "Name is too long." };
		if (!NAME_PATTERN.test(trimmed))
			return { success: false, message: "Please enter a valid name." };

		await db
			.update(adminUsers)
			.set({ fullName: trimmed })
			.where(eq(adminUsers.id, adminUser.id));

		revalidatePath("/admin", "layout");
		return { success: true, message: "Name updated." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[updateOwnName]", message);
		return { success: false, message };
	}
}