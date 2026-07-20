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

/**
 * No id parameter, on purpose — this can only ever update the currently
 * logged-in admin's own avatar, never someone else's.
 */
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
