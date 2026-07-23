// lib/actions/admin/landing-pages.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { landingPages } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteCloudinaryAssetSafe } from "@/lib/integrations/cloudinary";

export interface LandingPageActionResult {
	success: boolean;
	message: string;
}

/** Unpublish only flips status back to draft — the hero image stays on
 * Cloudinary so republishing later needs no re-upload, same convention as
 * unpublishArticle. */
export async function unpublishLandingPage(
	slug: string,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.landingPages.findFirst({
			where: eq(landingPages.slug, slug),
		});
		if (!existing)
			return { success: false, message: "Landing page not found." };

		await db
			.update(landingPages)
			.set({ publishStatus: "draft", updatedAt: new Date() })
			.where(eq(landingPages.id, existing.id));

		revalidatePath("/admin/landing-pages", "layout");
		revalidatePath(`/lp/${slug}`); // no-op until Stage 4 builds the public route
		return {
			success: true,
			message: "Landing page unpublished and moved to drafts.",
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[unpublishLandingPage]", message);
		return { success: false, message };
	}
}

/** Deletes the row and the hero's background image from Cloudinary, if it
 * had one. There's no gallery/body to walk here — the hero is the whole
 * page, so cleanup is a single optional image, unlike deleteArticle's
 * cover-plus-inline-images sweep. */
export async function deleteLandingPage(
	slug: string,
): Promise<LandingPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.landingPages.findFirst({
			where: eq(landingPages.slug, slug),
		});
		if (!existing)
			return { success: false, message: "Landing page not found." };

		await db.delete(landingPages).where(eq(landingPages.id, existing.id));

		await deleteCloudinaryAssetSafe(
			existing.hero?.backgroundImageUrl ?? null,
			"image",
		);

		revalidatePath("/admin/landing-pages", "layout");
		return { success: true, message: `"${existing.title}" deleted.` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteLandingPage]", message);
		return { success: false, message };
	}
}
