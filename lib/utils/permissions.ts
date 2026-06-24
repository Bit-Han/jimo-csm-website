
// import type { Permission, UserRole } from "@/lib/types";

// // Map: permission → roles that have it
// const PERMISSION_MAP: Record<Permission, UserRole[]> = {
// 	// Dashboard
// 	view_dashboard: [
// 		"super_admin",
// 		"website_manager",
// 		"content_seo",
// 		"sales_crm",
// 		"marketing_admin",
// 	],

// 	// Projects
// 	view_projects: [
// 		"super_admin",
// 		"website_manager",
// 		"content_seo",
// 		"sales_crm",
// 		"marketing_admin",
// 	],
// 	edit_projects: ["super_admin", "website_manager"],
// 	edit_pricing: ["super_admin", "website_manager"],

// 	// Leads
// 	view_leads: ["super_admin", "website_manager", "sales_crm"],
// 	edit_leads: ["super_admin", "website_manager", "sales_crm"],
// 	assign_leads: ["super_admin", "website_manager"],
// 	export_leads: ["super_admin", "website_manager", "sales_crm"],

// 	// Forms
// 	view_forms: ["super_admin", "website_manager", "content_seo"],
// 	edit_forms: ["super_admin", "website_manager"],

// 	// Brochures
// 	view_brochures: [
// 		"super_admin",
// 		"website_manager",
// 		"content_seo",
// 		"sales_crm",
// 		"marketing_admin",
// 	],
// 	publish_brochure: [
// 		"super_admin",
// 		"website_manager",
// 		"content_seo",
// 		"sales_crm",
// 		"marketing_admin",
// 	],

// 	// Media
// 	view_media: [
// 		"super_admin",
// 		"website_manager",
// 		"content_seo",
// 		"marketing_admin",
// 	],
// 	upload_media: ["super_admin", "website_manager", "content_seo"],

// 	// Articles
// 	view_articles: ["super_admin", "website_manager", "content_seo"],
// 	edit_articles: ["super_admin", "website_manager", "content_seo"],

// 	// Company Pages
// 	view_company_pages: ["super_admin", "website_manager", "content_seo"],
// 	edit_company_pages: ["super_admin", "website_manager", "content_seo"],

// 	// Landing Pages
// 	view_landing_pages: ["super_admin", "website_manager", "marketing_admin"],
// 	edit_landing_pages: ["super_admin", "website_manager", "marketing_admin"],

// 	// SEO
// 	view_seo: ["super_admin", "website_manager", "content_seo"],
// 	edit_seo: ["super_admin", "website_manager", "content_seo"],

// 	// Tracking & Analytics
// 	view_tracking: ["super_admin", "marketing_admin"],
// 	edit_tracking: ["super_admin", "marketing_admin"],

// 	// Users & Roles
// 	view_users: ["super_admin"],
// 	manage_users: ["super_admin"],

// 	// Settings (integrations, API keys)
// 	view_settings: ["super_admin"],
// 	edit_settings: ["super_admin"],
// };

// /**
//  * Returns true if the given role has the requested permission.
//  *
//  * Usage in API routes:
//  *   if (!can(profile.role, "edit_projects")) return forbidden();
//  */
// export function can(role: UserRole, permission: Permission): boolean {
// 	return PERMISSION_MAP[permission]?.includes(role) ?? false;
// }

// /**
//  * Returns all permissions for a given role (useful for frontend nav filtering).
//  */
// export function getPermissions(role: UserRole): Permission[] {
// 	return (Object.keys(PERMISSION_MAP) as Permission[]).filter((p) =>
// 		PERMISSION_MAP[p].includes(role),
// 	);
// }
