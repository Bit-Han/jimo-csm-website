// "use server";

// export interface BrochureActionResult {
// 	success: boolean;
// 	message: string;
// }

// export async function publishBrochure(
// 	id: string,
// ): Promise<BrochureActionResult> {
// 	// TODO (integration stage):
// 	// db.update(brochures).set({ status: "active" }).where(eq(brochures.id, id))
// 	// revalidatePath(`/admin/brochures`)
// 	console.log("[publishBrochure]", id);
// 	await new Promise((res) => setTimeout(res, 400));
// 	return { success: true, message: "Brochure published." };
// }

// export async function uploadBrochure(
// 	_formData: FormData,
// ): Promise<BrochureActionResult> {
// 	// TODO (integration stage):
// 	// 1. Extract file from formData
// 	// 2. Upload to Cloudinary via lib/cloudinary.ts → uploadToCloudinary(file, "jimo-property/brochures")
// 	// 3. Insert row into brochures table with cloudinaryPublicId + fileUrl
// 	// 4. revalidatePath("/admin/brochures")
// 	await new Promise((res) => setTimeout(res, 600));
// 	return {
// 		success: true,
// 		message: "Brochure upload queued — Cloudinary integration pending.",
// 	};
// }

// export async function replaceBrochure(
// 	id: string,
// 	_formData: FormData,
// ): Promise<BrochureActionResult> {
// 	// TODO (integration stage):
// 	// 1. Delete old Cloudinary asset via deleteFromCloudinary(oldPublicId)
// 	// 2. Upload new file, update brochures row
// 	console.log("[replaceBrochure]", id);
// 	await new Promise((res) => setTimeout(res, 600));
// 	return {
// 		success: true,
// 		message: "Brochure replaced — Cloudinary integration pending.",
// 	};
// }

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { brochures, projects } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/integrations/cloudinary";

export interface BrochureActionResult {
	success: boolean;
	message: string;
}

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
		return { success: false, message };
	}
}

export async function uploadBrochure(
	formData: FormData,
): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const file = formData.get("file") as File | null;
		const title = String(formData.get("title") ?? "").trim();
		const projectSlug = String(formData.get("projectSlug") ?? "").trim();

		if (!file || file.size === 0) {
			return { success: false, message: "No file selected." };
		}
		if (!title) {
			return { success: false, message: "Brochure title is required." };
		}
		if (!projectSlug) {
			return { success: false, message: "Select a project for this brochure." };
		}

		const project = await db.query.projects.findFirst({
			where: eq(projects.slug, projectSlug),
		});

		if (!project) {
			return { success: false, message: "Project not found." };
		}

		// Upload to Cloudinary
		const result = await uploadToCloudinary(file, "jimo-property/brochures");

		await db.insert(brochures).values({
			projectId: project.id,
			title,
			cloudinaryPublicId: result.publicId,
			fileUrl: result.secureUrl,
			status: "draft",
		});

		revalidatePath("/admin/brochures");
		return {
			success: true,
			message: "Brochure uploaded. Review and publish when ready.",
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Upload failed.";
		console.error("[uploadBrochure]", message);
		return { success: false, message };
	}
}

export async function replaceBrochure(
	id: string,
	formData: FormData,
): Promise<BrochureActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const file = formData.get("file") as File | null;
		const title = String(formData.get("title") ?? "").trim();

		if (!file || file.size === 0) {
			return { success: false, message: "No file selected." };
		}

		const existing = await db.query.brochures.findFirst({
			where: eq(brochures.id, id),
		});

		if (!existing) {
			return { success: false, message: "Brochure not found." };
		}

		// Remove old Cloudinary asset (skip seeded placeholders)
		if (!existing.cloudinaryPublicId.startsWith("placeholder-")) {
			await deleteFromCloudinary(existing.cloudinaryPublicId, "raw");
		}

		const result = await uploadToCloudinary(file, "jimo-property/brochures");

		await db
			.update(brochures)
			.set({
				title: title || existing.title,
				cloudinaryPublicId: result.publicId,
				fileUrl: result.secureUrl,
			})
			.where(eq(brochures.id, id));

		revalidatePath("/admin/brochures");
		return { success: true, message: "Brochure replaced successfully." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Replace failed.";
		console.error("[replaceBrochure]", message);
		return { success: false, message };
	}
}