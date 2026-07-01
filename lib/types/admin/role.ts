export type AdminRole =
	| "super-admin"
	| "website-manager"
	| "content-seo"
	| "sales-crm"
	| "marketing-admin";

export type AdminModule =
	| "dashboard"
	| "projects"
	| "landing-pages"
	| "leads"
	| "brochures"
	| "forms"
	| "insights"
	| "company-pages"
	| "media-library"
	| "seo-centre"
	| "tracking-analytics"
	| "users-roles"
	| "settings"
	| "route-map";

export interface AdminRoleDefinition {
	id: AdminRole;
	label: string;
	description: string;
}

export interface AdminUser {
	id: string;
	fullName: string;
	email: string;
	role: AdminRole;
	status: "active" | "inactive";
}
