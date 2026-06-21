// app/api/users/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser, createAdminClient } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	noContent,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import {
	getUserById,
	updateUserRole,
	deactivateUser,
	reactivateUser,
} from "@/lib/services/users.service";
import { updateProfileSchema } from "@/lib/validations/users";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_users")) return forbidden();
		const { id } = await params;
		const user = await getUserById(id);
		if (!user) return notFound("User not found.");
		return ok(user);
	} catch (err) {
		return serverError("Failed to load user.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "manage_users")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const parsed = updateProfileSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");

		if (parsed.data.role) await updateUserRole(id, parsed.data.role);
		if (parsed.data.status === "inactive") await deactivateUser(id);
		if (parsed.data.status === "active") await reactivateUser(id);

		const updated = await getUserById(id);
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update user.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "manage_users")) return forbidden();
		const { id } = await params;

		// Prevent self-deletion
		if (id === auth.profile.id)
			return badRequest("You cannot delete your own account.");

		await deactivateUser(id);
		// Optionally ban in Supabase Auth too
		const adminClient = await createAdminClient();
		await adminClient.auth.admin.deleteUser(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete user.", err);
	}
}
