


//@lib/auth/get-admin-user.ts
import { cache } from "react";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import type { AdminUserRow } from "@/lib/db/schema/users";
import type { AdminRole } from "@/lib/types/admin/role";
import { roleModuleAccess } from "@/lib/data/admin/roles";
import { withTimeout } from "@/lib/integrations/cloudinary"; // 1. Added import

export interface AuthenticatedAdminUser extends AdminUserRow {
	role: AdminRole;
}

export const getAdminUser = cache(
	async (): Promise<AuthenticatedAdminUser | null> => {
		const supabase = await createClient();
		
		// 2. Wrapped the Supabase auth call with withTimeout
		const {
			data: { user: authUser },
		} = await withTimeout(
			supabase.auth.getUser(),
			8000,
			"Supabase getUser",
		);

		if (!authUser) return null;

		const adminUser = await db.query.adminUsers.findFirst({
			where: eq(adminUsers.id, authUser.id),
		});

		if (!adminUser) return null;

		const validRole =
			adminUser.role in roleModuleAccess
				? adminUser.role
				: ("sales-crm" as const);

		return { ...adminUser, role: validRole } as AuthenticatedAdminUser;
	},
);
