"use server";

export interface BrochureActionResult {
	success: boolean;
	message: string;
}

export async function publishBrochure(
	id: string,
): Promise<BrochureActionResult> {
	// TODO (integration stage):
	// db.update(brochures).set({ status: "active" }).where(eq(brochures.id, id))
	// revalidatePath(`/admin/brochures`)
	console.log("[publishBrochure]", id);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: "Brochure published." };
}

export async function uploadBrochure(
	_formData: FormData,
): Promise<BrochureActionResult> {
	// TODO (integration stage):
	// 1. Extract file from formData
	// 2. Upload to Cloudinary via lib/cloudinary.ts → uploadToCloudinary(file, "jimo-property/brochures")
	// 3. Insert row into brochures table with cloudinaryPublicId + fileUrl
	// 4. revalidatePath("/admin/brochures")
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: true,
		message: "Brochure upload queued — Cloudinary integration pending.",
	};
}

export async function replaceBrochure(
	id: string,
	_formData: FormData,
): Promise<BrochureActionResult> {
	// TODO (integration stage):
	// 1. Delete old Cloudinary asset via deleteFromCloudinary(oldPublicId)
	// 2. Upload new file, update brochures row
	console.log("[replaceBrochure]", id);
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: true,
		message: "Brochure replaced — Cloudinary integration pending.",
	};
}