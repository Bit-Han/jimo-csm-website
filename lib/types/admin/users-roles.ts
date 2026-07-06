import type { AdminRole } from "@/lib/types/admin/role";

export interface AdminUserListRow {
	id: string;
	fullName: string;
	email: string;
	role: AdminRole;
	roleLabel: string;
	status: "active" | "inactive";
	permissionSummary: string;
	lastActive: string;
}

export interface RoleSummaryCard {
	role: AdminRole;
	label: string;
	count: number;
	description: string;
	colorClass: string;
	textClass: string;
}

export type PermissionKey =
	| "edit-pricing"
	| "publish-brochure"
	| "view-leads"
	| "edit-seo"
	| "change-integrations";

export type PermissionValue = "yes" | "no" | "partial";

export interface PermissionMatrixRow {
	permission: PermissionKey;
	label: string;
	values: Record<AdminRole, PermissionValue>;
}

export interface InviteUserFormState {
	email: string;
	role: AdminRole;
}

export type InviteFormStatus = "idle" | "sending" | "sent" | "error";
