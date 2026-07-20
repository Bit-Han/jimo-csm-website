"use server";

import { and, eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { adminInvitations, adminUsers } from "@/lib/db/schema";
import type { AdminRole } from "@/lib/types/admin/role";
import type { InviteCreatedResult } from "@/lib/types/admin/auth";
import type { InviteUserFormState } from "@/lib/types/admin/users-roles";

export async function inviteUser(
	data: InviteUserFormState,
): Promise<InviteCreatedResult> {
	// ── Auth check ────────────────────────────────────────────────────────────
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) {
		return { success: false, message: "Not authenticated." };
	}

	const callerRole = authUser.app_metadata?.adminRole as AdminRole | undefined;
	if (callerRole !== "super-admin") {
		return { success: false, message: "Only Super Admins can invite users." };
	}

	const callerAdminUser = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, authUser.id),
	});

	if (!callerAdminUser) {
		return { success: false, message: "Your admin profile was not found." };
	}

	// ── Prevent duplicates ────────────────────────────────────────────────────
	const existingUser = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.email, data.email),
	});

	if (existingUser) {
		return {
			success: false,
			message: "A user with this email already exists.",
		};
	}

	// ── Check for active pending invite ───────────────────────────────────────
	const existingInvite = await db.query.adminInvitations.findFirst({
		where: and(
			eq(adminInvitations.email, data.email),
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

	// ── Send invite via Supabase ──────────────────────────────────────────────
	// Supabase sends the customized email (template set in Dashboard →
	// Authentication → Email Templates → Invite User).
	// The role is passed in `data` so it appears in user_metadata on the
	// new auth user — our acceptInviteAction reads it from there.
	const adminSupabase = createAdminClient();

	const { error: inviteError } =
		await adminSupabase.auth.admin.inviteUserByEmail(data.email, {
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/admin/auth/accept-invite`,
			data: {
				adminRole: data.role,
			},
		});

	if (inviteError) {
		return {
			success: false,
			message: `Failed to send invite: ${inviteError.message}`,
		};
	}

	// ── Record in our table for tracking / audit trail ────────────────────────
	// We don't store a token (Supabase owns that) — we store the relationship.
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);

	await db.insert(adminInvitations).values({
		email: data.email,
		role: data.role,
		// Token column is required in schema — store a placeholder since
		// Supabase manages the real token internally.
		// TODO: make token nullable in the schema during the next migration,
		// or keep it as a descriptive sentinel value.
		token: `supabase-managed-${crypto.randomUUID()}`,
		status: "pending",
		invitedByUserId: callerAdminUser.id,
		expiresAt,
	});

	return {
		success: true,
		message: `Invite sent to ${data.email} via Supabase. They will receive an email from your configured Supabase sender address.`,
	};
}

// ─── The rest stay the same ───────────────────────────────────────────────
export async function deactivateUser(id: string) {
	await db
		.update(adminUsers)
		.set({ status: "inactive" })
		.where(eq(adminUsers.id, id));
	return { success: true, message: "User deactivated." };
}

export async function reactivateUser(id: string) {
	await db
		.update(adminUsers)
		.set({ status: "active" })
		.where(eq(adminUsers.id, id));
	return { success: true, message: "User reactivated." };
}

export async function changeUserRole(id: string, role: string) {
	await db
		.update(adminUsers)
		.set({ role: role as AdminRole })
		.where(eq(adminUsers.id, id));

	const { createAdminClient } = await import("@/lib/supabase/admin");
	const adminSupabase = createAdminClient();
	await adminSupabase.auth.admin.updateUserById(id, {
		app_metadata: { adminRole: role },
	});

	return { success: true, message: "Role updated." };
}
