"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { isStrongPassword } from "@/lib/utils/password";

export interface ChangePasswordFormState {
	status: "idle" | "error";
	message: string;
}

export async function changePasswordAction(
	_prevState: ChangePasswordFormState,
	formData: FormData,
): Promise<ChangePasswordFormState> {
	const adminUser = await getAdminUser();
	if (!adminUser) {
		return {
			status: "error",
			message: "Your session has expired. Please sign in again.",
		};
	}

	const currentPassword = String(formData.get("currentPassword") ?? "").trim();
	const newPassword = String(formData.get("newPassword") ?? "").trim();
	const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

	if (!currentPassword) {
		return { status: "error", message: "Enter your current password." };
	}
	if (newPassword.length > 72) {
		return { status: "error", message: "New password is too long." };
	}
	if (!isStrongPassword(newPassword)) {
		return {
			status: "error",
			message:
				"New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
		};
	}
	if (newPassword !== confirmPassword) {
		return { status: "error", message: "New passwords do not match." };
	}
	if (newPassword === currentPassword) {
		return {
			status: "error",
			message: "New password must be different from your current password.",
		};
	}

	const supabase = await createClient();

	// Re-authenticating against the CURRENT password is what actually
	// enforces "you must know the old password to set a new one." An
	// active session alone — e.g. a laptop left unlocked — is not proof
	// of that; updateUser() would otherwise accept a new password from
	// anyone holding the session, not just the account owner.
	// signInWithPassword re-validates the credential and refreshes the
	// existing session on success; it doesn't sign anyone out on its own.
	const { error: reauthError } = await supabase.auth.signInWithPassword({
		email: adminUser.email,
		password: currentPassword,
	});
	if (reauthError) {
		return { status: "error", message: "Current password is incorrect." };
	}

	const { error: updateError } = await supabase.auth.updateUser({
		password: newPassword,
	});
	if (updateError) {
		return {
			status: "error",
			message: "Failed to update password. Please try again.",
		};
	}

	// Sign out and force a fresh login with the new password — this also
	// invalidates any other active sessions for this account, the right
	// default after a password change.
	await supabase.auth.signOut();
	redirect("/admin/auth/login?reason=password_changed");
}
