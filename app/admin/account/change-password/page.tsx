import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { ChangePasswordForm } from "@/components/admin/account/ChangePasswordForm";

export const metadata: Metadata = {
	title: "Change Password | Jimo Command Centre",
};

export default async function ChangePasswordPage() {
	const adminUser = await getAdminUser();
	if (!adminUser) {
		redirect("/admin/auth/login");
	}

	return (
		<div className="mx-auto max-w-md space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-ink-950">
					Change Password
				</h1>
				<p className="mt-1 text-sm text-stone-500">
					Confirm your current password, then choose a new one.
				</p>
			</div>
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<ChangePasswordForm />
			</div>
		</div>
	);
}
