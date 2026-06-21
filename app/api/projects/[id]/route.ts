// app/api/projects/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	unauthorized,
	forbidden,
	badRequest,
	noContent,
	serverError,
} from "@/lib/utils/api-response";
import {
	getProjectById,
	updateProject,
	deleteProject,
} from "@/lib/services/projects.service";
import { updateProjectSchema } from "@/lib/validations/projects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_projects")) return forbidden();

		const { id } = await params;
		const project = await getProjectById(id);
		if (!project) return notFound("Project not found.");
		return ok(project);
	} catch (err) {
		return serverError("Failed to load project.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_projects")) return forbidden();

		const { id } = await params;
		const body = await req.json();

		const hasPricingChange = "startingPriceKobo" in body;
		if (hasPricingChange && !can(auth.profile.role, "edit_pricing")) {
			return forbidden("You do not have permission to edit pricing.");
		}

		const parsed = updateProjectSchema.safeParse(body);
		if (!parsed.success) {
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		}

		const updated = await updateProject(id, parsed.data, auth.profile.id);
		if (!updated) return notFound("Project not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update project.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_projects")) return forbidden();

		const { id } = await params;
		const project = await getProjectById(id);
		if (!project) return notFound("Project not found.");

		await deleteProject(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete project.", err);
	}
}
