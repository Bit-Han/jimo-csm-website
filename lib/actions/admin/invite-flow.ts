// // lib/actions/admin/invite-flow.ts
// "use server";

// import { and, eq, lt, sql } from "drizzle-orm";
// import { createClient } from "@/lib/supabase/server";
// import { db } from "@/lib/db";
// import { adminInvitations, adminUsers } from "@/lib/db/schema";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import type { AdminRole } from "@/lib/types/admin/role";

// export interface VerifyInviteResult {
// 	success: boolean;
// 	email?: string;
// 	roleLabel?: string;
// 	errorRedirect?: string;
// }

// export async function verifyInviteCode(code: string): Promise<VerifyInviteResult> {
// 	const supabase = await createClient();

// 	// If a session already exists (e.g. the effect re-ran, or the page was
// 	// reloaded moments after a successful exchange), reuse it instead of
// 	// re-exchanging — exchangeCodeForSession only ever succeeds once per code.
// 	let {
// 		data: { user: authUser },
// 	} = await supabase.auth.getUser();

// 	if (!authUser) {
// 		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
// 		if (error || !data.user) {
// 			return {
// 				success: false,
// 				errorRedirect: "/admin/auth/login?error=invite_expired",
// 			};
// 		}
// 		authUser = data.user;
// 	}

// 	const existingAdmin = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.id, authUser.id),
// 	});
// 	if (existingAdmin) {
// 		await supabase.auth.signOut();
// 		return { success: false, errorRedirect: "/admin/auth/login" };
// 	}

// 	const email = authUser.email!.toLowerCase();
// 	const invitation = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.email, email),
// 			eq(adminInvitations.status, "pending"),
// 		),
// 	});

// 	if (!invitation) {
// 		await supabase.auth.signOut();
// 		return {
// 			success: false,
// 			errorRedirect: "/admin/auth/login?error=invite_not_found",
// 		};
// 	}

// 	const expired = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.id, invitation.id),
// 			lt(adminInvitations.expiresAt, sql`now()`),
// 		),
// 	});

// 	if (expired) {
// 		await db
// 			.update(adminInvitations)
// 			.set({ status: "expired" })
// 			.where(eq(adminInvitations.id, expired.id));
// 		await supabase.auth.signOut();
// 		return {
// 			success: false,
// 			errorRedirect: "/admin/auth/login?error=invite_expired",
// 		};
// 	}

// 	const role = (authUser.user_metadata?.adminRole ??
// 		invitation.role ??
// 		"sales-crm") as AdminRole;
// 	const roleLabel = adminRoleDefinitions.find((r) => r.id === role)?.label ?? role;

// 	return { success: true, email, roleLabel };
// }

// export interface CompleteInviteSignupResult {
// 	success: boolean;
// 	message: string;
// }

// const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}\s'-]{1,99}$/u;

// export async function completeInviteSignup(input: {
// 	fullName: string;
// 	password: string;
// 	confirmPassword: string;
// }): Promise<CompleteInviteSignupResult> {
// 	const supabase = await createClient();
// 	const {
// 		data: { user: authUser },
// 	} = await supabase.auth.getUser();

// 	if (!authUser) {
// 		return {
// 			success: false,
// 			message: "Your session has expired. Please use your invite link again.",
// 		};
// 	}

// 	const fullName = input.fullName.trim();
// 	if (fullName.length < 2 || !NAME_PATTERN.test(fullName)) {
// 		return { success: false, message: "Please enter a valid full name." };
// 	}
// 	if (input.password.length < 8) {
// 		return { success: false, message: "Password must be at least 8 characters." };
// 	}
// 	if (input.password !== input.confirmPassword) {
// 		return { success: false, message: "Passwords do not match." };
// 	}

// 	const email = authUser.email!.toLowerCase();
// 	const invitation = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.email, email),
// 			eq(adminInvitations.status, "pending"),
// 		),
// 	});

// 	if (!invitation) {
// 		await supabase.auth.signOut();
// 		return {
// 			success: false,
// 			message: "This invite is no longer valid. Please ask your Super Admin for a new one.",
// 		};
// 	}

