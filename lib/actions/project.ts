"use server";

import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

export interface ProjectActionResult {
	success: boolean;
	message: string;
	slug?: string;
}

export async function saveDraftProject(
	currentSlug: string | null,
	state: ProjectEditorState,
): Promise<ProjectActionResult> {
	// TODO (integration stage):
	// 1. Parse and validate state with Zod
	// 2. Drizzle upsert into `projects` table (create or update by slug)
	// 3. Cascade upsert to project_facts, project_units, project_checklist_items,
	//    project_amenities, project_media, project_categories
	// 4. Return the saved slug (may differ from currentSlug if name changed)
	console.log("[saveDraft]", currentSlug ?? "new →", state.name);
	await new Promise((res) => setTimeout(res, 400));
	return {
		success: true,
		message: "Draft saved successfully.",
		slug: currentSlug ?? "",
	};
}

export async function publishProject(
	currentSlug: string | null,
	state: ProjectEditorState,
): Promise<ProjectActionResult> {
	// TODO (integration stage):
	// 1. Validate with Zod
	// 2. Upsert with publishStatus = "published"
	// 3. revalidatePath(`/projects/${slug}`)
	// 4. revalidatePath("/projects")
	// 5. revalidatePath("/") — home page featured projects section
	console.log("[publish]", currentSlug ?? "new →", state.name);
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: true,
		message: "Project published to website.",
		slug: currentSlug ?? "",
	};
}
