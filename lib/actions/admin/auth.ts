//@/lib/actions/admin/auth.ts
"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { adminInvitations, adminUsers } from "@/lib/db/schema";
import type { AdminRole } from "@/lib/types/admin/role";
import { isStrongPassword } from "@/lib/utils/password";
import type {
	AcceptInviteFormState,
	ForgotPasswordFormState,
	LoginFormState,
	ResetPasswordFormState,
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

	const nameParts = fullName.split(/\s+/).filter(Boolean);
	if (nameParts.length < 2 || nameParts.some((part) => part.length < 2)) {
		return { status: "error", message: "Enter your first name and surname." };
	}
	if (password.length > 72) {
		return { status: "error", message: "Password is too long." };
	}
	if (!isStrongPassword(password)) {
		return {
			status: "error",
			message:
				"Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
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



// ─── Forgot Password ────────────────────────────────────────────────────────
export async function forgotPasswordAction(
	_prevState: ForgotPasswordFormState,
	formData: FormData,
): Promise<ForgotPasswordFormState> {
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();

	if (!emailPattern.test(email)) {
		return { status: "error", message: "Enter a valid email address." };
	}

	const supabase = await createClient();
	await supabase.auth.resetPasswordForEmail(email);

	// Always the same response whether or not this email belongs to an
	// admin — confirming or denying existence here would let anyone probe
	// which emails have admin accounts. Supabase's own call follows the
	// same rule: it never reveals whether the address matched a user.
	return {
		status: "success",
		message:
			"If that email belongs to an admin account, a reset link is on its way. Check your inbox.",
	};
}

// ─── Reset Password (after clicking the emailed recovery link) ─────────────
export async function resetPasswordAction(
	_prevState: ResetPasswordFormState,
	formData: FormData,
): Promise<ResetPasswordFormState> {
	const password = String(formData.get("password") ?? "").trim();
	const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

	if (password.length > 72) {
		return { status: "error", message: "Password is too long." };
	}
	if (!isStrongPassword(password)) {
		return {
			status: "error",
			message:
				"Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
		};
	}
	if (password !== confirmPassword) {
		return { status: "error", message: "Passwords do not match." };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return {
			status: "error",
			message: "Your reset link has expired. Please request a new one.",
		};
	}

	const { error } = await supabase.auth.updateUser({ password });
	if (error) {
		return {
			status: "error",
			message: "Failed to update password. Please try again.",
		};
	}

	// Force a clean re-login with the new password — matches the invite
	// flow's own sign-out-after-set-password pattern, and this also
	// invalidates any other lingering sessions for this account.
	await supabase.auth.signOut();
	redirect("/admin/auth/login?reason=password_reset");
}
