// lib/data/seed-projects.ts
// ─────────────────────────────────────────────────────────────────────────────
// Static seed data for public pages. Replace with real DB queries
// when the admin CMS is wired up.
// ─────────────────────────────────────────────────────────────────────────────

export type SeedProject = {
	id: string;
	name: string;
	slug: string;
	location: string;
	locationArea: string;
	status: "selling_now" | "active" | "pre_launch" | "draft" | "sold_out";
	listingType: "for_sale" | "for_rent" | "sold";
	type: "residential" | "commercial" | "mixed_use" | "hospitality" | "land";
	constructionStatus: "planning" | "under_construction" | "completed";
	description: string;
	heroHeadline: string;
	heroSubtext: string;
	heroImageUrl: string;
	videoUrl: string;
	startingPriceKobo: number;
	deliveryTimeline: string;
	titleDocument: string;
	totalUnits: number;
	availableUnits: number;
	isFeatured: boolean;
	whatsappNumber: string;
	callNumber: string;
	investmentHighlights: string[];
	locationAdvantages: string[];
	featuresAmenities: string[];
	paymentPlanDetails: {
		description: string;
		milestones: Array<{ label: string; percentageValue: number }>;
	};
	gallery: string[];
	units: Array<{
		name: string;
		totalUnits: number;
		availableUnits: number;
		currentPriceKobo: number;
		ctaLabel: string;
	}>;
};

