import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export const metadata: Metadata = {
	title: "Sign In | Jimo Command Centre",
};

interface LoginPageProps {
	searchParams: Promise<{
		redirectTo?: string;
		reason?: string;
		created?: string;
	}>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
	// Already signed in → go to dashboard
	const currentUser = await getAdminUser();
	if (currentUser) {
		redirect("/admin/dashboard");
	}

	const { redirectTo, reason, created } = await searchParams;

	return (
		<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
			<div className="w-full max-w-sm">
				{/* Logo */}
				<div className="mb-8 text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500">
						<span className="text-2xl font-bold text-navy-950">J</span>
					</div>
					<p className="mt-3 text-xl font-bold text-white">JIMO</p>
					<p className="text-xs text-white/50">Command Centre</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
					<h1 className="text-base font-bold text-white">Sign in</h1>
					<p className="mt-0.5 text-xs text-white/50">
						Enter your email and password to access the admin panel.
					</p>

					{reason === "inactivity" ? (
						<div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
							<p className="text-xs font-medium text-amber-300">
								You were signed out after 1 hour of inactivity.
							</p>
						</div>
					) : null}

					<div className="mt-5">
						<LoginForm
							redirectTo={redirectTo ?? "/admin/dashboard"}
							justCreated={created === "1"}
						/>
					</div>
				</div>

				<p className="mt-4 text-center text-xs text-white/30">
					Access is by invitation only. Contact your Super Admin.
				</p>
			</div>
		</div>
	);
}
