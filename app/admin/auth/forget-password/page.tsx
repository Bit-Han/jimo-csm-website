import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/admin/auth/ForgetPasswordForm";

export const metadata: Metadata = {
	title: "Reset Password | Jimo Command Centre",
};

export default function ForgotPasswordPage() {
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
						Reset your password
					</h1>
					<p className="mt-0.5 text-xs text-white/50">
						Enter your admin email and we&apos;ll send you a link to set a new
						password.
					</p>
					<div className="mt-5">
						<ForgotPasswordForm />
					</div>
				</div>

				<p className="mt-4 text-center text-xs text-white/30">
					<Link
						href="/admin/auth/login"
						className="text-white/50 hover:text-white/80"
					>
						Back to sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
