// //lib/actions/admin/brochure.ts
// "use server";

// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { v2 as cloudinary } from "cloudinary";
// import { brochures} from "@/lib/db/schema";
// import { db } from "@/lib/db";
// import { getAdminUser } from "@/lib/auth/get-admin-user";
// // import {
// // 	deleteFromCloudinary,
// // 	uploadToCloudinary,
// // } from "@/lib/integrations/cloudinary";

// // cloudinary.config({
// // 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// // 	api_key: process.env.CLOUDINARY_API_KEY,
// // 	api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// export interface BrochureActionResult {
// 	success: boolean;
// 	message: string;
// }

// // // ── UploadBrochure ────────────────────────────────────────────────────────────────

// // export async function uploadBrochure(
// // 	formData: FormData,
// // ): Promise<BrochureActionResult> {
// // 	try {
// // 		const adminUser = await getAdminUser();
// // 		if (!adminUser) return { success: false, message: "Not authenticated." };

// // 		const file = formData.get("file") as File | null;
// // 		const title = String(formData.get("title") ?? "").trim();
// // 		const projectSlug = String(formData.get("projectSlug") ?? "").trim();

// // 		if (!file || file.size === 0) {
// // 			return { success: false, message: "No file selected." };
// // 		}
// // 		if (!title) {
// // 			return { success: false, message: "Brochure title is required." };
// // 		}
// // 		if (!projectSlug) {
// // 			return { success: false, message: "Select a project for this brochure." };
// // 		}

// // 		const project = await db.query.projects.findFirst({
// // 			where: eq(projects.slug, projectSlug),
// // 		});

// // 		if (!project) {
// // 			return { success: false, message: "Project not found." };
// // 		}

// // 		// Upload to Cloudinary
// // 		const result = await uploadToCloudinary(file, "jimo-property/brochures");

// // 		await db.insert(brochures).values({
// // 			projectId: project.id,
// // 			title,
// // 			cloudinaryPublicId: result.publicId,
// // 			fileUrl: result.secureUrl,
// // 			status: "draft",
// // 		});

// // 		revalidatePath("/admin/brochures");
// // 		return {
// // 			success: true,
// // 			message: "Brochure uploaded. Review and publish when ready.",
// // 		};
// // 	} catch (error) {
// // 		const message = error instanceof Error ? error.message : "Upload failed.";
// // 		console.error("[uploadBrochure]", message);
// // 		return { success: false, message };
// // 	}
// // }

// // ── Publish ────────────────────────────────────────────────────────────────
// export async function publishBrochure(
// 	id: string,
// ): Promise<BrochureActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };

// 		await db
// 			.update(brochures)
// 			.set({ status: "active" })
// 			.where(eq(brochures.id, id));

// 		revalidatePath("/admin/brochures");

// 		return { success: true, message: "Brochure published." };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[publishBrochure]", message);
// 		return { success: false, message };
// 	}
// }

// // ── Unpublish (back to draft) ──────────────────────────────────────────────
// export async function unpublishBrochure(
// 	id: string,
// ): Promise<BrochureActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };

// 		await db
// 			.update(brochures)
// 			.set({ status: "draft" })
// 			.where(eq(brochures.id, id));

// 		revalidatePath("/admin/brochures");

// 		return { success: true, message: "Brochure moved back to draft." };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[unpublishBrochure]", message);
// 		return { success: false, message };
// 	}
// }

// // ── Delete ─────────────────────────────────────────────────────────────────
// export async function deleteBrochure(
// 	id: string,
// ): Promise<BrochureActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };

// 		const existing = await db.query.brochures.findFirst({
// 			where: eq(brochures.id, id),
// 		});

// 		if (!existing) return { success: false, message: "Brochure not found." };

// 		// Delete from Cloudinary first (skip seeded placeholder entries)
// 		if (!existing.cloudinaryPublicId.startsWith("placeholder-")) {
// 			await new Promise<void>((resolve) => {
// 				cloudinary.uploader.destroy(
// 					existing.cloudinaryPublicId,
// 					{ resource_type: "raw" },
// 					(error) => {
// 						if (error) {
// 							console.warn(
// 								"[deleteBrochure] Cloudinary delete warning:",
// 								error.message,
// 							);
// 						}
// 						resolve();
// 					},
// 				);
// 			});
// 		}

// 		// Delete from DB
// 		await db.delete(brochures).where(eq(brochures.id, id));

// 		revalidatePath("/admin/brochures");

// 		return { success: true, message: `"${existing.title}" deleted.` };
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[deleteBrochure]", message);
// 		return { success: false, message };
// 	}
// }

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { brochures, projects } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import {
	cloudinary,
	signBrochureUpload,
	withTimeout,
} from "@/lib/integrations/cloudinary";

export interface BrochureActionResult {
	success: boolean;
	message: string;
}

