export interface RouteMapEntry {
	label: string;
	path: string;
}

export const routeMapPrimaryRoutes: RouteMapEntry[] = [
	{ label: "Dashboard", path: "/admin/dashboard" },
	{ label: "Projects", path: "/admin/projects" },
	{ label: "Project Editor", path: "/admin/projects/[slug]/edit" },
	{ label: "Landing Pages", path: "/admin/landing-pages" },
	{ label: "Landing Builder", path: "/admin/landing-pages/[slug]/edit" },
	{ label: "Leads", path: "/admin/leads" },
	{ label: "Lead Profile", path: "/admin/leads/[leadId]" },
	{ label: "Brochures", path: "/admin/brochures" },
	{ label: "Forms", path: "/admin/forms" },
	{ label: "Form Builder", path: "/admin/forms/[id]/edit" },
	{ label: "News / Insights", path: "/admin/news-insights" },
	{ label: "Article Editor", path: "/admin/news-insights/[slug]/edit" },
	{ label: "Company Pages", path: "/admin/company-pages" },
	{ label: "Page Editor", path: "/admin/company-pages/[slug]/edit" },
	{ label: "Media Library", path: "/admin/media-library" },
	{ label: "SEO Centre", path: "/admin/seo-centre" },
	{ label: "Tracking", path: "/admin/tracking-analytics" },
	{ label: "Users & Roles", path: "/admin/users-roles" },
	{ label: "Settings", path: "/admin/settings" },
];

export interface RouteMapButtonEntry {
	button: string;
	location: string;
	destination: string;
	systemNote: string;
}

export const routeMapButtons: RouteMapButtonEntry[] = [
	{
		button: "Add New Project",
		location: "Projects",
		destination: "/admin/projects/new",
		systemNote: "Creates draft project",
	},
	{
		button: "Publish",
		location: "Editors",
		destination: "publish_flow",
		systemNote: "Validates permissions, revalidates public pages",
	},
	{
		button: "Preview",
		location: "Editors",
		destination: "?preview=true",
		systemNote: "No public change",
	},
	{
		button: "Assign Leads",
		location: "Leads",
		destination: "lead_assign_bulk",
		systemNote: "Bulk update reps",
	},
	{
		button: "Run SEO Audit",
		location: "SEO Centre",
		destination: "seo_audit",
		systemNote: "Scans pages",
	},
	{
		button: "Upload Media",
		location: "Media Library",
		destination: "media_upload",
		systemNote: "Adds asset metadata",
	},
	{
		button: "Save Settings",
		location: "Settings",
		destination: "settings_save",
		systemNote: "Updates global settings",
	},
];
