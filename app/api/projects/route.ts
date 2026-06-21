// app/api/projects/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { getProjects, createProject } from "@/lib/services/projects.service";
import { createProjectSchema } from "@/lib/validations/projects";
import { parseIntParam } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_projects")) return forbidden();

		const { searchParams } = req.nextUrl;
		const filters = {
			search: searchParams.get("search") ?? undefined,
			status: searchParams.get("status") ?? undefined,
			locationArea: searchParams.get("locationArea") ?? undefined,
			type: searchParams.get("type") ?? undefined,
		};
		const pagination = {
			page: parseIntParam(searchParams.get("page"), 1),
			pageSize: parseIntParam(searchParams.get("pageSize"), 20),
			sortBy: searchParams.get("sortBy") ?? "updatedAt",
			sortOrder: (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc",
		};

		const { data, meta } = await getProjects(filters, pagination);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load projects.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_projects")) return forbidden();

		const body = await req.json();
		const parsed = createProjectSchema.safeParse(body);
		if (!parsed.success) {
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		}

		const project = await createProject(parsed.data, auth.profile.id);
		return created(project);
	} catch (err) {
		return serverError("Failed to create project.", err);
	}
}