export const SEED_PROJECTS: SeedProject[] = [
	{
		id: "1",
		name: "Vatican Court",
		slug: "vatican-court",
		location: "Osapa, Lekki, Lagos Island",
		locationArea: "Lekki",
		status: "selling_now",
		listingType: "for_sale",
		type: "residential",
		constructionStatus: "completed",
		description:
			"Vatican Court is a premium mid-rise residential development located in one of Lekki's most sought-after corridors. Designed for discerning buyers who value quality, space, and long-term investment potential. Every unit is finished to an exacting standard with premium fittings and thoughtful layouts.",
		heroHeadline: "Vatican Court",
		heroSubtext:
			"A premium mid-rise residential development in the heart of Lekki, designed for quality living and long-term value.",
		heroImageUrl:
			"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80",
		videoUrl: "https://www.youtube.com/watch?v=example",
		startingPriceKobo: 9000000000, // ₦90M in kobo
		deliveryTimeline: "Completed",
		titleDocument: "C of O",
		totalUnits: 24,
		availableUnits: 8,
		isFeatured: true,
		whatsappNumber: "+2348000000000",
		callNumber: "+2348000000000",
		investmentHighlights: [
			"Located in Osapa, one of Lekki's most active real estate corridors",
			"Completed development — move in immediately or begin earning rental income",
			"Strong capital appreciation history in the Osapa-Lekki axis",
			"Premium construction quality with international-standard finishes",
		],
		locationAdvantages: [
			"5 minutes from Lekki-Epe Expressway and major arterial roads",
			"Close to Shoprite Lekki, Novare Mall, and major commercial hubs",
			"Easy access to Victoria Island and Lagos Island business districts",
			"Surrounded by schools, hospitals, restaurants, and lifestyle destinations",
		],
		featuresAmenities: [
			"Swimming Pool",
			"24/7 Power Supply",
			"CCTV Security",
			"Covered Parking",
			"Gym",
			"Backup Water",
			"Smart Access",
			"Reception Lobby",
			"Rooftop Terrace",
			"Elevator",
		],
		paymentPlanDetails: {
			description:
				"Flexible payment plan available for qualified buyers. Contact our sales team for details.",
			milestones: [
				{ label: "Initial Deposit", percentageValue: 30 },
				{ label: "Second Payment", percentageValue: 40 },
				{ label: "Final Payment", percentageValue: 30 },
			],
		},
		gallery: [
			"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
			"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
		],
		units: [
			{
				name: "2 Bedroom Apartment",
				totalUnits: 12,
				availableUnits: 4,
				currentPriceKobo: 9000000000,
				ctaLabel: "Enquire About 2-Bedroom",
			},
			{
				name: "3 Bedroom Apartment",
				totalUnits: 8,
				availableUnits: 3,
				currentPriceKobo: 12000000000,
				ctaLabel: "Enquire About 3-Bedroom",
			},
			{
				name: "Penthouse",
				totalUnits: 4,
				availableUnits: 1,
				currentPriceKobo: 18000000000,
				ctaLabel: "Enquire About Penthouse",
			},
		],
	},
	{
		id: "2",
		name: "Jimo Residences Yaba",
		slug: "jimo-residences-yaba",
		location: "Yaba, Lagos Mainland",
		locationArea: "Yaba",
		status: "selling_now",
		listingType: "for_sale",
		type: "residential",
		constructionStatus: "under_construction",
		description:
			"Jimo Residences Yaba is a modern residential and short-let focused development designed for investors, young professionals, and lifestyle-driven guests. Positioned in the heart of Yaba — Lagos' most active tech and commercial hub — this development offers premium living with strong income potential.",
		heroHeadline: "Jimo Residences Yaba",
		heroSubtext:
			"A modern residential and short-let focused development designed for investors, young professionals, and lifestyle-driven guests.",
		heroImageUrl:
			"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80",
		videoUrl: "https://www.youtube.com/watch?v=example",
		startingPriceKobo: 8500000000, // ₦85M in kobo
		deliveryTimeline: "Q4 2027",
		titleDocument: "C of O",
		totalUnits: 42,
		availableUnits: 28,
		isFeatured: true,
		whatsappNumber: "+2348000000000",
		callNumber: "+2348000000000",
		investmentHighlights: [
			"Located in Yaba, one of Lagos Mainland's most active rental markets",
			"Designed for short-let, serviced apartment, and long-stay income",
			"Strong demand from students, professionals, tech workers, and business travellers",
			"Premium shared amenities increase guest experience and rental value",
		],
		locationAdvantages: [
			"Close to UNILAG, Sabo, Akoka, Alagomeji, and Herbert Macaulay",
			"Easy access to Third Mainland Bridge and Lagos Island",
			"Surrounded by schools, hospitals, offices, restaurants, and lifestyle destinations",
			"Strong demand from students, young professionals, and corporate guests",
		],
		featuresAmenities: [
			"Swimming Pool",
			"Gym",
			"Restaurant",
			"Rooftop Lounge",
			"Elevator",
			"24/7 Power",
			"CCTV",
			"Smart Access",
			"Parking",
			"Reception Lobby",
			"Housekeeping Support",
			"Managed Short-let Operations",
		],
		paymentPlanDetails: {
			description:
				"Flexible payment plan available for early investors and qualified buyers.",
			milestones: [
				{ label: "Initial Deposit", percentageValue: 30 },
				{ label: "Second Payment", percentageValue: 40 },
				{ label: "Final Payment", percentageValue: 30 },
			],
		},
		gallery: [
			"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
			"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
			"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
		],
		units: [
			{
				name: "Studio Apartment",
				totalUnits: 14,
				availableUnits: 10,
				currentPriceKobo: 8500000000,
				ctaLabel: "Enquire About Studio",
			},
			{
				name: "1 Bedroom Apartment",
				totalUnits: 20,
				availableUnits: 14,
				currentPriceKobo: 10000000000,
				ctaLabel: "Enquire About 1-Bedroom",
			},
			{
				name: "2 Bedroom Apartment",
				totalUnits: 8,
				availableUnits: 4,
				currentPriceKobo: 14000000000,
				ctaLabel: "Enquire About 2-Bedroom",
			},
		],
	},
	{
		id: "3",
		name: "Yaba Hospitality Hub",
		slug: "yaba-hospitality-hub",
		location: "Yaba, Lagos Mainland",
		locationArea: "Yaba",
		status: "pre_launch",
		listingType: "for_sale",
		type: "hospitality",
		constructionStatus: "planning",
		description:
			"Yaba Hospitality Hub is a landmark hospitality-driven real estate development, combining hotel suites, serviced apartments, and premium amenities in a single tower. Designed for investors seeking strong hospitality-sector returns in one of Lagos' fastest-growing commercial corridors.",
		heroHeadline: "Yaba Hospitality Hub",
		heroSubtext:
			"A landmark hospitality development combining hotel suites and serviced apartments in Yaba's fastest-growing corridor.",
		heroImageUrl:
			"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1400&q=80",
		videoUrl: "https://www.youtube.com/watch?v=example",
		startingPriceKobo: 20000000000, // ₦200M in kobo
		deliveryTimeline: "Q2 2028",
		titleDocument: "C of O",
		totalUnits: 60,
		availableUnits: 60,
		isFeatured: true,
		whatsappNumber: "+2348000000000",
		callNumber: "+2348000000000",
		investmentHighlights: [
			"Hospitality-managed structure with professional operations team",
			"High rental yield potential from hotel and short-let operations",
			"Prime Yaba location with strong corporate and leisure demand",
			"Mixed-use design increases revenue streams for investors",
		],
		locationAdvantages: [
			"Directly accessible from Herbert Macaulay Way, Yaba's main artery",
			"Close to major universities, tech hubs, and corporate offices",
			"Strong weekend leisure and mid-week corporate demand",
			"Government infrastructure investment increasing Yaba's premium",
		],
		featuresAmenities: [
			"Hotel-Managed Operations",
			"Restaurant & Bar",
			"Conference Rooms",
			"Rooftop Pool",
			"Gym & Spa",
			"24/7 Concierge",
			"Smart Room Controls",
			"Backup Power",
			"Valet Parking",
			"High-Speed WiFi",
		],
		paymentPlanDetails: {
			description:
				"Structured investment payment plan with early-bird pricing available.",
			milestones: [
				{ label: "Initial Deposit", percentageValue: 25 },
				{ label: "Second Payment", percentageValue: 35 },
				{ label: "Third Payment", percentageValue: 25 },
				{ label: "Final Payment", percentageValue: 15 },
			],
		},
		gallery: [
			"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
			"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
			"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
			"https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
		],
		units: [
			{
				name: "Hotel Suite",
				totalUnits: 30,
				availableUnits: 30,
				currentPriceKobo: 20000000000,
				ctaLabel: "Enquire About Hotel Suite",
			},
			{
				name: "Serviced Apartment",
				totalUnits: 30,
				availableUnits: 30,
				currentPriceKobo: 28000000000,
				ctaLabel: "Enquire About Serviced Apartment",
			},
		],
	},
];

