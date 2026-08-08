// //@/lib/actions/admin/users.ts

// "use server";

// import { and, eq, ne, count } from "drizzle-orm";
// import { createAdminClient } from "@/lib/supabase/admin";
// import { db } from "@/lib/db";
// import { adminInvitations, adminUsers } from "@/lib/db/schema";
// import { getAdminUser } from "@/lib/auth/get-admin-user";
// import type { AdminRole } from "@/lib/types/admin/role";
// import type { InviteCreatedResult } from "@/lib/types/admin/auth";
// import type { InviteUserFormState } from "@/lib/types/admin/users-roles";

// const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// function getInviteRedirectBaseUrl(): string {
// 	return (
// 		process.env.NEXT_PUBLIC_SITE_URL ??
// 		process.env.NEXT_PUBLIC_APP_URL ??
// 		"https://jimodevelopment.com"
// 	);
// }

// export interface UserActionResult {
// 	success: boolean;
// 	message: string;
// }

// async function countActiveSuperAdmins(excludingId?: string): Promise<number> {
// 	const rows = await db
// 		.select({ total: count() })
// 		.from(adminUsers)
// 		.where(
// 			excludingId
// 				? and(
// 						eq(adminUsers.role, "super-admin"),
// 						eq(adminUsers.status, "active"),
// 						ne(adminUsers.id, excludingId),
// 					)
// 				: and(
// 						eq(adminUsers.role, "super-admin"),
// 						eq(adminUsers.status, "active"),
// 					),
// 		);
// 	return rows[0]?.total ?? 0;
// }

// export async function inviteUser(
// 	data: InviteUserFormState,
// ): Promise<InviteCreatedResult> {
// 	const caller = await getAdminUser();
// 	if (!caller) return { success: false, message: "Not authenticated." };
// 	if (caller.role !== "super-admin") {
// 		return { success: false, message: "Only Super Admins can invite users." };
// 	}

// 	const email = data.email.trim().toLowerCase();
// 	if (!EMAIL_PATTERN.test(email)) {
// 		return { success: false, message: "Please enter a valid email address." };
// 	}

// 	const existingUser = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.email, email),
// 	});
// 	if (existingUser) {
// 		return {
// 			success: false,
// 			message: "A user with this email already exists.",
// 		};
// 	}

// 	const existingInvite = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.email, email),
// 			eq(adminInvitations.status, "pending"),
// 		),
// 	});
// 	if (existingInvite) {
// 		return {
// 			success: true,
// 			message:
// 				"A pending invite already exists for this email. Check the Supabase dashboard to resend it.",
// 		};
// 	}

// 	const adminSupabase = createAdminClient();
// 	const redirectBaseUrl = getInviteRedirectBaseUrl();

// 	const { error: inviteError } =
// 		await adminSupabase.auth.admin.inviteUserByEmail(email, {
// 			redirectTo: `${redirectBaseUrl}/api/callback?next=/admin/auth/accept-invite`,
// 			data: { adminRole: data.role },
// 		});

// 	if (inviteError) {
// 		// Supabase returns a specific message when the email already belongs
// 		// to an existing Auth user (e.g. left over from a previous invite
// 		// that never completed signup, or created some other way). Surface
// 		// that plainly instead of a generic failure — it points the admin
// 		// at the actual fix (check Supabase Auth → Users directly).
// 		const alreadyRegistered = /already registered|already exists/i.test(
// 			inviteError.message,
// 		);
// 		return {
// 			success: false,
// 			message: alreadyRegistered
// 				? "This email is already registered in Supabase Auth but has no admin profile yet. Check Authentication → Users in the Supabase dashboard."
// 				: `Failed to send invite: ${inviteError.message}`,
// 		};
// 	}

// 	const expiresAt = new Date();
// 	expiresAt.setDate(expiresAt.getDate() + 1);

// 	await db.insert(adminInvitations).values({
// 		email,
// 		role: data.role,
// 		// token is nullable — Supabase owns the real invite token internally,
// 		// we only track the relationship for our own audit trail.
// 		token: null,
// 		status: "pending",
// 		invitedByUserId: caller.id,
// 		expiresAt,
// 	});

// 	return {
// 		success: true,
// 		message: `Invite sent to ${email} via Supabase. They will receive an email from your configured sender address.`,
// 	};
// }

