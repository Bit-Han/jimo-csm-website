import type {
	AdminModule,
	AdminRole,
	AdminRoleDefinition,
} from "@/lib/types/admin/role";

export const adminRoleDefinitions: AdminRoleDefinition[] = [
	{
		id: "super-admin",
		label: "Super Admin",
		description: "Full access to all modules.",
	},
	{
		id: "website-manager",
		label: "Website Manager",
		description: "Projects, pages, media and forms.",
	},
	{
		id: "content-seo",
		label: "Content / SEO",
		description: "Content, SEO and insights.",
	},
	{
		id: "sales-crm",
		label: "Sales / CRM",
		description: "Leads and communications.",
	},
	{
		id: "marketing-admin",
		label: "Marketing Admin",
		description: "Campaigns and assets.",
	},
];

// First-draft mapping of which sidebar modules each role can see, inferred
// from the descriptions above. This is a starting point, not final — we'll
// refine it properly when we build out Users & Roles for real.
export const roleModuleAccess: Record<AdminRole, AdminModule[]> = {
	"super-admin": [
		"dashboard",
		"projects",
		"landing-pages",
		"leads",
		"brochures",
		"forms",
		"insights",
		"company-pages",
		"media-library",
		"seo-centre",
		"tracking-analytics",
		"users-roles",
		"settings",
		"route-map",
	],
	"website-manager": [
		"dashboard",
		"projects",
		"landing-pages",
		"company-pages",
		"media-library",
		"forms",
	],
	"content-seo": ["dashboard", "insights", "seo-centre", "company-pages"],
	"sales-crm": ["dashboard", "leads", "brochures"],
	"marketing-admin": [
		"dashboard",
		"landing-pages",
		"tracking-analytics",
		"media-library",
	],
};

export function canAccessModule(role: AdminRole, module: AdminModule): boolean {
	return roleModuleAccess[role].includes(module);
}
