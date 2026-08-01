//@/lib/auth/require-module-access.ts
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { canAccessModule } from "@/lib/data/admin/roles";
import type { AdminModule } from "@/lib/types/admin/role";

/**
 * Proves not just "this is a signed-in admin" (getAdminUser alone) but
 * "this admin's role is actually permitted on THIS module" — closing the
 * gap where a hidden nav link doesn't stop someone reaching the page
 * directly by URL. Call this at the top of each protected module's
 * layout.tsx, passing that module's own name.
 */
export async function requireModuleAccess(module: AdminModule) {
	const adminUser = await getAdminUser();
	if (!adminUser) {
		redirect("/admin/auth/login");
	}
	if (!canAccessModule(adminUser.role, module)) {
		redirect("/admin/dashboard?error=forbidden_module");
	}
	return adminUser;
}