// ── Step 1 of upload: sign the request so the browser can go straight to Cloudinary ──
export async function requestBrochureUploadSignature(projectSlug: string) {
	const adminUser = await getAdminUser();
	if (!adminUser) throw new Error("Not authenticated.");
	if (!projectSlug) throw new Error("Select a project first.");

	const publicId = `${projectSlug}-${Date.now()}`;
	return signBrochureUpload(publicId);
}

// ── Step 2 of upload: Cloudinary already has the file — just save the metadata ──
export async function recordBrochureUpload(input: {
	title: string;
	projectSlug: string;
	cloudinaryPublicId: string;
	fileUrl: string;
}): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const title = input.title.trim();
		if (!title) return { success: false, message: "Title is required." };

		const project = await db.query.projects.findFirst({
			where: eq(projects.slug, input.projectSlug),
		});
		if (!project) return { success: false, message: "Project not found." };

		await db.insert(brochures).values({
			projectId: project.id,
			title,
			cloudinaryPublicId: input.cloudinaryPublicId,
			fileUrl: input.fileUrl,
			status: "draft",
		});

		revalidatePath("/admin/brochures");
		return {
			success: true,
			message: "Brochure uploaded. Review and publish when ready.",
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Save failed.";
		console.error("[recordBrochureUpload]", message);
		return { success: false, message };
	}
}

// ── Step 1 of replace: sign a new upload for an existing brochure row ──
export async function requestBrochureReplaceSignature(id: string) {
	const adminUser = await getAdminUser();
	if (!adminUser) throw new Error("Not authenticated.");

	const existing = await db.query.brochures.findFirst({
		where: eq(brochures.id, id),
	});
	if (!existing) throw new Error("Brochure not found.");

	const baseName =
		existing.cloudinaryPublicId.split("/").pop()?.split("-")[0] ?? "brochure";
	return signBrochureUpload(`${baseName}-${Date.now()}`);
}

// ── Step 2 of replace: new file is on Cloudinary — clean up the old one, update DB ──
export async function recordBrochureReplace(input: {
	id: string;
	cloudinaryPublicId: string;
	fileUrl: string;
}): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.brochures.findFirst({
			where: eq(brochures.id, input.id),
		});
		if (!existing) return { success: false, message: "Brochure not found." };

		if (!existing.cloudinaryPublicId.startsWith("placeholder-")) {
			try {
				await withTimeout(
					cloudinary.uploader.destroy(existing.cloudinaryPublicId, {
						resource_type: "raw",
					}),
					8000,
					"Cloudinary delete",
				);
			} catch (err) {
				// Don't fail the whole replace over cleanup — the new file is already live either way
				console.warn(
					"[recordBrochureReplace] old file cleanup failed or timed out:",
					err,
				);
			}
		}

		await db
			.update(brochures)
			.set({
				cloudinaryPublicId: input.cloudinaryPublicId,
				fileUrl: input.fileUrl,
				uploadedAt: new Date(),
			})
			.where(eq(brochures.id, input.id));

		revalidatePath("/admin/brochures");
		return { success: true, message: "Brochure replaced successfully." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Replace failed.";
		console.error("[recordBrochureReplace]", message);
		return { success: false, message };
	}
}

// ── Publish / Unpublish / Delete — keep exactly as they were, just add the same timeout guard to delete's Cloudinary call ──
export async function publishBrochure(
	id: string,
): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		await db
			.update(brochures)
			.set({ status: "active" })
			.where(eq(brochures.id, id));
		revalidatePath("/admin/brochures");
		return { success: true, message: "Brochure published." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[publishBrochure]", message);
		return { success: false, message };
	}
}

export async function unpublishBrochure(
	id: string,
): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		await db
			.update(brochures)
			.set({ status: "draft" })
			.where(eq(brochures.id, id));
		revalidatePath("/admin/brochures");
		return { success: true, message: "Brochure moved back to draft." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[unpublishBrochure]", message);
		return { success: false, message };
	}
}

export async function deleteBrochure(
	id: string,
): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.brochures.findFirst({
			where: eq(brochures.id, id),
		});
		if (!existing) return { success: false, message: "Brochure not found." };

		if (!existing.cloudinaryPublicId.startsWith("placeholder-")) {
			try {
				await withTimeout(
					cloudinary.uploader.destroy(existing.cloudinaryPublicId, {
						resource_type: "raw",
					}),
					8000,
					"Cloudinary delete",
				);
			} catch (err) {
				console.warn(
					"[deleteBrochure] Cloudinary delete failed or timed out:",
					err,
				);
			}
		}

		await db.delete(brochures).where(eq(brochures.id, id));
		revalidatePath("/admin/brochures");
		return { success: true, message: `"${existing.title}" deleted.` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[deleteBrochure]", message);
		return { success: false, message };
	}
}