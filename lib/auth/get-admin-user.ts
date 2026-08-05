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
	role: AdminRole;
}

export const getAdminUser = cache(
	async (): Promise<AuthenticatedAdminUser | null> => {
		console.info("[admin:getAdminUser] Checking authenticated admin user");
		const supabase = await createClient();

		const {
			data: { user: authUser },
		} = await supabase.auth.getUser();
		console.info(
			`[admin:getAdminUser] ${authUser ? "Supabase user resolved" : "No Supabase user found"}`,
		);

		if (!authUser) return null;

		const adminUser = await db.query.adminUsers.findFirst({ 
			where: eq(adminUsers.id, authUser.id) 
		});
		console.info(
			`[admin:getAdminUser] ${adminUser ? `Loaded admin user ${adminUser.id}` : `No admin row found for auth user ${authUser.id}`}`,
		);

		if (!adminUser) return null;

		// FIX: a deactivated admin previously kept full access as long as
		// their Supabase session was valid — this status field did nothing.
		// Treating an inactive row exactly like "no admin found" is what
		// actually revokes access, everywhere getAdminUser() is checked.
		if (adminUser.status !== "active") return null;

		const validRole =
			adminUser.role in roleModuleAccess
				? adminUser.role
				: ("sales-crm" as const);
		console.info(`[admin:getAdminUser] Authenticated admin user ready: ${adminUser.id}`);

		return { ...adminUser, role: validRole } as AuthenticatedAdminUser;
	},
);
