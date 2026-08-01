

// //@lib/auth/get-admin-user.ts

// import { cache } from "react";
// import { eq } from "drizzle-orm";
// import { createClient } from "@/lib/supabase/server";
// import { db } from "@/lib/db";
// import { adminUsers } from "@/lib/db/schema";
// import type { AdminUserRow } from "@/lib/db/schema/users";
// import type { AdminRole } from "@/lib/types/admin/role";
// import { roleModuleAccess } from "@/lib/data/admin/roles";
// import { withQueryTimeout } from "@/lib/utils/with-query-time";

// export interface AuthenticatedAdminUser extends AdminUserRow {
// 	role: AdminRole;
// }

// export const getAdminUser = cache(
// 	async (): Promise<AuthenticatedAdminUser | null> => {
// 		const supabase = await createClient();

// 		const {
// 			data: { user: authUser },
// 		} = await withQueryTimeout(supabase.auth.getUser(), 10000);

// 		if (!authUser) return null;

// 		const adminUser = await withQueryTimeout(
// 			db.query.adminUsers.findFirst({ where: eq(adminUsers.id, authUser.id) }),
// 		);

// 		if (!adminUser) return null;

// 		// FIX: a deactivated admin previously kept full access as long as
// 		// their Supabase session was valid — this status field did nothing.
// 		// Treating an inactive row exactly like "no admin found" is what
// 		// actually revokes access, everywhere getAdminUser() is checked.
// 		if (adminUser.status !== "active") return null;

// 		const validRole =
// 			adminUser.role in roleModuleAccess
// 				? adminUser.role
// 				: ("sales-crm" as const);

// 		return { ...adminUser, role: validRole } as AuthenticatedAdminUser;
// 	},
// );


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
		const supabase = await createClient();

		const {
			data: { user: authUser },
		} = await supabase.auth.getUser();

		if (!authUser) return null;

		const adminUser = await db.query.adminUsers.findFirst({ 
			where: eq(adminUsers.id, authUser.id) 
		});

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

		return { ...adminUser, role: validRole } as AuthenticatedAdminUser;
	},
);
