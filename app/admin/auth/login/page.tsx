// //@app/admin/auth/login/page.tsx
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
        error?: string;
    }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
    const currentUser = await getAdminUser();
    if (currentUser) {
        redirect("/admin/dashboard");
    }

    const { redirectTo, reason, created, error } = await searchParams;

    const errorMessages: Record<string, string> = {
        invite_expired:
            "That invite link has expired. Ask your Super Admin to send a new one.",
        invite_not_found:
            "That invite link is no longer valid. Ask your Super Admin to send a new one.",
        access_denied:
            "That link was rejected by Supabase. It may have already been used.",
    };

    return (
			<div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
				<div className="w-full max-w-sm">
					{/* ...logo block unchanged... */}

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

						{reason === "password_reset" || reason === "password_changed" ? (
							<div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
								<p className="text-xs font-medium text-emerald-300">
									Your password has been updated. Sign in with your new
									password.
								</p>
							</div>
						) : null}

						{error ? (
							<div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3">
								<p className="text-xs font-medium text-red-300">
									{errorMessages[error] ??
										"Something went wrong with that link. Please try again."}
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