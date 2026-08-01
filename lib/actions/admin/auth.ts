// "use server";

// import { redirect } from "next/navigation";
// import { eq } from "drizzle-orm";
// import { createClient } from "@/lib/supabase/server";
// import { createAdminClient } from "@/lib/supabase/admin";
// import { db } from "@/lib/db";
// import { adminInvitations, adminUsers } from "@/lib/db/schema";
// import type { AdminRole } from "@/lib/types/admin/role";
// import type {
// 	AcceptInviteFormState,
// 	LoginFormState,
// } from "@/lib/types/admin/auth";

// const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// // ─── Login (unchanged from previous stage) ────────────────────────────────
// export async function loginAction(
// 	_prevState: LoginFormState,
// 	formData: FormData,
// ): Promise<LoginFormState> {
// 	const email = String(formData.get("email") ?? "").trim();
// 	const password = String(formData.get("password") ?? "").trim();
// 	const redirectTo = String(formData.get("redirectTo") ?? "").trim();

// 	if (!emailPattern.test(email) || password.length < 1) {
// 		return { status: "error", message: "Enter a valid email and password." };
// 	}

// 	const supabase = await createClient();
// 	const { error } = await supabase.auth.signInWithPassword({ email, password });

// 	if (error) {
// 		return {
// 			status: "error",
// 			message: "Invalid email or password. Please try again.",
// 		};
// 	}

// 	const safeRedirect =
// 		redirectTo.startsWith("/admin") && !redirectTo.startsWith("/admin/auth")
// 			? redirectTo
// 			: "/admin/dashboard";

// 	redirect(safeRedirect);
// }

// // ─── Logout (unchanged) ───────────────────────────────────────────────────
// export async function logoutAction(): Promise<void> {
// 	const supabase = await createClient();
// 	await supabase.auth.signOut();
// 	redirect("/admin/auth/login");
// }

// // ─── Accept Invite ─────────────────────────────────────────────────────────
// // At this point the user is already authenticated — the callback route
// // exchanged the Supabase invite code for a session before redirecting here.
// // This action only needs to: set a password + create the admin_users row.
// export async function acceptInviteAction(
// 	_prevState: AcceptInviteFormState,
// 	formData: FormData,
// ): Promise<AcceptInviteFormState> {
// 	const fullName = String(formData.get("fullName") ?? "").trim();
// 	const password = String(formData.get("password") ?? "").trim();
// 	const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

// 	// ── Validation ────────────────────────────────────────────────────────────
// 	if (fullName.length < 2) {
// 		return { status: "error", message: "Enter your full name." };
// 	}

// 	if (password.length < 8) {
// 		return {
// 			status: "error",
// 			message: "Password must be at least 8 characters.",
// 		};
// 	}

// 	if (password !== confirmPassword) {
// 		return { status: "error", message: "Passwords do not match." };
// 	}

// 	// ── Get the authenticated user (from the session the callback established) ─
// 	const supabase = await createClient();
// 	const {
// 		data: { user: authUser },
// 		error: userError,
// 	} = await supabase.auth.getUser();

// 	if (userError ?? !authUser) {
// 		return {
// 			status: "error",
// 			message: "Session expired. Please ask your admin to resend the invite.",
// 		};
// 	}

// 	// ── Check this user hasn't already completed signup ───────────────────────
// 	const existingRow = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.id, authUser.id),
// 	});

// 	if (existingRow) {
// 		redirect("/admin/dashboard");
// 	}

// 	// ── Role comes from user_metadata (set by inviteUserByEmail data param) ───
// 	const role = (authUser.user_metadata?.adminRole ?? "sales-crm") as AdminRole;

// 	// ── Set the password ──────────────────────────────────────────────────────
// 	const { error: updateError } = await supabase.auth.updateUser({ password });

// 	if (updateError) {
// 		return {
// 			status: "error",
// 			message: "Failed to set password. Please try again.",
// 		};
// 	}

// 	// ── Promote role from user_metadata → app_metadata ────────────────────────
// 	// Middleware reads app_metadata (JWT claim). user_metadata is editable by the
// 	// user; app_metadata requires the service role and is trusted by our middleware.
// 	const adminSupabase = createAdminClient();
// 	await adminSupabase.auth.admin.updateUserById(authUser.id, {
// 		app_metadata: { adminRole: role },
// 		// Also clear it from user_metadata so it doesn't stay editable
// 		user_metadata: { adminRole: null },
// 	});

// 	// ── Auto-generate username ────────────────────────────────────────────────
// 	const usernameBase = fullName
// 		.toLowerCase()
// 		.replace(/[^a-z0-9]/g, ".")
// 		.replace(/\.{2,}/g, ".")
// 		.replace(/^\.|\.$/g, "");
// 	const username = `${usernameBase}.${Math.random().toString(36).slice(2, 6)}`;

// 	// ── Find the invitation row for this email (for FK and audit trail) ───────
// 	const invitation = await db.query.adminInvitations.findFirst({
// 		where: eq(adminInvitations.email, authUser.email!),
// 	});

// 	// ── Insert admin_users row ────────────────────────────────────────────────
// 	await db.insert(adminUsers).values({
// 		id: authUser.id,
// 		fullName,
// 		username,
// 		email: authUser.email!,
// 		role,
// 		status: "active",
// 		invitedByUserId: invitation?.invitedByUserId ?? null,
// 	});