// export async function deactivateUser(id: string): Promise<UserActionResult> {
// 	const caller = await getAdminUser();
// 	if (!caller) return { success: false, message: "Not authenticated." };
// 	if (caller.role !== "super-admin") {
// 		return {
// 			success: false,
// 			message: "Only Super Admins can deactivate users.",
// 		};
// 	}

// 	const target = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.id, id),
// 	});
// 	if (!target) return { success: false, message: "User not found." };

// 	if (target.role === "super-admin") {
// 		const remaining = await countActiveSuperAdmins(id);
// 		if (remaining === 0) {
// 			return {
// 				success: false,
// 				message: "You can't deactivate the last active Super Admin.",
// 			};
// 		}
// 	}

// 	await db
// 		.update(adminUsers)
// 		.set({ status: "inactive" })
// 		.where(eq(adminUsers.id, id));
// 	return { success: true, message: "User deactivated." };
// }

// export async function reactivateUser(id: string): Promise<UserActionResult> {
// 	const caller = await getAdminUser();
// 	if (!caller) return { success: false, message: "Not authenticated." };
// 	if (caller.role !== "super-admin") {
// 		return {
// 			success: false,
// 			message: "Only Super Admins can reactivate users.",
// 		};
// 	}

// 	await db
// 		.update(adminUsers)
// 		.set({ status: "active" })
// 		.where(eq(adminUsers.id, id));
// 	return { success: true, message: "User reactivated." };
// }

// export async function changeUserRole(
// 	id: string,
// 	role: string,
// ): Promise<UserActionResult> {
// 	const caller = await getAdminUser();
// 	if (!caller) return { success: false, message: "Not authenticated." };
// 	if (caller.role !== "super-admin") {
// 		return { success: false, message: "Only Super Admins can change roles." };
// 	}

// 	const validRoles: AdminRole[] = [
// 		"super-admin",
// 		"website-manager",
// 		"content-seo",
// 		"sales-crm",
// 		"marketing-admin",
// 	];
// 	if (!validRoles.includes(role as AdminRole)) {
// 		return { success: false, message: "Invalid role." };
// 	}

// 	const target = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.id, id),
// 	});
// 	if (!target) return { success: false, message: "User not found." };

// 	if (target.role === "super-admin" && role !== "super-admin") {
// 		const remaining = await countActiveSuperAdmins(id);
// 		if (remaining === 0) {
// 			return {
// 				success: false,
// 				message: "You can't demote the last active Super Admin.",
// 			};
// 		}
// 	}

// 	await db
// 		.update(adminUsers)
// 		.set({ role: role as AdminRole })
// 		.where(eq(adminUsers.id, id));

// 	const adminSupabase = createAdminClient();
// 	await adminSupabase.auth.admin.updateUserById(id, {
// 		app_metadata: { adminRole: role },
// 	});

// 	return { success: true, message: "Role updated." };
// }



//@/lib/actions/admin/users.ts

"use server";

import { and, eq, ne, count } from "drizzle-orm";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { adminInvitations, adminUsers } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { AdminRole } from "@/lib/types/admin/role";
import type { InviteCreatedResult } from "@/lib/types/admin/auth";
import type { InviteUserFormState } from "@/lib/types/admin/users-roles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInviteRedirectBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        "https://jimodevelopment.com"
    );
}

export interface UserActionResult {
    success: boolean;
    message: string;
}

async function countActiveSuperAdmins(excludingId?: string): Promise<number> {
    const rows = await db
        .select({ total: count() })
        .from(adminUsers)
        .where(
            excludingId
                ? and(
                        eq(adminUsers.role, "super-admin"),
                        eq(adminUsers.status, "active"),
                        ne(adminUsers.id, excludingId),
                    )
                : and(
                        eq(adminUsers.role, "super-admin"),
                        eq(adminUsers.status, "active"),
                    ),
        );
    return rows[0]?.total ?? 0;
}

