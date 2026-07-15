import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const currentUser = await getAdminUser();

	// Middleware already redirects unauthenticated users — this is a safety net
	if (!currentUser) {
		redirect("/admin/auth/login");
	}

	return <AdminShell currentUser={currentUser}>{children}</AdminShell>;
}