// 	// ── Mark invitation accepted ──────────────────────────────────────────────
// 	if (invitation) {
// 		await db
// 			.update(adminInvitations)
// 			.set({
// 				status: "accepted",
// 				acceptedByUserId: authUser.id,
// 				acceptedAt: new Date(),
// 			})
// 			.where(eq(adminInvitations.id, invitation.id));
// 	}

// 	redirect("/admin/dashboard");
// }

"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { adminInvitations, adminUsers } from "@/lib/db/schema";
import type { AdminRole } from "@/lib/types/admin/role";
import type {
	AcceptInviteFormState,
	LoginFormState,
} from "@/lib/types/admin/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Login (unchanged) ─────────────────────────────────────────────────────
export async function loginAction(
	_prevState: LoginFormState,
	formData: FormData,
): Promise<LoginFormState> {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "").trim();
	const redirectTo = String(formData.get("redirectTo") ?? "").trim();

	if (!emailPattern.test(email) || password.length < 1) {
		return { status: "error", message: "Enter a valid email and password." };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return {
			status: "error",
			message: "Invalid email or password. Please try again.",
		};
	}

	const safeRedirect =
		redirectTo.startsWith("/admin") && !redirectTo.startsWith("/admin/auth")
			? redirectTo
			: "/admin/dashboard";

	redirect(safeRedirect);
}

// ─── Logout (unchanged) ────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/admin/auth/login");
}

// ─── Accept Invite ─────────────────────────────────────────────────────────
export async function acceptInviteAction(
	_prevState: AcceptInviteFormState,
	formData: FormData,
): Promise<AcceptInviteFormState> {
	const fullName = String(formData.get("fullName") ?? "").trim();
	const password = String(formData.get("password") ?? "").trim();
	const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

	if (fullName.length < 2) {
		return { status: "error", message: "Enter your full name." };
	}
	if (password.length < 8) {
		return {
			status: "error",
			message: "Password must be at least 8 characters.",
		};
	}
	if (password !== confirmPassword) {
		return { status: "error", message: "Passwords do not match." };
	}

	const supabase = await createClient();
	const {
		data: { user: authUser },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !authUser) {
		return {
			status: "error",
			message: "Session expired. Please ask your admin to resend the invite.",
		};
	}

	// Kept as a defensive fallback — AcceptInvitePage already checks this
	// before rendering the form at all, so in practice this branch should
	// no longer be reachable, but costs nothing to leave in place.
	const existingRow = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, authUser.id),
	});
	if (existingRow) {
		redirect("/admin/dashboard");
	}

	// FIX: fetched and validated here, before anything is mutated — closes
	// the gap where AcceptInvitePage's own expiry check (at page-load time)
	// could pass, but the invite then expires in the time between the page
	// rendering and the person actually clicking submit.
	const invitation = await db.query.adminInvitations.findFirst({
		where: eq(adminInvitations.email, authUser.email!.toLowerCase()),
	});

	if (
		!invitation ||
		invitation.status !== "pending" ||
		invitation.expiresAt.getTime() < Date.now()
	) {
		return {
			status: "error",
			message:
				"This invite is no longer valid. Please ask your Super Admin to send a new one.",
		};
	}

	// FIX: role now comes from admin_invitations.role — set server-side by
	// inviteUser() and never exposed to the invitee — instead of
	// user_metadata.adminRole, which the signed-in user can edit themselves
	// via the client SDK before submitting this form. Trusting the
	// client-editable value would let someone self-escalate their role on
	// signup.
	const role: AdminRole = invitation.role;

	const { error: updateError } = await supabase.auth.updateUser({ password });
	if (updateError) {
		return {
			status: "error",
			message: "Failed to set password. Please try again.",
		};
	}

	try {
		const adminSupabase = createAdminClient();
		await adminSupabase.auth.admin.updateUserById(authUser.id, {
			app_metadata: { adminRole: role },
			// Cleared purely so it doesn't linger as stale, editable data —
			// it was never the source of truth for role assignment above.
			user_metadata: { adminRole: null },
		});

		const usernameBase = fullName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, ".")
			.replace(/\.{2,}/g, ".")
			.replace(/^\.|\.$/g, "");
		const username = `${usernameBase}.${Math.random().toString(36).slice(2, 6)}`;

		await db.insert(adminUsers).values({
			id: authUser.id,
			fullName,
			username,
			email: authUser.email!,
			role,
			status: "active",
			invitedByUserId: invitation.invitedByUserId,
		});

		await db
			.update(adminInvitations)
			.set({
				status: "accepted",
				acceptedByUserId: authUser.id,
				acceptedAt: new Date(),
			})
			.where(eq(adminInvitations.id, invitation.id));
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[acceptInviteAction]", message);
		return {
			status: "error",
			message:
				"Something went wrong finishing your account setup. Please try again or contact your Super Admin.",
		};
	}

	// FIX: sign out before redirecting to login — without this, the person
	// is still authenticated from the invite's session, and
	// AdminLoginPage's own "already signed in → dashboard" check would
	// silently skip the login form entirely, defeating the point of
	// sending them there.
	await supabase.auth.signOut();
	redirect("/admin/auth/login?created=1");
}