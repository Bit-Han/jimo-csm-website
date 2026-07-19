import {
	Building,
	Building2,
	ClipboardList,
	FileText,
	LayoutDashboard,
	Map,
	Newspaper,
	Settings,
	Target,
	TrendingUp,
	UserCog,
	Users,
	BookOpen,
} from "lucide-react";
import type { AdminNavItem } from "@/lib/types/admin/nav";

export const adminNavItems: AdminNavItem[] = [
	{
		module: "dashboard",
		label: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		module: "projects",
		label: "Projects",
		href: "/admin/projects",
		icon: Building2,
	},
	{
		module: "landing-pages",
		label: "Landing Pages",
		href: "/admin/landing-pages",
		icon: FileText,
	},
	{
		module: "leads",
		label: "Leads & Enquiries",
		href: "/admin/leads",
		icon: Users,
	},
	{
		module: "brochures",
		label: "Brochures",
		href: "/admin/brochures",
		icon: BookOpen,
	},
	{
		module: "forms",
		label: "Forms",
		href: "/admin/forms",
		icon: ClipboardList,
	},
	{
		module: "insights",
		label: "News / Insights",
		href: "/admin/news-insights",
		icon: Newspaper,
	},
	{
		module: "company-pages",
		label: "Company Pages",
		href: "/admin/company-pages",
		icon: Building,
	},
	{
		module: "seo-centre",
		label: "SEO Centre",
		href: "/admin/seo-centre",
		icon: Target,
	},
	{
		module: "tracking-analytics",
		label: "Tracking & Analytics",
		href: "/admin/tracking-analytics",
		icon: TrendingUp,
	},
	{
		module: "users-roles",
		label: "Users & Roles",
		href: "/admin/users-roles",
		icon: UserCog,
	},
	{
		module: "settings",
		label: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
	{
		module: "route-map",
		label: "Route Map",
		href: "/admin/route-map",
		icon: Map,
	},
];
