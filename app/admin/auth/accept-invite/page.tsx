// // //@app/admin/auth/accept-invite/page.tsx
// import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { and, eq, lt, sql } from "drizzle-orm";
// import { AcceptInviteForm } from "@/components/admin/auth/AcceptInviteForm";
// import { createClient } from "@/lib/supabase/server";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import { db } from "@/lib/db";
// import { adminInvitations, adminUsers } from "@/lib/db/schema";
// import type { AdminRole } from "@/lib/types/admin/role";

// export const metadata: Metadata = {
// 	title: "Create Account | Jimo Command Centre",
// };

// export default async function AcceptInvitePage() {
// 	const supabase = await createClient();
// 	const {
// 		data: { user: authUser },
// 	} = await supabase.auth.getUser();

// 	if (!authUser) {
// 		redirect("/admin/auth/login?error=invite_expired");
// 	}

// 	const existingAdmin = await db.query.adminUsers.findFirst({
// 		where: eq(adminUsers.id, authUser.id),
// 	});
// 	if (existingAdmin) {
// 		redirect("/admin/dashboard");
// 	}

// 	// NEW: our own enforcement of the 1-day window, independent of (but
// 	// matched to) Supabase's own OTP expiry. This is what lets us show a
// 	// clear, specific message instead of Supabase's generic auth error —
// 	// and what actually marks the invitation "expired" in our own records
// 	// so the Users & Roles list reflects reality.
// 	const email = authUser.email!.toLowerCase();
// 	const invitation = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.email, email),
// 			eq(adminInvitations.status, "pending"),
// 		),
// 	});

// 	if (!invitation) {
// 		// Authenticated via a real Supabase session, but no matching
// 		// pending invite on our side — a stale or already-used link.
// 		// Never let signup proceed silently in this state.
// 		redirect("/admin/auth/login?error=invite_not_found");
// 	}

// 	const expiredInvitation = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.id, invitation.id),
// 			lt(adminInvitations.expiresAt, sql`now()`),
// 		),
// 	});

// 	if (expiredInvitation) {
// 		await db
// 			.update(adminInvitations)
// 			.set({ status: "expired" })
// 			.where(eq(adminInvitations.id, expiredInvitation.id));
// 		redirect("/admin/auth/login?error=invite_expired");
// 	}

// 	const role = (authUser.user_metadata?.adminRole ??
// 		invitation.role ??
// 		"sales-crm") as AdminRole;
// 	const roleLabel =
// 		adminRoleDefinitions.find((r) => r.id === role)?.label ?? role;

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
// 			<div className="w-full max-w-sm">
// 				<div className="mb-8 text-center">
// 					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
// 						<span className="text-2xl font-bold text-navy-950">J</span>
// 					</div>
// 					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
// 					<p className="text-xs text-white/50">Command Centre</p>
// 				</div>

// 				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
// 					<h1 className="text-base font-bold text-white">
// 						Complete your account
// 					</h1>
// 					<p className="mt-0.5 text-xs text-white/50">
// 						Welcome to Jimo Command Centre. Enter your name and set a password
// 						to get started.
// 					</p>
// 					<div className="mt-5">
// 						<AcceptInviteForm email={authUser.email!} roleLabel={roleLabel} />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


// // app/admin/auth/accept-invite/page.tsx
// import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { AcceptInviteFlow } from "@/components/admin/auth/AcceptInviteFlow";

// export const metadata: Metadata = {
// 	title: "Create Account | Jimo Command Centre",
// };

// interface AcceptInvitePageProps {
// 	searchParams: Promise<{ code?: string }>;
// }

// export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
// 	const { code } = await searchParams;

// 	if (!code) {
// 		redirect("/admin/auth/login?error=invite_not_found");
// 	}

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
// 			<div className="w-full max-w-sm">
// 				<div className="mb-8 text-center">
// 					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
// 						<span className="text-2xl font-bold text-navy-950">J</span>
// 					</div>
// 					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
// 					<p className="text-xs text-white/50">Command Centre</p>
// 				</div>

// 				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
// 					<h1 className="text-base font-bold text-white">Complete your account</h1>
// 					<p className="mt-0.5 text-xs text-white/50">
// 						Welcome to Jimo Command Centre. Enter your name and set a password
// 						to get started.
// 					</p>
// 					<div className="mt-5">
// 						<AcceptInviteFlow code={code} />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }



// // app/admin/auth/accept-invite/page.tsx
// import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { AcceptInviteFlow } from "@/components/admin/auth/AcceptInviteFlow";

// export const metadata: Metadata = {
// 	title: "Create Account | Jimo Command Centre",
// };

// interface AcceptInvitePageProps {
// 	searchParams: Promise<{ code?: string }>;
// }

// export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
// 	const { code } = await searchParams;

// 	if (!code) {
// 		redirect("/admin/auth/login?error=invite_not_found");
// 	}

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
// 			<div className="w-full max-w-sm">
// 				<div className="mb-8 text-center">
// 					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
// 						<span className="text-2xl font-bold text-navy-950">J</span>
// 					</div>
// 					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
// 					<p className="text-xs text-white/50">Command Centre</p>
// 				</div>

// 				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
// 					<h1 className="text-base font-bold text-white">Complete your account</h1>
// 					<p className="mt-0.5 text-xs text-white/50">
// 						Welcome to Jimo Command Centre. Enter your name and set a password
// 						to get started.
// 					</p>
// 					<div className="mt-5">
// 						<AcceptInviteFlow code={code} />
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


// app/admin/auth/accept-invite/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolvePendingInvite } from "@/lib/actions/admin/invite-flow";
import { AcceptInviteForm } from "@/components/admin/auth/AcceptInviteForm";

export const metadata: Metadata = {
	title: "Create Account | Jimo Command Centre",
};

export default async function AcceptInvitePage() {
	const result = await resolvePendingInvite();

	if (!result.success || !result.email || !result.roleLabel) {
		redirect(result.errorRedirect ?? "/admin/auth/login?error=invite_not_found");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
						<span className="text-2xl font-bold text-navy-950">J</span>
					</div>
					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
					<p className="text-xs text-white/50">Command Centre</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h1 className="text-base font-bold text-white">Complete your account</h1>
					<p className="mt-0.5 text-xs text-white/50">
						Welcome to Jimo Command Centre. Enter your name and set a password
						to get started.
					</p>
					<div className="mt-5">
						<AcceptInviteForm email={result.email} roleLabel={result.roleLabel} />
					</div>
				</div>
			</div>
		</div>
	);
}