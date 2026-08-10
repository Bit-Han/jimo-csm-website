// lib/data/admin/roles.ts (full file)
import type {
	AdminModule,
	AdminRole,
	AdminRoleDefinition,
} from "@/lib/types/admin/role";

export const adminRoleDefinitions: AdminRoleDefinition[] = [
	{ id: "super-admin", label: "Super Admin", description: "Full access to all modules." },
	{ id: "website-manager", label: "Website Manager", description: "Projects, pages, and forms." },
	{ id: "content-seo", label: "Content / SEO", description: "Content, SEO and insights." },
	{ id: "sales-crm", label: "Sales / CRM", description: "Leads and communications." },
	{ id: "marketing-admin", label: "Marketing Admin", description: "Campaigns and assets." },
];

export const roleModuleAccess: Record<AdminRole, AdminModule[]> = {
	"super-admin": [
		"dashboard", "projects", "landing-pages", "leads", "brochures",
		"forms", "insights", "company-pages", "seo-centre",
		"tracking-analytics", "users-roles", "settings", "route-map",
	],
	"website-manager": [
		"dashboard", "projects", "landing-pages", "company-pages", "forms", "route-map",
	],
	"content-seo": ["dashboard", "insights", "seo-centre", "company-pages", "route-map"],
	"sales-crm": ["dashboard", "leads", "brochures", "route-map"],
	"marketing-admin": ["dashboard", "landing-pages", "tracking-analytics", "route-map"],
};

export function canAccessModule(role: AdminRole, module: AdminModule): boolean {
	const allowedModules = roleModuleAccess[role as keyof typeof roleModuleAccess];
	if (!allowedModules) return false;
	return allowedModules.includes(module);
}