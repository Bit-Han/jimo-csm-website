
// app/admin/(dashboard)/users-roles/layout.tsx
import type { ReactNode } from "react";
import { requireModuleAccess } from "@/lib/auth/require-module-access";

export default async function UsersRolesModuleLayout({ children }: { children: ReactNode }) {
	await requireModuleAccess("users-roles");
	return <>{children}</>;
}