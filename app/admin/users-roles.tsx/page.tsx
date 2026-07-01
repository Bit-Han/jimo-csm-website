import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminUsersRolesPage() {
	return (
		<AdminPlaceholderPage
			title="Users & Roles"
			description="Invite users, assign roles, and control who can edit pricing, leads, SEO, and settings."
			stageNote="This becomes the real invite flow and permission matrix once Supabase Auth is wired up."
		/>
	);
}
