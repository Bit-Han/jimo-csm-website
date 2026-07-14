// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { and, eq, gt } from "drizzle-orm";
// import { AcceptInviteForm } from "@/components/admin/auth/AcceptInviteForm";
// import { db } from "@/lib/db";
// import { adminInvitations } from "@/lib/db/schema";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import type { AdminRole } from "@/lib/types/admin/role";

// export const metadata: Metadata = {
// 	title: "Accept Invite | Jimo Command Centre",
// };

// interface AcceptInvitePageProps {
// 	searchParams: Promise<{ token?: string }>;
// }

// export default async function AcceptInvitePage({
// 	searchParams,
// }: AcceptInvitePageProps) {
// 	const { token } = await searchParams;

// 	if (!token) {
// 		notFound();
// 	}

// 	// Validate the invitation server-side before rendering the form
// 	const invitation = await db.query.adminInvitations.findFirst({
// 		where: and(
// 			eq(adminInvitations.token, token),
// 			eq(adminInvitations.status, "pending"),
// 			gt(adminInvitations.expiresAt, new Date()),
// 		),
// 	});

// 	if (!invitation) {
// 		return (
// 			<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
// 				<div className="w-full max-w-sm rounded-2xl border border-red-400/30 bg-red-400/10 p-8 text-center">
// 					<p className="text-base font-bold text-red-300">
// 						Invite link invalid or expired
// 					</p>
// 					<p className="mt-2 text-xs text-white/50">
// 						This link may have already been used, or it expired after 7 days.
// 						Ask your Super Admin to send a new invite.
// 					</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	const roleLabel =
// 		adminRoleDefinitions.find((r) => r.id === (invitation.role as AdminRole))
// 			?.label ?? invitation.role;

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
// 			<div className="w-full max-w-sm">
// 				{/* Logo */}
// 				<div className="mb-8 text-center">
// 					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
// 						<span className="text-2xl font-bold text-navy-950">J</span>
// 					</div>
// 					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
// 					<p className="text-xs text-white/50">Command Centre</p>
// 				</div>

// 				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
// 					<h1 className="text-base font-bold text-white">
// 						Create your account
// 					</h1>
// 					<p className="mt-0.5 text-xs text-white/50">
// 						You have been invited to Jimo Command Centre. Complete your signup
// 						below.
// 					</p>

// 					<div className="mt-5">
// 						<AcceptInviteForm
// 							token={token}
// 							email={invitation.email}
// 							roleLabel={roleLabel}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AcceptInviteForm } from "@/components/admin/auth/AcceptInviteForm";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { createClient } from "@/lib/supabase/server";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { AdminRole } from "@/lib/types/admin/role";

export const metadata: Metadata = {
	title: "Create Account | Jimo Command Centre",
};

export default async function AcceptInvitePage() {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	// Not authenticated — the callback didn't run or expired
	if (!authUser) {
		redirect("/admin/auth/login?error=invite_expired");
	}

	// Already completed signup — go to dashboard
	const existingAdmin = await db.query.adminUsers.findFirst({
		where: eq(adminUsers.id, authUser.id),
	});

	if (existingAdmin) {
		redirect("/admin/dashboard");
	}

	// Role stored in user_metadata by inviteUserByEmail
	const role = (authUser.user_metadata?.adminRole ?? "sales-crm") as AdminRole;
	const roleLabel =
		adminRoleDefinitions.find((r) => r.id === role)?.label ?? role;

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
					<h1 className="text-base font-bold text-white">
						Complete your account
					</h1>
					<p className="mt-0.5 text-xs text-white/50">
						Welcome to Jimo Command Centre. Enter your name and set a password
						to get started.
					</p>

					<div className="mt-5">
						<AcceptInviteForm email={authUser.email!} roleLabel={roleLabel} />
					</div>
				</div>
			</div>
		</div>
	);
}