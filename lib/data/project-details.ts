// import type { Project } from "@/lib/types/project";
// import type { ProjectDetail } from "@/lib/types/project-detail";
// import { featuredProjects } from "@/lib/data/projects";

// function getSummary(slug: string): Project {
// 	const summary = featuredProjects.find((project) => project.slug === slug);

// 	if (!summary) {
// 		throw new Error(`No summary project found for slug "${slug}"`);
// 	}

// 	return summary;
// }

// export const projectDetails: Record<string, ProjectDetail> = {
// 	"vatican-court": {
// 		...getSummary("vatican-court"),
// 		categoryLabel: "Residential",
// 		facts: [
// 			{ label: "Location", value: "32 Sholanke Street, Akoka, Yaba, Lagos" },
// 			{ label: "Status", value: "Completed" },
// 			{ label: "Project Type", value: "Residential" },
// 			{ label: "Unit Types", value: "3-Bedroom Apartment + BQ" },
// 			{ label: "Starting Price", value: "Confirm Current Price" },
// 			{ label: "Delivery", value: "Completed" },
// 			{ label: "Title", value: "C of O" },
// 		],
// 		overview: [
// 			"Vatican Court is a completed premium residential development in Akoka, Yaba, offering spacious 3-bedroom apartments with BQ, quality finishing, secure access, parking, and essential infrastructure for comfortable urban living.",
// 			"The project is positioned for buyers and investors who want practical design, strong location value, and a credible development process.",
// 		],
// 		units: [
// 			{
// 				id: "3-bedroom-bq",
// 				name: "3-Bedroom Apartment + BQ",
// 				icon: "home",
// 				priceLabel: "Confirm Current Price",
// 				availabilityLabel: "Confirm Current Availability",
// 			},
// 		],
// 		investmentHighlights: [
// 			{
// 				id: "ownership",
// 				label: "Completed property with immediate ownership potential",
// 			},
// 			{
// 				id: "location",
// 				label:
// 					"Located in Akoka, Yaba, a strong residential and rental corridor",
// 			},
// 			{ id: "layout", label: "Functional 3-bedroom + BQ layout" },
// 			{ id: "title", label: "C of O title" },
// 			{
// 				id: "suitability",
// 				label: "Suitable for homeowners and rental investors",
// 			},
// 		],
// 		paymentPlan: [
// 			{ id: "outright", label: "Outright purchase available" },
// 			{
// 				id: "flexible",
// 				label: "Flexible payment may be available for qualified buyers",
// 			},
// 			{
// 				id: "documentation",
// 				label: "Documentation fee to be confirmed by sales team",
// 			},
// 			{
// 				id: "mortgage",
// 				label: "Mortgage option to be confirmed before publishing",
// 			},
// 		],
// 		amenities: [
// 			{ id: "cctv", label: "CCTV security" },
// 			{ id: "smart-access", label: "Smart access" },
// 			{ id: "treated-water", label: "Treated water" },
// 			{ id: "water-tank", label: "Dedicated water tank" },
// 			{ id: "prepaid-water", label: "Prepaid water" },
// 			{ id: "fitted-kitchen", label: "Fitted kitchen" },
// 			{ id: "wardrobes", label: "Wardrobes" },
// 			{ id: "pop-ceiling", label: "POP ceiling" },
// 			{ id: "water-heaters", label: "Water heaters" },
// 			{ id: "parking", label: "Parking" },
// 			{ id: "solar", label: "Solar wiring provision" },
// 		],
// 		progress: [
// 			{ stage: "design", label: "Design", isComplete: true },
// 			{ stage: "approvals", label: "Approvals", isComplete: true },
// 			{ stage: "construction", label: "Construction", isComplete: true },
// 			{ stage: "finishing", label: "Finishing", isComplete: true },
// 			{ stage: "handover", label: "Handover", isComplete: true },
// 		],
// 		gallery: [
// 			{
// 				id: "vatican-court-exterior",
// 				src: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
// 				alt: "Vatican Court apartment building exterior",
// 			},
// 			{
// 				id: "vatican-court-living-room",
// 				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
// 				alt: "Living room interior representative of Vatican Court apartments",
// 			},
// 			{
// 				id: "vatican-court-lounge",
// 				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
// 				alt: "Lounge interior representative of Vatican Court apartments",
// 			},
// 		],
// 		faq: [
// 			{
// 				id: "location",
// 				question: "Where is Vatican Court located?",
// 				answer:
// 					"Vatican Court is located at 32 Sholanke Street, Akoka, Yaba, Lagos, within a well-established residential and rental corridor.",
// 			},
// 			{
// 				id: "inspection",
// 				question: "Can I inspect or register interest?",
// 				answer:
// 					"Yes. You can register your interest through this page or speak with our sales team to schedule an inspection at a convenient time.",
// 			},
// 			{
// 				id: "price",
// 				question: "Is the price final?",
// 				answer:
// 					"Pricing is subject to confirmation by our sales team. Please register your interest to receive the current price and availability.",
// 			},
// 		],
// 		contactCtaTitle: "Secure your interest in Vatican Court",
// 		contactCtaDescription:
// 			"Speak with our team to confirm price, availability, inspection dates, payment plan and documentation details.",
// 	},
// 	"jimo-residences-yaba": {
// 		...getSummary("jimo-residences-yaba"),
// 		categoryLabel: "Residential & Hospitality",
// 		facts: [
// 			{ label: "Location", value: "Yaba, Lagos Mainland" },
// 			{ label: "Status", value: "Pre-Launch" },
// 			{ label: "Project Type", value: "Shortlet Apartments" },
// 			{
// 				label: "Unit Types",
// 				value: "Studio, 1-Bedroom Apartment, 1-Bedroom Penthouse",
// 			},
// 			{ label: "Starting Price", value: "From ₦65,000,000" },
// 			{ label: "Delivery", value: "Q4 2026" },
// 			{ label: "Title", value: "C of O" },
// 		],
// 		overview: [
// 			"Jimo Residences Yaba is a hospitality-style residential development in the heart of Yaba, Lagos Mainland, offering studio, one-bedroom, and penthouse units designed for investors, young professionals, corporate guests, and diaspora visitors.",
// 			"The development supports both long-term residency and professionally managed shortlet income, with an estimated rental yield of 12 to 18 percent.",
// 		],
// 		units: [
// 			{
// 				id: "studio-apartment",
// 				name: "Studio Apartment",
// 				icon: "home",
// 				priceLabel: "From ₦65,000,000",
// 				availabilityLabel: "10 Available",
// 			},
// 			{
// 				id: "1-bedroom-apartment",
// 				name: "1-Bedroom Apartment",
// 				icon: "home",
// 				priceLabel: "From ₦100,000,000",
// 				availabilityLabel: "22 Available",
// 			},
// 			{
// 				id: "1-bedroom-penthouse",
// 				name: "1-Bedroom Penthouse",
// 				icon: "building",
// 				priceLabel: "From ₦110,000,000",
// 				availabilityLabel: "4 Available",
// 			},
// 		],
// 		investmentHighlights: [
// 			{
// 				id: "shortlet",
// 				label: "Hospitality-managed shortlet income potential",
// 			},
// 			{
// 				id: "location",
// 				label: "Prime Yaba location with strong commercial and academic demand",
// 			},
// 			{ id: "yield", label: "Estimated rental yield of 12 to 18 percent" },
// 			{
// 				id: "mix",
// 				label: "Flexible unit mix: Studio, 1-Bedroom Apartment, and Penthouse",
// 			},
// 			{
// 				id: "process",
// 				label: "Backed by a structured development and sales process",
// 			},
// 		],
// 		paymentPlan: [
// 			{ id: "outright", label: "Outright purchase available" },
// 			{
// 				id: "instalment",
// 				label: "Instalment plans available for qualified investors",
// 			},
// 			{
// 				id: "fees",
// 				label: "Documentation and allocation fees confirmed at point of sale",
// 			},
// 			{ id: "diaspora", label: "Diaspora-friendly payment process" },
// 		],
// 		amenities: [
// 			{ id: "security", label: "24/7 security" },
// 			{ id: "housekeeping", label: "Serviced housekeeping" },
// 			{ id: "internet", label: "High-speed internet" },
// 			{ id: "backup-power", label: "Backup power" },
// 			{ id: "elevator", label: "Elevator access" },
// 			{ id: "fitted-kitchen", label: "Fitted kitchen" },
// 			{ id: "smart-access", label: "Smart access" },
// 			{ id: "parking", label: "Dedicated parking" },
// 			{ id: "generator", label: "Generator backup" },
// 			{ id: "water-treatment", label: "Water treatment system" },
// 		],
// 		progress: [
// 			{ stage: "design", label: "Design", isComplete: true },
// 			{ stage: "approvals", label: "Approvals", isComplete: true },
// 			{ stage: "construction", label: "Construction", isComplete: false },
// 			{ stage: "finishing", label: "Finishing", isComplete: false },
// 			{ stage: "handover", label: "Handover", isComplete: false },
// 		],
// 		gallery: [
// 			{
// 				id: "jimo-residences-exterior",
// 				src: "https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=1200&q=80",
// 				alt: "Jimo Residences Yaba apartment building exterior",
// 			},
// 			{
// 				id: "jimo-residences-living-room",
// 				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
// 				alt: "Living room interior representative of Jimo Residences Yaba",
// 			},
// 			{
// 				id: "jimo-residences-lounge",
// 				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
// 				alt: "Lounge interior representative of Jimo Residences Yaba",
// 			},
// 		],
// 		faq: [
// 			{
// 				id: "location",
// 				question: "Where is Jimo Residences Yaba located?",
// 				answer:
// 					"The development is located in Yaba, Lagos Mainland, close to major commercial and academic hubs.",
// 			},
// 			{
// 				id: "yield",
// 				question: "What is the expected rental yield?",
// 				answer:
// 					"Estimated rental yield is between 12 and 18 percent ROI, depending on unit type and management plan.",
// 			},
// 			{
// 				id: "diaspora",
// 				question: "Can diaspora buyers purchase remotely?",
// 				answer:
// 					"Yes. Our team supports diaspora buyers with remote registration, documentation, and payment processes.",
// 			},
// 		],
// 		contactCtaTitle: "Reserve your unit at Jimo Residences Yaba",
// 		contactCtaDescription:
// 			"Speak with our team to confirm pricing, availability, and the shortlet management plan.",
// 	},
// 	"yaba-hospitality-hub": {
// 		...getSummary("yaba-hospitality-hub"),
// 		categoryLabel: "Hospitality",
// 		facts: [
// 			{ label: "Location", value: "Yaba, Lagos Mainland" },
// 			{ label: "Status", value: "Concept" },
// 			{ label: "Project Type", value: "Hospitality-Led Real Estate" },
// 			{
// 				label: "Unit Types",
// 				value: "Guest Suite, Serviced Studio, Penthouse Suite",
// 			},
// 			{ label: "Starting Price", value: "Pricing to be announced" },
// 			{ label: "Delivery", value: "Coming Soon" },
// 			{ label: "Title", value: "To be confirmed" },
// 		],
// 		overview: [
// 			"Yaba Hospitality Hub is an integrated concept development combining serviced apartments, guest suites, restaurant space, and lifestyle amenities in one address.",
// 			"The development is designed for investors and operators seeking exposure to Lagos's growing hospitality and short-stay accommodation market.",
// 		],
// 		units: [
// 			{
// 				id: "guest-suite",
// 				name: "Guest Suite",
// 				icon: "home",
// 				priceLabel: "Pricing Coming Soon",
// 				availabilityLabel: "Coming Soon",
// 			},
// 			{
// 				id: "serviced-studio",
// 				name: "Serviced Studio",
// 				icon: "home",
// 				priceLabel: "Pricing Coming Soon",
// 				availabilityLabel: "Coming Soon",
// 			},
// 			{
// 				id: "penthouse-suite",
// 				name: "Penthouse Suite",
// 				icon: "building",
// 				priceLabel: "Pricing Coming Soon",
// 				availabilityLabel: "Coming Soon",
// 			},
// 		],
// 		investmentHighlights: [
// 			{
// 				id: "mixed-use",
// 				label: "Mixed-use hospitality and residential concept",
// 			},
// 			{
// 				id: "amenities",
// 				label: "Restaurant and lifestyle amenity space included",
// 			},
// 			{
// 				id: "corridor",
// 				label: "Positioned in a high-demand Yaba commercial corridor",
// 			},
// 			{ id: "early-access", label: "Early registration access for investors" },
// 			{
// 				id: "operators",
// 				label: "Suitable for operators and passive investors",
// 			},
// 		],
// 		paymentPlan: [
// 			{
// 				id: "structure",
// 				label: "Payment structure to be confirmed at pre-launch",
// 			},
// 			{
// 				id: "priority",
// 				label: "Early registration may qualify for priority allocation",
// 			},
// 			{
// 				id: "documentation",
// 				label: "Documentation requirements to be announced",
// 			},
// 			{ id: "diaspora", label: "Diaspora-friendly process expected" },
// 		],
// 		amenities: [
// 			{ id: "restaurant", label: "Restaurant & lounge" },
// 			{ id: "reception", label: "Guest reception" },
// 			{ id: "housekeeping", label: "Housekeeping service" },
// 			{ id: "backup-power", label: "Backup power" },
// 			{ id: "security", label: "24/7 security" },
// 			{ id: "smart-access", label: "Smart access" },
// 			{ id: "elevator", label: "Elevator access" },
// 			{ id: "parking", label: "Parking" },
// 			{ id: "generator", label: "Generator backup" },
// 		],
// 		progress: [
// 			{ stage: "design", label: "Design", isComplete: false },
// 			{ stage: "approvals", label: "Approvals", isComplete: false },
// 			{ stage: "construction", label: "Construction", isComplete: false },
// 			{ stage: "finishing", label: "Finishing", isComplete: false },
// 			{ stage: "handover", label: "Handover", isComplete: false },
// 		],
// 		gallery: [
// 			{
// 				id: "yaba-hub-exterior",
// 				src: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
// 				alt: "Yaba Hospitality Hub building facade",
// 			},
// 			{
// 				id: "yaba-hub-living-room",
// 				src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
// 				alt: "Living room interior representative of Yaba Hospitality Hub suites",
// 			},
// 			{
// 				id: "yaba-hub-lounge",
// 				src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
// 				alt: "Lounge interior representative of Yaba Hospitality Hub suites",
// 			},
// 		],
// 		faq: [
// 			{
// 				id: "registration",
// 				question: "Is Yaba Hospitality Hub open for registration?",
// 				answer:
// 					"Yes. You can register your interest now to receive updates on pricing, unit allocation, and launch timing.",
// 			},
// 			{
// 				id: "investment-type",
// 				question: "What type of investment is this?",
// 				answer:
// 					"This is a hospitality-led mixed-use concept combining guest suites, serviced studios, and lifestyle amenities, suited for both residency and short-stay management.",
// 			},
// 			{
// 				id: "pricing",
// 				question: "When will pricing be available?",
// 				answer:
// 					"Pricing will be announced closer to launch. Register your interest to be notified first.",
// 			},
// 		],
// 		contactCtaTitle: "Be the first to know about Yaba Hospitality Hub",
// 		contactCtaDescription:
// 			"Register your interest to receive pricing, unit allocation, and launch updates as soon as they are available.",
// 	},
// };

