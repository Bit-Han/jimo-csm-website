// import type { LucideIcon } from "lucide-react";
// import {
// 	BedDouble,
// 	Building2,
// 	ClipboardList,
// 	Compass,
// 	HandHeart,
// 	Handshake,
// 	KeyRound,
// 	Layers,
// 	Megaphone,
// 	ShieldCheck,
// 	TrendingUp,
// } from "lucide-react";

// export const companyMissionVision = {
// 	mission:
// 		"To deliver premium residential, hospitality, and investment-led real estate developments that combine structured execution with long-term value for buyers, investors, and communities.",
// 	vision:
// 		"To become one of Africa's most trusted real estate development brands, known for credibility, quality, and disciplined growth.",
// };

// export interface CoreValue {
// 	id: string;
// 	icon: LucideIcon;
// 	title: string;
// 	description: string;
// }

// export const coreValues: CoreValue[] = [
// 	{
// 		id: "integrity",
// 		icon: ShieldCheck,
// 		title: "Integrity",
// 		description:
// 			"We do what we say we will do, from pricing and documentation to delivery timelines.",
// 	},
// 	{
// 		id: "precision",
// 		icon: Compass,
// 		title: "Precision",
// 		description:
// 			"Every project moves through a disciplined process, from site selection to handover.",
// 	},
// 	{
// 		id: "long-term-thinking",
// 		icon: Layers,
// 		title: "Long-Term Thinking",
// 		description:
// 			"We design for lasting value, not short-term sales, so buyers and investors can hold with confidence.",
// 	},
// 	{
// 		id: "people-first",
// 		icon: HandHeart,
// 		title: "People First",
// 		description:
// 			"We build spaces that serve real people, support modern lifestyles, and strengthen communities.",
// 	},
// ];

// export interface CompanyService {
// 	id: string;
// 	icon: LucideIcon;
// 	title: string;
// 	description: string;
// }

// export const companyServices: CompanyService[] = [
// 	{
// 		id: "real-estate-development",
// 		icon: Building2,
// 		title: "Real Estate Development",
// 		description:
// 			"End-to-end delivery of residential and mixed-use developments, from site selection to handover.",
// 	},
// 	{
// 		id: "advisory",
// 		icon: ClipboardList,
// 		title: "Property Development Advisory",
// 		description:
// 			"Feasibility studies, concept development, and structuring support for landowners and partners.",
// 	},
// 	{
// 		id: "marketing-sales",
// 		icon: Megaphone,
// 		title: "Project Marketing & Sales",
// 		description:
// 			"Structured sales processes, lead management, and marketing for ongoing and upcoming developments.",
// 	},
// 	{
// 		id: "property-management",
// 		icon: KeyRound,
// 		title: "Property Management",
// 		description:
// 			"Day-to-day management of completed developments, including maintenance, security, and tenancy support.",
// 	},
// 	{
// 		id: "investment-led-development",
// 		icon: TrendingUp,
// 		title: "Investment-Led Real Estate Development",
// 		description:
// 			"Developments structured around rental yield, resale value, and long-term capital appreciation.",
// 	},
// 	{
// 		id: "hospitality-residential",
// 		icon: BedDouble,
// 		title: "Hospitality-Style Residential Development",
// 		description:
// 			"Serviced apartments and shortlet-ready residences designed for flexible, professionally managed income.",
// 	},
// 	{
// 		id: "joint-venture",
// 		icon: Handshake,
// 		title: "Joint Venture Development Opportunities",
// 		description:
// 			"Structured partnerships with landowners and investors to bring new developments to life.",
// 	},
// ];



import {
	Briefcase,
	Building2,
	ClipboardList,
	Compass,
	Globe2,
	Handshake,
	Home,
	type LucideIcon,
	ShieldCheck,
	TrendingUp,
	BedDouble,
} from "lucide-react";

export interface WhoWeAre {
	eyebrow: string;
	heading: string;
	highlight: string;
	paragraphs: string[];
}

export const whoWeAre: WhoWeAre = {
	eyebrow: "Who We Are",
	heading: "Building Africa's next innovative real estate",
	highlight:
		"Jimo Property Development Limited is an African real estate development company focused on creating smart, functional, and investment-worthy spaces for modern urban living.",
	paragraphs: [
		"We develop modern real estate designed for Africa's future — spaces that respond to how people live, work, travel, and invest. Our projects are guided by smart design, strong market insight, disciplined execution, and a clear focus on long-term value.",
		"At Jimo Property Development Limited, we believe real estate should go beyond buildings. Every development should be purposeful, functional, commercially sound, and built to serve both present and future needs.",
		"Our focus cuts across residential, hospitality-led, commercial, and investment-grade developments. Whether we are creating homes, serviced residences, mixed-use spaces, or structured investment projects, our goal is to deliver real estate assets that are relevant, valuable, and built to stand the test of time.",
		"We are building a development company that represents the next generation of African real estate: innovative, structured, trusted, and globally competitive.",
	],
};

