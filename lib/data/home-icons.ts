import {
	Building2,
	ClipboardList,
	LineChart,
	type LucideIcon,
	ShieldCheck,
	TrendingUp,
	Users,
} from "lucide-react";
import type { HomeIconKey } from "@/lib/types/home";

export const homeIconMap: Record<HomeIconKey, LucideIcon> = {
	building2: Building2,
	"line-chart": LineChart,
	"shield-check": ShieldCheck,
	"clipboard-list": ClipboardList,
	"trending-up": TrendingUp,
	users: Users,
};

// Used by the CMS icon picker when an admin edits a feature/stat card.
export const homeIconOptions: { value: HomeIconKey; label: string }[] = [
	{ value: "building2", label: "Building" },
	{ value: "line-chart", label: "Line chart" },
	{ value: "shield-check", label: "Shield / security" },
	{ value: "clipboard-list", label: "Clipboard / process" },
	{ value: "trending-up", label: "Trending up / growth" },
	{ value: "users", label: "Users / people" },
];