export async function inviteUser(
	data: InviteUserFormState,
): Promise<InviteCreatedResult> {
	const caller = await getAdminUser();
	if (!caller) return { success: false, message: "Not authenticated." };
	if (caller.role !== "super-admin") {
		return { success: false, message: "Only Super Admins can invite users." };
	}

	const email = data.email.trim().toLowerCase();
	if (!EMAIL_PATTERN.test(email)) {
		return { success: false, message: "Please enter a valid email address." };
	}

	const existingUser = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.email, email),
	});
	if (existingUser) {
		return {
			success: false,
			message: "A user with this email already exists.",
		};
	}

	const existingInvite = await db.query.adminInvitations.findFirst({
		where: and(
			eq(adminInvitations.email, email),
			eq(adminInvitations.status, "pending"),
		),
	});
	if (existingInvite) {
		return {
			success: true,
			message:
				"A pending invite already exists for this email. Check the Supabase dashboard to resend it.",
		};
	}

	const adminSupabase = createAdminClient();
	const redirectBaseUrl = getInviteRedirectBaseUrl();

	const { error: inviteError } =
		await adminSupabase.auth.admin.inviteUserByEmail(email, {
			redirectTo: `${redirectBaseUrl}/api/callback?next=/admin/auth/accept-invite`,
			data: { adminRole: data.role },
		});

	if (inviteError) {
		// Supabase returns a specific message when the email already belongs
		// to an existing Auth user (e.g. left over from a previous invite
		// that never completed signup, or created some other way). Surface
		// that plainly instead of a generic failure — it points the admin
		// at the actual fix (check Supabase Auth → Users directly).
		const alreadyRegistered = /already registered|already exists/i.test(
			inviteError.message,
		);
		return {
			success: false,
			message: alreadyRegistered
				? "This email is already registered in Supabase Auth but has no admin profile yet. Check Authentication → Users in the Supabase dashboard."
				: `Failed to send invite: ${inviteError.message}`,
		};
	}
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 1);

	await db.insert(adminInvitations).values({
		email,
		role: data.role,
		// token is nullable — Supabase owns the real invite token internally,
		// we only track the relationship for our own audit trail.
		token: null,
		status: "pending",
		invitedByUserId: caller.id,
		expiresAt,
	});

	return {
		success: true,
		message: `Invite sent to ${email} via Supabase. They will receive an email from your configured sender address.`,
	};
}

export async function deactivateUser(id: string): Promise<UserActionResult> {
	const caller = await getAdminUser();
	if (!caller) return { success: false, message: "Not authenticated." };
	if (caller.role !== "super-admin") {
		return {
			success: false,
			message: "Only Super Admins can deactivate users.",
		};
	}

	const target = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, id),
	});
	if (!target) return { success: false, message: "User not found." };

	if (target.role === "super-admin") {
		const remaining = await countActiveSuperAdmins(id);
		if (remaining === 0) {
			return {
				success: false,
				message: "You can't deactivate the last active Super Admin.",
			};
		}
	}

	await db
		.update(adminUsers)
		.set({ status: "inactive" })
		.where(eq(adminUsers.id, id));
	return { success: true, message: "User deactivated." };
}

export async function reactivateUser(id: string): Promise<UserActionResult> {
	const caller = await getAdminUser();
	if (!caller) return { success: false, message: "Not authenticated." };
	if (caller.role !== "super-admin") {
		return {
			success: false,
			message: "Only Super Admins can reactivate users.",
		};
	}

	await db
		.update(adminUsers)
		.set({ status: "active" })
		.where(eq(adminUsers.id, id));
	return { success: true, message: "User reactivated." };
}

export async function changeUserRole(
	id: string,
	role: string,
): Promise<UserActionResult> {
	const caller = await getAdminUser();
	if (!caller) return { success: false, message: "Not authenticated." };
	if (caller.role !== "super-admin") {
		return { success: false, message: "Only Super Admins can change roles." };
	}

	const validRoles: AdminRole[] = [
		"super-admin",
		"website-manager",
		"content-seo",
		"sales-crm",
		"marketing-admin",
	];
	if (!validRoles.includes(role as AdminRole)) {
		return { success: false, message: "Invalid role." };
	}

	const target = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, id),
	});
	if (!target) return { success: false, message: "User not found." };

	if (target.role === "super-admin" && role !== "super-admin") {
		const remaining = await countActiveSuperAdmins(id);
		if (remaining === 0) {
			return {
				success: false,
				message: "You can't demote the last active Super Admin.",
			};
		}
	}

	await db
		.update(adminUsers)
		.set({ role: role as AdminRole })
		.where(eq(adminUsers.id, id));

	const adminSupabase = createAdminClient();
	await adminSupabase.auth.admin.updateUserById(id, {
		app_metadata: { adminRole: role },
	});

	return { success: true, message: "Role updated." };
}