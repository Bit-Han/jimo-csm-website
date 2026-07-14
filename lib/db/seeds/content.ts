import { db } from "../index";
import { companyContent, homeContent, siteSettings } from "../schema";
import type {
	CompanyPromiseData,
	CompanyServiceData,
	CompanyWhoWeAreData,
	CoreValueData,
	PropertyTypeCategoryData,
	TeamMemberData,
} from "../schema/content";
import type { HomePageData } from "@/lib/types/home";

// ─── Home content ─────────────────────────────────────────────────────────

const homeData: HomePageData = {
	hero: {
		eyebrow: "Premium Real Estate Development",
		heading: "Building Africa's Next Innovative Real Estate",
		description:
			"We develop premium residential, hospitality, and investment-led real estate projects designed with structure, market insight, and long-term value.",
		primaryCta: { label: "View Projects", href: "/projects" },
		secondaryCta: { label: "Register Interest", href: "/contact" },
		stats: [
			{
				id: "premium-developments",
				label: "Premium Developments",
				icon: "building2",
			},
			{
				id: "long-term-asset-value",
				label: "Long-Term Asset Value",
				icon: "line-chart",
			},
			{
				id: "structured-approach",
				label: "Structured Approach",
				icon: "shield-check",
			},
		],
		image: {
			src: "https://images.unsplash.com/photo-1752293451299-fca611e46389?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern high-rise residential towers representative of a Jimo development",
		},
		projectFocusLabel: "Residential · Hospitality · Investment",
		builtForLabel: "Buyers, Investors & Partners",
	},
	about: {
		eyebrow: "About Jimo Development",
		heading: "Driven by vision, built with purpose.",
		description:
			"At Jimo Property Development Limited, every project is built on a foundation of integrity, precision, and long-term thinking. We do not just build structures; we create spaces that serve real people, support modern lifestyles, and generate lasting value for buyers, investors, and communities.",
		cta: { label: "Learn more about us", href: "/about" },
	},
	featured: {
		eyebrow: "Featured Projects",
		heading: "Current and upcoming developments",
		description:
			"Explore residential, serviced apartment, and hospitality-led real estate projects from Jimo Property Development Limited.",
	},
	whyChoose: {
		eyebrow: "Why Choose Jimo",
		heading: "Built for buyers, investors and partners",
		description:
			"We combine market-led thinking, quality execution, and structured communication to create projects with credibility and long-term value.",
		features: [
			{
				id: "structured-process",
				icon: "clipboard-list",
				title: "Structured Development Process",
				description:
					"From site selection to approvals, construction, and handover, every project follows a clear development process.",
			},
			{
				id: "premium-positioning",
				icon: "building2",
				title: "Premium Project Positioning",
				description:
					"Our developments are shaped around modern lifestyles, strong finishes, comfort, security, and usability.",
			},
			{
				id: "market-led",
				icon: "trending-up",
				title: "Market-Led Decisions",
				description:
					"We study location demand, buyer behaviour, rental potential, and future growth before shaping each project.",
			},
			{
				id: "transparent-comms",
				icon: "users",
				title: "Transparent Communication",
				description:
					"Buyers, investors, and partners get clear information throughout the project journey.",
			},
		],
	},
	howWeWork: {
		eyebrow: "How We Work",
		heading: "A clear development approach",
		description:
			"Every project moves through a disciplined process from site selection to delivery.",
		steps: [
			{ id: "step-1", number: "01", title: "Site Selection & Due Diligence" },
			{
				id: "step-2",
				number: "02",
				title: "Feasibility & Concept Development",
			},
			{ id: "step-3", number: "03", title: "Design & Planning" },
			{ id: "step-4", number: "04", title: "Approvals & Structuring" },
			{ id: "step-5", number: "05", title: "Construction & Quality Control" },
			{ id: "step-6", number: "06", title: "Sales, Handover & Management" },
		],
	},
	cta: {
		eyebrow: "Start a Conversation",
		heading: "Interested in buying, investing or partnering with Jimo?",
		description:
			"Our team is available to discuss current projects, upcoming developments, and partnership opportunities.",
		primaryCta: { label: "Register Interest", href: "/contact" },
		secondaryCta: { label: "Speak With Our Team", href: "/contact" },
	},
};

// ─── Company content ──────────────────────────────────────────────────────

