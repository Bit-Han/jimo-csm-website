import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RoleSummaryCards } from "@/components/admin/users/RoleSummaryCards";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { PermissionMatrixTable } from "@/components/admin/users/PermissionMatrixTable";
import { UsersPageActions } from "@/components/admin/users/UsersPageActions";
import {
	mockAdminUsers,
	mockPermissionMatrix,
	mockRoleSummaryCards,
} from "@/lib/data/admin/users";

export const metadata: Metadata = {
	title: "Users & Roles | Jimo Command Centre",
};

export default function AdminUsersRolesPage() {
	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Users & Roles"
				description="Invite users, assign roles, and control who can edit pricing, leads, SEO, and settings."
				action={<UsersPageActions />}
			/>

			<RoleSummaryCards cards={mockRoleSummaryCards} />

			<UsersTable users={mockAdminUsers} />

			<PermissionMatrixTable matrix={mockPermissionMatrix} />
		</div>
	);
}