export interface CoreValue {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export const coreValues: CoreValue[] = [
	{
		id: "innovative",
		icon: Compass,
		title: "Innovative",
		description:
			"We design and build for how people will live, work, and invest tomorrow, not just today.",
	},
	{
		id: "structured",
		icon: ClipboardList,
		title: "Structured",
		description:
			"Every project follows a disciplined process, from feasibility through to handover.",
	},
	{
		id: "trusted",
		icon: ShieldCheck,
		title: "Trusted",
		description:
			"Buyers, investors, and partners get clear, transparent information at every stage.",
	},
	{
		id: "globally-competitive",
		icon: Globe2,
		title: "Globally Competitive",
		description:
			"Our developments are built to a standard that holds up anywhere, not just locally.",
	},
];

export interface CompanyServiceBullet {
	id: string;
	label: string;
}

export interface CompanyService {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
	bullets: CompanyServiceBullet[];
}

export const companyServices: CompanyService[] = [
	{
		id: "development-and-asset-creation",
		icon: Building2,
		title: "Real Estate Development & Asset Creation",
		description:
			"We develop high-quality residential, hospitality-led, commercial, mixed-use, and income-generating real estate assets designed for modern urban living and long-term value.",
		bullets: [
			{ id: "location-led", label: "Location-led development strategy" },
			{ id: "smart-design", label: "Smart design and functional planning" },
			{
				id: "quality-construction",
				label: "Quality-focused construction delivery",
			},
			{
				id: "ux-performance",
				label: "User experience and investment performance",
			},
		],
	},
	{
		id: "joint-venture-partnerships",
		icon: Handshake,
		title: "Joint Venture & Landowner Development Partnerships",
		description:
			"We partner with landowners, families, institutions, and private landholders to unlock the value of underutilized land through professionally structured development partnerships.",
		bullets: [
			{ id: "expertise", label: "Development expertise and coordination" },
			{ id: "feasibility", label: "Market insight and feasibility support" },
			{
				id: "capital-structure",
				label: "Capital structure and partnership framework",
			},
			{
				id: "transformation",
				label: "Transformation of land into valuable assets",
			},
		],
	},
	{
		id: "development-management",
		icon: ClipboardList,
		title: "Development Management & Project Delivery",
		description:
			"We manage the full development process from concept to completion, ensuring discipline, transparency, quality, and accountability across every stage.",
		bullets: [
			{
				id: "feasibility-design",
				label: "Feasibility, design coordination, and approvals",
			},
			{
				id: "budgeting",
				label: "Budgeting, procurement oversight, and contractor coordination",
			},
			{
				id: "construction-supervision",
				label: "Construction supervision and quality control",
			},
			{
				id: "handover",
				label: "Progress reporting, handover, and defect management",
			},
		],
	},
	{
		id: "investment-and-capital-partnerships",
		icon: TrendingUp,
		title: "Real Estate Investment & Capital Partnerships",
		description:
			"We structure real estate-backed development opportunities for investors and capital partners seeking exposure to professionally managed property projects.",
		bullets: [
			{ id: "fundamentals", label: "Strong market fundamentals" },
			{
				id: "responsible-structuring",
				label: "Responsible investment structuring",
			},
			{ id: "transparent-reporting", label: "Transparent reporting" },
			{ id: "long-term-value", label: "Long-term value creation" },
		],
	},
];

export interface PropertyTypeCategory {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export const propertyTypeCategories: PropertyTypeCategory[] = [
	{
		id: "residential",
		icon: Home,
		title: "Residential",
		description:
			"Modern apartments and homes designed for comfort, functionality, quality living, and long-term asset appreciation.",
	},
	{
		id: "hospitality-led",
		icon: BedDouble,
		title: "Hospitality-Led Developments",
		description:
			"Serviced apartments, lifestyle residences, and short-stay-ready developments created for corporate guests, professionals, diaspora visitors, and modern urban users.",
	},
	{
		id: "commercial",
		icon: Briefcase,
		title: "Commercial",
		description:
			"Office spaces, retail spaces, co-working environments, mixed-use commercial components, and business-focused real estate designed to support productivity, convenience, and commercial value.",
	},
	{
		id: "investment-led",
		icon: TrendingUp,
		title: "Investment-Led Developments",
		description:
			"Structured real estate projects designed with clear financial rationale, income potential, market demand, and long-term investment performance.",
	},
];

export const companyPromise = {
	lines: ["Smart design.", "Functional spaces.", "Strong investment value."],
	description: "We develop modern real estate designed for Africa's future.",
};
