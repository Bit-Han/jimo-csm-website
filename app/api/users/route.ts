// app/api/users/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getUsers,
	getUserRoleStats,
	getPendingInvitations,
} from "@/lib/services/users.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_users")) return forbidden();
		const [users, roleStats, pendingInvites] = await Promise.all([
			getUsers(),
			getUserRoleStats(),
			getPendingInvitations(),
		]);
		return ok({ users, roleStats, pendingInvites });
	} catch (err) {
		return serverError("Failed to load users.", err);
	}
}
