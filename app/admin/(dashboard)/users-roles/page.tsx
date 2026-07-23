import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RoleSummaryCards } from "@/components/admin/users/RoleSummaryCards";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { PermissionMatrixTable } from "@/components/admin/users/PermissionMatrixTable";
import { UsersPageActions } from "@/components/admin/users/UsersPageActions";
import {
	mockPermissionMatrix,
	mockRoleSummaryCards,
} from "@/lib/data/admin/users";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import type { AdminRole } from "@/lib/types/admin/role";
import type { AdminUserListRow } from "@/lib/types/admin/users-roles";

export const metadata: Metadata = {
	title: "Users & Roles | Jimo Command Centre",
};

export const dynamic = 'force-dynamic';

export default async function AdminUsersRolesPage() {
	// Read real admin users from DB
	const dbUsers = await db
		.select()
		.from(adminUsers)
		.orderBy(asc(adminUsers.createdAt));

	const users: AdminUserListRow[] = dbUsers.map((u) => {
		const roleLabel =
			adminRoleDefinitions.find((r) => r.id === u.role)?.label ?? u.role;

		const permissionSummaryMap: Partial<Record<AdminRole, string>> = {
			"super-admin": "All modules",
			"website-manager": "Projects, Pages, Media",
			"content-seo": "Content, SEO Centre",
			"sales-crm": "Leads, Enquiries",
			"marketing-admin": "Campaigns, Assets",
		};

		return {
			id: u.id,
			fullName: u.fullName,
			email: u.email,
			role: u.role as AdminRole,
			roleLabel,
			status: u.status as "active" | "inactive",
			permissionSummary:
				permissionSummaryMap[u.role as AdminRole] ?? "Limited access",
			lastActive: u.lastActiveAt
				? u.lastActiveAt.toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric",
					})
				: "Never",
		};
	});

	// Role summary counts from real data
	const realRoleCards = mockRoleSummaryCards.map((card) => ({
		...card,
		count: users.filter((u) => u.role === card.role).length,
	}));

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Users & Roles"
				description="Invite users, assign roles, and control who can edit pricing, leads, SEO, and settings."
				action={<UsersPageActions />}
			/>

			<RoleSummaryCards cards={realRoleCards} />

			{users.length === 0 ? (
				<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
					<p className="text-sm font-medium text-stone-500">
						No admin users found in the database.
					</p>
					<p className="max-w-sm text-xs text-stone-400">
						Run{" "}
						<code className="rounded bg-stone-100 px-1.5 py-0.5">
							pnpm run db:superadmin
						</code>{" "}
						to create the first Super Admin, then use the Invite User button to
						add more team members.
					</p>
				</div>
			) : (
				<UsersTable users={users} />
			)}

			<PermissionMatrixTable matrix={mockPermissionMatrix} />
		</div>
	);
}