const whoWeAre: CompanyWhoWeAreData = {
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

const coreValues: CoreValueData[] = [
	{
		id: "innovative",
		icon: "compass",
		title: "Innovative",
		description:
			"We design and build for how people will live, work, and invest tomorrow, not just today.",
	},
	{
		id: "structured",
		icon: "clipboard-list",
		title: "Structured",
		description:
			"Every project follows a disciplined process, from feasibility through to handover.",
	},
	{
		id: "trusted",
		icon: "shield-check",
		title: "Trusted",
		description:
			"Buyers, investors, and partners get clear, transparent information at every stage.",
	},
	{
		id: "globally-competitive",
		icon: "globe2",
		title: "Globally Competitive",
		description:
			"Our developments are built to a standard that holds up anywhere, not just locally.",
	},
];

const services: CompanyServiceData[] = [
	{
		id: "development-and-asset-creation",
		icon: "building2",
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
		icon: "handshake",
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
		icon: "clipboard-list",
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
		icon: "trending-up",
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

const propertyTypes: PropertyTypeCategoryData[] = [
	{
		id: "residential",
		icon: "home",
		title: "Residential",
		description:
			"Modern apartments and homes designed for comfort, functionality, quality living, and long-term asset appreciation.",
	},
	{
		id: "hospitality-led",
		icon: "bed-double",
		title: "Hospitality-Led Developments",
		description:
			"Serviced apartments, lifestyle residences, and short-stay-ready developments created for corporate guests, professionals, diaspora visitors, and modern urban users.",
	},
	{
		id: "commercial",
		icon: "briefcase",
		title: "Commercial",
		description:
			"Office spaces, retail spaces, co-working environments, mixed-use commercial components, and business-focused real estate designed to support productivity, convenience, and commercial value.",
	},
	{
		id: "investment-led",
		icon: "trending-up",
		title: "Investment-Led Developments",
		description:
			"Structured real estate projects designed with clear financial rationale, income potential, market demand, and long-term investment performance.",
	},
];

const companyPromise: CompanyPromiseData = {
	lines: ["Smart design.", "Functional spaces.", "Strong investment value."],
	description: "We develop modern real estate designed for Africa's future.",
};

const teamMembers: TeamMemberData[] = [
	{
		id: "managing-director",
		name: "John Onyekachi",
		role: "Founder & Managing Director",
		bio: "Leads the overall vision and development strategy across every Jimo project, from site selection to handover.",
		photo: {
			src: "https://images.unsplash.com/photo-1758518729058-b158e71c5a9b?auto=format&fit=crop&w=600&q=80",
			alt: "Portrait of John Onyekachi, Founder and Managing Director",
		},
	},
	{
		id: "head-of-sales",
		name: "Amaka Bello",
		role: "Head of Sales & Marketing",
		bio: "Oversees project marketing, buyer and investor relationships, and the sales process from enquiry to documentation.",
		photo: {
			src: "https://images.unsplash.com/photo-1758518729466-827cd8293992?auto=format&fit=crop&w=600&q=80",
			alt: "Portrait of Amaka Bello, Head of Sales and Marketing",
		},
	},
];

// ─── Site settings ────────────────────────────────────────────────────────

export async function seedContent() {
	// Home content
	await db
		.insert(homeContent)
		.values({ id: 1, data: homeData })
		.onConflictDoNothing();

	// Company content
	await db
		.insert(companyContent)
		.values({
			id: 1,
			whoWeAre,
			coreValues,
			services,
			propertyTypes,
			companyPromise,
			teamMembers,
		})
		.onConflictDoNothing();

	// Site settings
	await db
		.insert(siteSettings)
		.values({
			id: 1,
			companyName: "Jimo Property Development Limited",
			legalName: "Jimo Property Development Limited",
			companyEmail: "info@jimopropertydevelopment.com",
			salesEmail: "sales@jimopropertydevelopment.com",
			phone: "+234 000 000 0000",
			whatsappHref: "https://wa.me/2349009009051",
			instagramHandle: "@Jimopropertydevelopment",
			address: "32 Sholanke Street, Akoka, Lagos",
			responseTimeNote: "We aim to respond within 24 hours.",
		})
		.onConflictDoNothing();

	console.log("✓ Content seed complete.");
}
