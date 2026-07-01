import type { Project } from "@/lib/types/project";

export const featuredProjects: Project[] = [
	{
		id: "vatican-court",
		slug: "vatican-court",
		name: "Vatican Court",
		location: "Akoka, Yaba",
		status: "completed",
		statusLabel: "Completed",
		category: ["residential"],
		developerLabel: "Jimo Development",
		typeLabel: "Premium Residence",
		description:
			"Spacious 3-bedroom apartments with BQ, secure access, quality finishing, and practical amenities for modern family living and long-term value.",
		tags: [
			{ id: "residential", label: "Residential" },
			{ id: "price", label: "Confirm Current Price" },
		],
		primaryCta: { label: "View Project", href: "/projects/vatican-court" },
		secondaryCta: {
			label: "Register Interest",
			href: "/contact?project=vatican-court",
		},
		coverImage: {
			src: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern residential apartment building exterior with balconies, representing Vatican Court",
		},
	},
	{
		id: "jimo-residences-yaba",
		slug: "jimo-residences-yaba",
		name: "Jimo Residences Yaba",
		location: "Yaba",
		status: "under-development",
		statusLabel: "Under-Development",
		category: ["residential", "hospitality"],
		developerLabel: "Jimo Development",
		typeLabel: "Serviced Apartment",
		description:
			"A hospitality-style residential development for investors, young professionals, corporate guests, and diaspora visitors seeking better value, comfort, and management.",
		tags: [
			{
				id: "investment-type",
				label: "Serviced Apartment / Residential Investment",
			},
			{ id: "price", label: "Starting Price Coming Soon" },
		],
		primaryCta: {
			label: "View Project",
			href: "/projects/jimo-residences-yaba",
		},
		secondaryCta: {
			label: "Register Interest",
			href: "/contact?project=jimo-residences-yaba",
		},
		coverImage: {
			src: "https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern apartment building with large windows, representing Jimo Residences Yaba",
		},
	},
	{
		id: "yaba-hospitality-hub",
		slug: "yaba-hospitality-hub",
		name: "Yaba Hospitality Hub",
		location: "Yaba",
		status: "under-development",
		statusLabel: "Under-Development",
		category: ["hospitality"],
		developerLabel: "Jimo Development",
		typeLabel: "Hospitality Concept",
		description:
			"An integrated development combining serviced apartments, guest suites, restaurant space, lifestyle amenities, and investor-focused real estate value.",
		tags: [
			{ id: "category", label: "Hospitality-Led Real Estate" },
			{ id: "timeline", label: "Coming Soon" },
		],
		primaryCta: {
			label: "View Project",
			href: "/projects/yaba-hospitality-hub",
		},
		secondaryCta: {
			label: "Register Interest",
			href: "/contact?project=yaba-hospitality-hub",
		},
		coverImage: {
			src: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
			alt: "Modern apartment building facade, representing Yaba Hospitality Hub",
		},
	},
];
