// lib/actions/projects.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	createProject as createProjectService,
	updateProject as updateProjectService,
	deleteProject as deleteProjectService,
	createProjectUnit as createProjectUnitService,
	updateProjectUnit as updateProjectUnitService,
	deleteProjectUnit as deleteProjectUnitService,
} from "@/lib/services/projects.service";
import {
	createProjectSchema,
	updateProjectSchema,
	createProjectUnitSchema,
	updateProjectUnitSchema,
} from "@/lib/validations/projects";
import type { Project, ProjectUnit } from "@/lib/types";

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

export async function createProjectAction(
	input: unknown,
): Promise<ActionResult<Project>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	const parsed = createProjectSchema.safeParse(input);
	if (!parsed.success)
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Validation failed",
		};

	const project = await createProjectService(parsed.data, auth.profile.id);
	revalidatePath("/admin/projects");
	return { success: true, data: project };
}

export async function updateProjectAction(
	id: string,
	input: unknown,
): Promise<ActionResult<Project>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	if (
		typeof input === "object" &&
		input &&
		"startingPriceKobo" in input &&
		!can(auth.profile.role, "edit_pricing")
	) {
		return {
			success: false,
			error: "You do not have permission to edit pricing.",
		};
	}

	const parsed = updateProjectSchema.safeParse(input);
	if (!parsed.success)
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Validation failed",
		};

	const updated = await updateProjectService(id, parsed.data, auth.profile.id);
	if (!updated) return { success: false, error: "Project not found." };

	revalidatePath("/admin/projects");
	revalidatePath(`/admin/projects/${id}/edit`);
	return { success: true, data: updated };
}

export async function deleteProjectAction(
	id: string,
): Promise<ActionResult<{ id: string }>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	await deleteProjectService(id);
	revalidatePath("/admin/projects");
	return { success: true, data: { id } };
}

export async function createProjectUnitAction(
	projectId: string,
	input: unknown,
): Promise<ActionResult<ProjectUnit>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	const parsed = createProjectUnitSchema.safeParse(input);
	if (!parsed.success)
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Validation failed",
		};

	const unit = await createProjectUnitService(projectId, parsed.data);
	revalidatePath(`/admin/projects/${projectId}/edit`);
	return { success: true, data: unit };
}

export async function updateProjectUnitAction(
	projectId: string,
	unitId: string,
	input: unknown,
): Promise<ActionResult<ProjectUnit>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	if (
		typeof input === "object" &&
		input &&
		("currentPriceKobo" in input || "launchPriceKobo" in input) &&
		!can(auth.profile.role, "edit_pricing")
	) {
		return {
			success: false,
			error: "You do not have permission to edit pricing.",
		};
	}

	const parsed = updateProjectUnitSchema.safeParse(input);
	if (!parsed.success)
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Validation failed",
		};

	const updated = await updateProjectUnitService(unitId, parsed.data);
	if (!updated) return { success: false, error: "Unit not found." };

	revalidatePath(`/admin/projects/${projectId}/edit`);
	return { success: true, data: updated };
}

export async function deleteProjectUnitAction(
	projectId: string,
	unitId: string,
): Promise<ActionResult<{ id: string }>> {
	const auth = await getAuthUser();
	if (!auth) return { success: false, error: "Unauthorized" };
	if (!can(auth.profile.role, "edit_projects"))
		return { success: false, error: "Forbidden" };

	await deleteProjectUnitService(unitId);
	revalidatePath(`/admin/projects/${projectId}/edit`);
	return { success: true, data: { id: unitId } };
}
