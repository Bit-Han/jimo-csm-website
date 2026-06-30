import type { Project } from "@/lib/types/project";
import type { ProjectDetail } from "@/lib/types/project-detail";
import { featuredProjects } from "@/lib/data/projects";


function getSummary(slug: string): Project {
	const summary = featuredProjects.find((project) => project.slug === slug);

	if (!summary) {
		throw new Error(`No summary project found for slug "${slug}"`);
	}

	return summary;
}

export const projectDetails: Record<string, ProjectDetail> = {
	"vatican-court": {
		...getSummary("vatican-court"),
		categoryLabel: "Residential",
		facts: [
			{ label: "Location", value: "32 Sholanke Street, Akoka, Yaba, Lagos" },
			{ label: "Status", value: "Completed" },
			{ label: "Project Type", value: "Residential" },
			{ label: "Unit Types", value: "3-Bedroom Apartment + BQ" },
			{ label: "Starting Price", value: "Confirm Current Price" },
			{ label: "Delivery", value: "Completed" },
			{ label: "Title", value: "C of O" },
		],
		overview: [
			"Vatican Court is a completed premium residential development in Akoka, Yaba, offering spacious 3-bedroom apartments with BQ, quality finishing, secure access, parking, and essential infrastructure for comfortable urban living.",
			"The project is positioned for buyers and investors who want practical design, strong location value, and a credible development process.",
		],
		units: [
			{
				id: "3-bedroom-bq",
				name: "3-Bedroom Apartment + BQ",
				icon: "home",
				priceLabel: "Confirm Current Price",
				availabilityLabel: "Confirm Current Availability",
			},
		],
		investmentHighlights: [
			{
				id: "ownership",
				label: "Completed property with immediate ownership potential",
			},
			{
				id: "location",
				label:
					"Located in Akoka, Yaba, a strong residential and rental corridor",
			},
			{ id: "layout", label: "Functional 3-bedroom + BQ layout" },
			{ id: "title", label: "C of O title" },
			{
				id: "suitability",
				label: "Suitable for homeowners and rental investors",
			},
		],
		paymentPlan: [
			{ id: "outright", label: "Outright purchase available" },
			{
				id: "flexible",
				label: "Flexible payment may be available for qualified buyers",
			},
			{
				id: "documentation",
				label: "Documentation fee to be confirmed by sales team",
			},
			{
				id: "mortgage",
				label: "Mortgage option to be confirmed before publishing",
			},
		],
		amenities: [
			{ id: "cctv", label: "CCTV security", icon: "camera" },
			{ id: "smart-access", label: "Smart access", icon: "fingerprint" },
			{ id: "treated-water", label: "Treated water", icon: "droplet" },
			{ id: "water-tank", label: "Dedicated water tank", icon: "droplets" },
			{ id: "prepaid-water", label: "Prepaid water", icon: "droplet" },
			{ id: "fitted-kitchen", label: "Fitted kitchen", icon: "chef-hat" },
			{ id: "wardrobes", label: "Wardrobes", icon: "shirt" },
			{ id: "pop-ceiling", label: "POP ceiling", icon: "layout-panel-top" },
			{ id: "water-heaters", label: "Water heaters", icon: "flame" },
			{ id: "parking", label: "Parking", icon: "parking-circle" },
			{ id: "solar", label: "Solar wiring provision", icon: "sun" },
		],
		media: [
			{
				id: "vatican-court-exterior",
				type: "image",
				src: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
				alt: "Vatican Court apartment building exterior",
			},
			{
				id: "vatican-court-living-room",
				type: "image",
				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
				alt: "Living room interior representative of Vatican Court apartments",
			},
			{
				id: "vatican-court-lounge",
				type: "image",
				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
				alt: "Lounge interior representative of Vatican Court apartments",
			},
		],
		contactCtaTitle: "Secure your interest in Vatican Court",
		contactCtaDescription:
			"Speak with our team to confirm price, availability, inspection dates, payment plan and documentation details.",
	},
	"jimo-residences-yaba": {
		...getSummary("jimo-residences-yaba"),
		categoryLabel: "Residential & Hospitality",
		facts: [
			{ label: "Location", value: "Yaba, Lagos Mainland" },
			{ label: "Status", value: "Under-development" },
			{ label: "Project Type", value: "Shortlet Apartments" },
			{
				label: "Unit Types",
				value: "Studio, 1-Bedroom Apartment, 1-Bedroom Penthouse",
			},
			{ label: "Starting Price", value: "From ₦65,000,000" },
			{ label: "Delivery", value: "Q4 2026" },
			{ label: "Title", value: "C of O" },
		],
		overview: [
			"Jimo Residences Yaba is a hospitality-style residential development in the heart of Yaba, Lagos Mainland, offering studio, one-bedroom, and penthouse units designed for investors, young professionals, corporate guests, and diaspora visitors.",
			"The development supports both long-term residency and professionally managed shortlet income, with an estimated rental yield of 12 to 18 percent.",
		],
		units: [
			{
				id: "studio-apartment",
				name: "Studio Apartment",
				icon: "home",
				priceLabel: "From ₦65,000,000",
				availabilityLabel: "10 Available",
			},
			{
				id: "1-bedroom-apartment",
				name: "1-Bedroom Apartment",
				icon: "home",
				priceLabel: "From ₦100,000,000",
				availabilityLabel: "22 Available",
			},
			{
				id: "1-bedroom-penthouse",
				name: "1-Bedroom Penthouse",
				icon: "building",
				priceLabel: "From ₦110,000,000",
				availabilityLabel: "4 Available",
			},
		],
		investmentHighlights: [
			{
				id: "shortlet",
				label: "Hospitality-managed shortlet income potential",
			},
			{
				id: "location",
				label: "Prime Yaba location with strong commercial and academic demand",
			},
			{ id: "yield", label: "Estimated rental yield of 12 to 18 percent" },
			{
				id: "mix",
				label: "Flexible unit mix: Studio, 1-Bedroom Apartment, and Penthouse",
			},
			{
				id: "process",
				label: "Backed by a structured development and sales process",
			},
		],
		paymentPlan: [
			{ id: "outright", label: "Outright purchase available" },
			{
				id: "instalment",
				label: "Instalment plans available for qualified investors",
			},
			{
				id: "fees",
				label: "Documentation and allocation fees confirmed at point of sale",
			},
			{ id: "diaspora", label: "Diaspora-friendly payment process" },
		],
		amenities: [
			{ id: "security", label: "24/7 security", icon: "shield-check" },
			{ id: "housekeeping", label: "Serviced housekeeping", icon: "sparkles" },
			{ id: "internet", label: "High-speed internet", icon: "wifi" },
			{ id: "backup-power", label: "Backup power", icon: "battery-charging" },
			{ id: "elevator", label: "Elevator access", icon: "elevator" },
			{ id: "fitted-kitchen", label: "Fitted kitchen", icon: "chef-hat" },
			{ id: "smart-access", label: "Smart access", icon: "fingerprint" },
			{ id: "parking", label: "Dedicated parking", icon: "parking-circle" },
			{ id: "generator", label: "Generator backup", icon: "zap" },
			{
				id: "water-treatment",
				label: "Water treatment system",
				icon: "filter",
			},
		],
		media: [
			{
				id: "jimo-residences-exterior",
				type: "image",
				src: "https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=1200&q=80",
				alt: "Jimo Residences Yaba apartment building exterior",
			},
			{
				id: "jimo-residences-living-room",
				type: "image",
				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
				alt: "Living room interior representative of Jimo Residences Yaba",
			},
			{
				id: "jimo-residences-lounge",
				type: "image",
				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
				alt: "Lounge interior representative of Jimo Residences Yaba",
			},
		],
		contactCtaTitle: "Reserve your unit at Jimo Residences Yaba",
		contactCtaDescription:
			"Speak with our team to confirm pricing, availability, and the shortlet management plan.",
	},
	"yaba-hospitality-hub": {
		...getSummary("yaba-hospitality-hub"),
		categoryLabel: "Hospitality",
		facts: [
			{ label: "Location", value: "Yaba, Lagos Mainland" },
			{ label: "Status", value: "Concept" },
			{ label: "Project Type", value: "Hospitality-Led Real Estate" },
			{
				label: "Unit Types",
				value: "Guest Suite, Serviced Studio, Penthouse Suite",
			},
			{ label: "Starting Price", value: "Pricing to be announced" },
			{ label: "Delivery", value: "Coming Soon" },
			{ label: "Title", value: "To be confirmed" },
		],
		overview: [
			"Yaba Hospitality Hub is an integrated concept development combining serviced apartments, guest suites, restaurant space, and lifestyle amenities in one address.",
			"The development is designed for investors and operators seeking exposure to Lagos's growing hospitality and short-stay accommodation market.",
		],
		units: [
			{
				id: "guest-suite",
				name: "Guest Suite",
				icon: "home",
				priceLabel: "Pricing Coming Soon",
				availabilityLabel: "Coming Soon",
			},
			{
				id: "serviced-studio",
				name: "Serviced Studio",
				icon: "home",
				priceLabel: "Pricing Coming Soon",
				availabilityLabel: "Coming Soon",
			},
			{
				id: "penthouse-suite",
				name: "Penthouse Suite",
				icon: "building",
				priceLabel: "Pricing Coming Soon",
				availabilityLabel: "Coming Soon",
			},
		],
		investmentHighlights: [
			{
				id: "mixed-use",
				label: "Mixed-use hospitality and residential concept",
			},
			{
				id: "amenities",
				label: "Restaurant and lifestyle amenity space included",
			},
			{
				id: "corridor",
				label: "Positioned in a high-demand Yaba commercial corridor",
			},
			{ id: "early-access", label: "Early registration access for investors" },
			{
				id: "operators",
				label: "Suitable for operators and passive investors",
			},
		],
		paymentPlan: [
			{
				id: "structure",
				label: "Payment structure to be confirmed at pre-launch",
			},
			{
				id: "priority",
				label: "Early registration may qualify for priority allocation",
			},
			{
				id: "documentation",
				label: "Documentation requirements to be announced",
			},
			{ id: "diaspora", label: "Diaspora-friendly process expected" },
		],
		amenities: [
			{
				id: "restaurant",
				label: "Restaurant & lounge",
				icon: "utensils-crossed",
			},
			{ id: "reception", label: "Guest reception", icon: "bell-ring" },
			{ id: "housekeeping", label: "Housekeeping service", icon: "sparkles" },
			{ id: "backup-power", label: "Backup power", icon: "battery-charging" },
			{ id: "security", label: "24/7 security", icon: "shield-check" },
			{ id: "smart-access", label: "Smart access", icon: "fingerprint" },
			{ id: "elevator", label: "Elevator access", icon: "elevator" },
			{ id: "parking", label: "Parking", icon: "parking-circle" },
			{ id: "generator", label: "Generator backup", icon: "zap" },
		],
		media: [
			{
				id: "yaba-hub-exterior",
				type: "image",
				src: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
				alt: "Yaba Hospitality Hub building facade",
			},
			{
				id: "yaba-hub-living-room",
				type: "image",
				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
				alt: "Living room interior representative of Yaba Hospitality Hub suites",
			},
			{
				id: "yaba-hub-lounge",
				type: "image",
				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
				alt: "Lounge interior representative of Yaba Hospitality Hub suites",
			},
		],
		contactCtaTitle: "Be the first to know about Yaba Hospitality Hub",
		contactCtaDescription:
			"Register your interest to receive pricing, unit allocation, and launch updates as soon as they are available.",
	},
};

export function getProjectDetail(slug: string): ProjectDetail | undefined {
	return projectDetails[slug];
}

export function getAllProjectSlugs(): string[] {
	return Object.keys(projectDetails);
}