// export function getProjectDetail(slug: string): ProjectDetail | undefined {
// 	return projectDetails[slug];
// }

// export function getAllProjectSlugs(): string[] {
// 	return Object.keys(projectDetails);
// }

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
			{ id: "cctv", label: "CCTV security" },
			{ id: "smart-access", label: "Smart access" },
			{ id: "treated-water", label: "Treated water" },
			{ id: "water-tank", label: "Dedicated water tank" },
			{ id: "prepaid-water", label: "Prepaid water" },
			{ id: "fitted-kitchen", label: "Fitted kitchen" },
			{ id: "wardrobes", label: "Wardrobes" },
			{ id: "pop-ceiling", label: "POP ceiling" },
			{ id: "water-heaters", label: "Water heaters" },
			{ id: "parking", label: "Parking" },
			{ id: "solar", label: "Solar wiring provision" },
		],
		progress: [
			{ stage: "design", label: "Design", isComplete: true },
			{ stage: "approvals", label: "Approvals", isComplete: true },
			{ stage: "construction", label: "Construction", isComplete: true },
			{ stage: "finishing", label: "Finishing", isComplete: true },
			{ stage: "handover", label: "Handover", isComplete: true },
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
		faq: [
			{
				id: "location",
				question: "Where is Vatican Court located?",
				answer:
					"Vatican Court is located at 32 Sholanke Street, Akoka, Yaba, Lagos, within a well-established residential and rental corridor.",
			},
			{
				id: "inspection",
				question: "Can I inspect or register interest?",
				answer:
					"Yes. You can register your interest through this page or speak with our sales team to schedule an inspection at a convenient time.",
			},
			{
				id: "price",
				question: "Is the price final?",
				answer:
					"Pricing is subject to confirmation by our sales team. Please register your interest to receive the current price and availability.",
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
			{ id: "security", label: "24/7 security" },
			{ id: "housekeeping", label: "Serviced housekeeping" },
			{ id: "internet", label: "High-speed internet" },
			{ id: "backup-power", label: "Backup power" },
			{ id: "elevator", label: "Elevator access" },
			{ id: "fitted-kitchen", label: "Fitted kitchen" },
			{ id: "smart-access", label: "Smart access" },
			{ id: "parking", label: "Dedicated parking" },
			{ id: "generator", label: "Generator backup" },
			{ id: "water-treatment", label: "Water treatment system" },
		],
		progress: [
			{ stage: "design", label: "Design", isComplete: true },
			{ stage: "approvals", label: "Approvals", isComplete: true },
			{ stage: "construction", label: "Construction", isComplete: false },
			{ stage: "finishing", label: "Finishing", isComplete: false },
			{ stage: "handover", label: "Handover", isComplete: false },
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
		faq: [
			{
				id: "location",
				question: "Where is Jimo Residences Yaba located?",
				answer:
					"The development is located in Yaba, Lagos Mainland, close to major commercial and academic hubs.",
			},
			{
				id: "yield",
				question: "What is the expected rental yield?",
				answer:
					"Estimated rental yield is between 12 and 18 percent ROI, depending on unit type and management plan.",
			},
			{
				id: "diaspora",
				question: "Can diaspora buyers purchase remotely?",
				answer:
					"Yes. Our team supports diaspora buyers with remote registration, documentation, and payment processes.",
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
			{ id: "restaurant", label: "Restaurant & lounge" },
			{ id: "reception", label: "Guest reception" },
			{ id: "housekeeping", label: "Housekeeping service" },
			{ id: "backup-power", label: "Backup power" },
			{ id: "security", label: "24/7 security" },
			{ id: "smart-access", label: "Smart access" },
			{ id: "elevator", label: "Elevator access" },
			{ id: "parking", label: "Parking" },
			{ id: "generator", label: "Generator backup" },
		],
		progress: [
			{ stage: "design", label: "Design", isComplete: false },
			{ stage: "approvals", label: "Approvals", isComplete: false },
			{ stage: "construction", label: "Construction", isComplete: false },
			{ stage: "finishing", label: "Finishing", isComplete: false },
			{ stage: "handover", label: "Handover", isComplete: false },
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
		faq: [
			{
				id: "registration",
				question: "Is Yaba Hospitality Hub open for registration?",
				answer:
					"Yes. You can register your interest now to receive updates on pricing, unit allocation, and launch timing.",
			},
			{
				id: "investment-type",
				question: "What type of investment is this?",
				answer:
					"This is a hospitality-led mixed-use concept combining guest suites, serviced studios, and lifestyle amenities, suited for both residency and short-stay management.",
			},
			{
				id: "pricing",
				question: "When will pricing be available?",
				answer:
					"Pricing will be announced closer to launch. Register your interest to be notified first.",
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