// Helper: get featured projects for homepage
export const FEATURED_PROJECTS = SEED_PROJECTS.filter((p) => p.isFeatured);

// Helper: format kobo to Naira display string
export function formatNaira(kobo: number): string {
	const naira = kobo / 100;
	if (naira >= 1_000_000_000) {
		return `₦${(naira / 1_000_000_000).toFixed(0)}B`;
	}
	if (naira >= 1_000_000) {
		return `₦${(naira / 1_000_000).toFixed(0)}M`;
	}
	return `₦${naira.toLocaleString("en-NG")}`;
}

// Helper: status badge label
export function getStatusLabel(status: SeedProject["status"]): {
	label: string;
	color: string;
} {
	const map = {
		selling_now: { label: "Selling Now", color: "bg-green-100 text-green-700" },
		active: { label: "Active", color: "bg-blue-100 text-blue-700" },
		pre_launch: { label: "Pre-Launch", color: "bg-orange-100 text-orange-700" },
		draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
		sold_out: { label: "Sold Out", color: "bg-red-100 text-red-700" },
	};
	return map[status];
}

// Helper: listing type label
export function getListingLabel(type: SeedProject["listingType"]): string {
	const map = {
		for_sale: "For sale",
		for_rent: "For rent",
		sold: "Sold",
	};
	return map[type];
}

// Helper: construction status label
export function getConstructionLabel(
	status: SeedProject["constructionStatus"],
): string {
	const map = {
		planning: "Off Plan",
		under_construction: "Under Construction",
		completed: "Completed",
	};
	return map[status];
}