// 	const { error: passwordError } = await supabase.auth.updateUser({
// 		password: input.password,
// 	});
// 	if (passwordError) {
// 		return { success: false, message: `Could not set password: ${passwordError.message}` };
// 	}

// function generateUsername(fullName: string, email: string): string {
// 	const base = fullName
// 		.toLowerCase()
// 		.replace(/[^a-z0-9\s]/g, "")
// 		.trim()
// 		.split(/\s+/)
// 		.join(".");
// 	return base || email.split("@")[0]!;
// }

// // ...

// const baseUsername = generateUsername(fullName, email);
// let username = baseUsername;
// let suffix = 1;
// while (
// 	await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.username, username),
// 	})
// ) {
// 	username = `${baseUsername}${suffix}`;
// 	suffix += 1;
// }

// 	// Role comes ONLY from our own invitation record, resolved entirely
// 	// server-side — the client never sends a role, so there is no field
// 	// for a tampered request to influence. This is what actually enforces
// 	// "only a Super Admin can assign or change roles."
// 	await db.insert(adminUsers).values({
// 		id: authUser.id,
// 		email,
// 		fullName,
//         username,
// 		role: invitation.role,
// 		status: "active",
// 	});

// 	await db
// 		.update(adminInvitations)
// 		.set({ status: "accepted" })
// 		.where(eq(adminInvitations.id, invitation.id));

// 	// Cuts the session immediately after account creation, exactly as
// 	// requested — the new admin signs in fresh with their new password,
// 	// identical to every other admin's normal login.
// 	await supabase.auth.signOut();

// 	return { success: true, message: "Account created." };
// }



// lib/actions/admin/invite-flow.ts — full file, replaces the previous version
"use server";

import { and, eq, lt, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminInvitations, adminUsers } from "@/lib/db/schema";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";

export interface VerifyInviteResult {
	success: boolean;
	email?: string;
	roleLabel?: string;
	errorRedirect?: string;
}

/**
 * Exchanges the invite `code` for a session (the one step that MUST run
 * in a Server Action or Route Handler — a plain page.tsx Server Component
 * cannot set cookies, so it cannot persist the resulting session). Then
 * checks the invitation is real, pending, and unexpired, purely so the
 * person sees a clear "this link is no longer valid" message immediately
 * instead of filling out the whole form first. acceptInviteAction
 * re-validates all of this independently at submit time — this function
 * is a UX convenience, not the security boundary.
 */
export async function verifyInviteCode(code: string): Promise<VerifyInviteResult> {
	const supabase = await createClient();

	let {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (error || !data.user) {
			return {
				success: false,
				errorRedirect: "/admin/auth/login?error=invite_expired",
			};
		}
		authUser = data.user;
	}

	const existingAdmin = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, authUser.id),
	});
	if (existingAdmin) {
		await supabase.auth.signOut();
		return { success: false, errorRedirect: "/admin/auth/login" };
	}

	const email = authUser.email!.toLowerCase();
	const invitation = await db.query.adminInvitations.findFirst({
		where: and(
			eq(adminInvitations.email, email),
			eq(adminInvitations.status, "pending"),
		),
	});

	if (!invitation) {
		await supabase.auth.signOut();
		return {
			success: false,
			errorRedirect: "/admin/auth/login?error=invite_not_found",
		};
	}

	const expired = await db.query.adminInvitations.findFirst({
		where: and(
			eq(adminInvitations.id, invitation.id),
			lt(adminInvitations.expiresAt, sql`now()`),
		),
	});

	if (expired) {
		await db
			.update(adminInvitations)
			.set({ status: "expired" })
			.where(eq(adminInvitations.id, expired.id));
		await supabase.auth.signOut();
		return {
			success: false,
			errorRedirect: "/admin/auth/login?error=invite_expired",
		};
	}

	// Sourced from admin_invitations.role — the same server-controlled
	// value acceptInviteAction uses for the real grant. Deliberately NOT
	// read from authUser.user_metadata.adminRole, which the signed-in
	// client SDK can edit — showing a label built from that could display
	// a tampered role even though the actual insert on submit ignores it.
	const roleLabel =
		adminRoleDefinitions.find((r) => r.id === invitation.role)?.label ??
		invitation.role;

	return { success: true, email, roleLabel };
}