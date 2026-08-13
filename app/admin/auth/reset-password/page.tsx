import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/admin/auth/ResetPasswordForm";

export const metadata: Metadata = {
	title: "Set New Password | Jimo Command Centre",
};

export default async function ResetPasswordPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// No session means the recovery link was never verified, or already
	// used — /admin/auth/confirm is what establishes this session, and it
	// only reaches here after a successful verifyOtp for type=recovery.
	if (!user) {
		redirect("/admin/auth/login?error=access_denied");
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
					<h1 className="text-base font-bold text-white">Set a new password</h1>
					<p className="mt-0.5 text-xs text-white/50">
						Choose a new password for {user.email}.
					</p>
					<div className="mt-5">
						<ResetPasswordForm />
					</div>
				</div>
			</div>
		</div>
	);
}
