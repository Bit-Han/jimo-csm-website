//@lib/auth/get-admin-user.ts
import { cache } from "react";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import type { AdminUserRow } from "@/lib/db/schema/users";
import type { AdminRole } from "@/lib/types/admin/role";
import { roleModuleAccess } from "@/lib/data/admin/roles";

export interface AuthenticatedAdminUser extends AdminUserRow {
	// Guaranteed non-null for authenticated users
	role: AdminRole;
}

// cache() deduplicates this call within a single render pass —
// layout.tsx and nested server components all get the same result.
export const getAdminUser = cache(
	async (): Promise<AuthenticatedAdminUser | null> => {
		const supabase = await createClient();
		const {
			data: { user: authUser },
		} = await supabase.auth.getUser();

		if (!authUser) return null;

		const adminUser = await db.query.adminUsers.findFirst({
			where: eq(adminUsers.id, authUser.id),
		});

		if (!adminUser) return null;

		// Guard: if the role stored in admin_users isn't in our enum,
		// fall back to the most restricted role so access doesn't crash.
		const validRole =
			adminUser.role in roleModuleAccess
				? adminUser.role
				: ("sales-crm" as const);

		return { ...adminUser, role: validRole } as AuthenticatedAdminUser;
	},
);
