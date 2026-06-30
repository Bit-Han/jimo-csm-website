import type { HomePageData } from "@/lib/types/home";

export const homePageData: HomePageData = {
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
