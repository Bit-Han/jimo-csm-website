//lib/data/company-icons.ts
import {
	BedDouble,
	Briefcase,
	Building2,
	ClipboardList,
	Compass,
	Globe2,
	HandHeart,
	Handshake,
	Home,
	type LucideIcon,
	ShieldCheck,
	TrendingUp,
} from "lucide-react";

export type CompanyIconKey =
	| "compass"
	| "clipboard-list"
	| "shield-check"
	| "globe2"
	| "building2"
	| "handshake"
	| "trending-up"
	| "briefcase"
	| "bed-double"
	| "home"
	| "hand-heart";

export const companyIconMap: Record<CompanyIconKey, LucideIcon> = {
	compass: Compass,
	"clipboard-list": ClipboardList,
	"shield-check": ShieldCheck,
	globe2: Globe2,
	building2: Building2,
	handshake: Handshake,
	"trending-up": TrendingUp,
	briefcase: Briefcase,
	"bed-double": BedDouble,
	home: Home,
	"hand-heart": HandHeart,
};

export const companyIconOptions: { value: CompanyIconKey; label: string }[] = [
	{ value: "compass", label: "Compass / Direction" },
	{ value: "clipboard-list", label: "Clipboard / Process" },
	{ value: "shield-check", label: "Shield / Security" },
	{ value: "globe2", label: "Globe / Global" },
	{ value: "building2", label: "Building" },
	{ value: "handshake", label: "Handshake / Partnership" },
	{ value: "trending-up", label: "Trending Up / Growth" },
	{ value: "briefcase", label: "Briefcase / Commercial" },
	{ value: "bed-double", label: "Bed / Hospitality" },
	{ value: "home", label: "Home / Residential" },
	{ value: "hand-heart", label: "People First / Care" },
];
