import type { LucideIcon } from "lucide-react";
import {
	BedDouble,
	Building2,
	ClipboardList,
	Compass,
	HandHeart,
	Handshake,
	KeyRound,
	Layers,
	Megaphone,
	ShieldCheck,
	TrendingUp,
} from "lucide-react";

export const companyMissionVision = {
	mission:
		"To deliver premium residential, hospitality, and investment-led real estate developments that combine structured execution with long-term value for buyers, investors, and communities.",
	vision:
		"To become one of Africa's most trusted real estate development brands, known for credibility, quality, and disciplined growth.",
};

export interface CoreValue {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export const coreValues: CoreValue[] = [
	{
		id: "integrity",
		icon: ShieldCheck,
		title: "Integrity",
		description:
			"We do what we say we will do, from pricing and documentation to delivery timelines.",
	},
	{
		id: "precision",
		icon: Compass,
		title: "Precision",
		description:
			"Every project moves through a disciplined process, from site selection to handover.",
	},
	{
		id: "long-term-thinking",
		icon: Layers,
		title: "Long-Term Thinking",
		description:
			"We design for lasting value, not short-term sales, so buyers and investors can hold with confidence.",
	},
	{
		id: "people-first",
		icon: HandHeart,
		title: "People First",
		description:
			"We build spaces that serve real people, support modern lifestyles, and strengthen communities.",
	},
];

export interface CompanyService {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export const companyServices: CompanyService[] = [
	{
		id: "real-estate-development",
		icon: Building2,
		title: "Real Estate Development",
		description:
			"End-to-end delivery of residential and mixed-use developments, from site selection to handover.",
	},
	{
		id: "advisory",
		icon: ClipboardList,
		title: "Property Development Advisory",
		description:
			"Feasibility studies, concept development, and structuring support for landowners and partners.",
	},
	{
		id: "marketing-sales",
		icon: Megaphone,
		title: "Project Marketing & Sales",
		description:
			"Structured sales processes, lead management, and marketing for ongoing and upcoming developments.",
	},
	{
		id: "property-management",
		icon: KeyRound,
		title: "Property Management",
		description:
			"Day-to-day management of completed developments, including maintenance, security, and tenancy support.",
	},
	{
		id: "investment-led-development",
		icon: TrendingUp,
		title: "Investment-Led Real Estate Development",
		description:
			"Developments structured around rental yield, resale value, and long-term capital appreciation.",
	},
	{
		id: "hospitality-residential",
		icon: BedDouble,
		title: "Hospitality-Style Residential Development",
		description:
			"Serviced apartments and shortlet-ready residences designed for flexible, professionally managed income.",
	},
	{
		id: "joint-venture",
		icon: Handshake,
		title: "Joint Venture Development Opportunities",
		description:
			"Structured partnerships with landowners and investors to bring new developments to life.",
	},
];
