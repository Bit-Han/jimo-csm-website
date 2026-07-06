"use server";

import type { InviteUserFormState } from "@/lib/types/admin/users-roles";

export interface UserActionResult {
	success: boolean;
	message: string;
}

export async function inviteUser(
	data: InviteUserFormState,
): Promise<UserActionResult> {
	// TODO (integration stage):
	// 1. Validate email + role with Zod
	// 2. Generate a secure random token (crypto.randomUUID or crypto.randomBytes)
	// 3. Insert row into admin_invitations table with status = "pending",
	//    expiresAt = now + 7 days
	// 4. Send invite email via Resend/SendGrid with the accept-invite link:
	//    https://jimopropertydevelopment.com/admin/auth/accept-invite?token=<token>
	// 5. revalidatePath("/admin/users-roles")
	console.log("[inviteUser]", data.email, data.role);
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: true,
		message: `Invitation sent to ${data.email}. They will receive a link to complete signup.`,
	};
}

export async function deactivateUser(id: string): Promise<UserActionResult> {
	// TODO (integration stage):
	// db.update(adminUsers).set({ status: "inactive" }).where(eq(adminUsers.id, id))
	// Also: revoke their Supabase Auth session
	console.log("[deactivateUser]", id);
	return { success: true, message: "User deactivated." };
}

export async function reactivateUser(id: string): Promise<UserActionResult> {
	// TODO (integration stage):
	// db.update(adminUsers).set({ status: "active" }).where(eq(adminUsers.id, id))
	console.log("[reactivateUser]", id);
	return { success: true, message: "User reactivated." };
}

export async function changeUserRole(
	id: string,
	role: string,
): Promise<UserActionResult> {
	// TODO (integration stage):
	// db.update(adminUsers).set({ role }).where(eq(adminUsers.id, id))
	console.log("[changeUserRole]", id, role);
	return { success: true, message: "Role updated." };
}
