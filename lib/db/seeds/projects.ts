import { db } from "../index";
import {
	projectAmenities,
	projectCategories,
	projectChecklistItems,
	projectFacts,
	projectMedia,
	projectTags,
	projectUnits,
	projects,
} from "../schema";

export async function seedProjects() {
	// Insert base project rows
	const insertedProjects = await db
		.insert(projects)
		.values([
			{
				slug: "vatican-court",
				name: "Vatican Court",
				location: "Akoka, Yaba",
				status: "completed",
				statusLabel: "Completed",
				categoryLabel: "Residential",
				developerLabel: "Jimo Development",
				typeLabel: "Premium Residence",
				description:
					"Spacious 3-bedroom apartments with BQ, secure access, quality finishing, and practical amenities for modern family living and long-term value.",
				overview: [
					"Vatican Court is a completed premium residential development in Akoka, Yaba, offering spacious 3-bedroom apartments with BQ, quality finishing, secure access, parking, and essential infrastructure for comfortable urban living.",
					"The project is positioned for buyers and investors who want practical design, strong location value, and a credible development process.",
				],
				coverImageSrc:
					"https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
				coverImageAlt:
					"Modern residential apartment building exterior with balconies, representing Vatican Court",
				contactCtaTitle: "Secure your interest in Vatican Court",
				contactCtaDescription:
					"Speak with our team to confirm price, availability, inspection dates, payment plan and documentation details.",
				publishStatus: "published",
				featured: true,
			},
			{
				slug: "jimo-residences-yaba",
				name: "Jimo Residences Yaba",
				location: "Yaba",
				status: "under-development",
				statusLabel: "Under-Development",
				categoryLabel: "Residential & Hospitality",
				developerLabel: "Jimo Development",
				typeLabel: "Serviced Apartment",
				description:
					"A hospitality-style residential development for investors, young professionals, corporate guests, and diaspora visitors seeking better value, comfort, and management.",
				overview: [
					"Jimo Residences Yaba is a hospitality-style residential development in the heart of Yaba, Lagos Mainland, offering studio, one-bedroom, and penthouse units designed for investors, young professionals, corporate guests, and diaspora visitors.",
					"The development supports both long-term residency and professionally managed shortlet income, with an estimated rental yield of 12 to 18 percent.",
				],
				coverImageSrc:
					"https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=1200&q=80",
				coverImageAlt:
					"Modern apartment building with large windows, representing Jimo Residences Yaba",
				contactCtaTitle: "Reserve your unit at Jimo Residences Yaba",
				contactCtaDescription:
					"Speak with our team to confirm pricing, availability, and the shortlet management plan.",
				publishStatus: "published",
				featured: true,
			},
			{
				slug: "yaba-hospitality-hub",
				name: "Yaba Hospitality Hub",
				location: "Yaba",
				status: "under-development",
				statusLabel: "Under-Development",
				categoryLabel: "Hospitality",
				developerLabel: "Jimo Development",
				typeLabel: "Hospitality Concept",
				description:
					"An integrated development combining serviced apartments, guest suites, restaurant space, lifestyle amenities, and investor-focused real estate value.",
				overview: [
					"Yaba Hospitality Hub is an integrated concept development combining serviced apartments, guest suites, restaurant space, and lifestyle amenities in one address.",
					"The development is designed for investors and operators seeking exposure to Lagos's growing hospitality and short-stay accommodation market.",
				],
				coverImageSrc:
					"https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
				coverImageAlt:
					"Modern apartment building facade, representing Yaba Hospitality Hub",
				contactCtaTitle: "Be the first to know about Yaba Hospitality Hub",
				contactCtaDescription:
					"Register your interest to receive pricing, unit allocation, and launch updates as soon as they are available.",
				publishStatus: "published",
				featured: true,
			},
		])
		.onConflictDoNothing()
		.returning({ id: projects.id, slug: projects.slug });

	if (insertedProjects.length === 0) {
		console.log("✓ Projects already seeded — skipping related rows.");
		return;
	}

	const bySlug = Object.fromEntries(
		insertedProjects.map((p) => [p.slug, p.id]),
	);

	const vId = bySlug["vatican-court"]!;
	const jId = bySlug["jimo-residences-yaba"]!;
	const yId = bySlug["yaba-hospitality-hub"]!;

	// ── Categories ──────────────────────────────────────────────────────────
	await db.insert(projectCategories).values([
		{ projectId: vId, category: "residential" },
		{ projectId: jId, category: "residential" },
		{ projectId: jId, category: "hospitality" },
		{ projectId: yId, category: "hospitality" },
	]);

	// ── Tags ────────────────────────────────────────────────────────────────
	await db.insert(projectTags).values([
		{ projectId: vId, label: "Residential", position: 0 },
		{ projectId: vId, label: "Confirm Current Price", position: 1 },
		{
			projectId: jId,
			label: "Serviced Apartment / Residential Investment",
			position: 0,
		},
		{ projectId: jId, label: "Starting Price Coming Soon", position: 1 },
		{ projectId: yId, label: "Hospitality-Led Real Estate", position: 0 },
		{ projectId: yId, label: "Coming Soon", position: 1 },
	]);

	// ── Facts ────────────────────────────────────────────────────────────────
	await db.insert(projectFacts).values([
		// Vatican Court
		{
			projectId: vId,
			label: "Location",
			value: "32 Sholanke Street, Akoka, Yaba, Lagos",
			position: 0,
		},
		{ projectId: vId, label: "Status", value: "Completed", position: 1 },
		{
			projectId: vId,
			label: "Project Type",
			value: "Residential",
			position: 2,
		},
		{
			projectId: vId,
			label: "Unit Types",
			value: "3-Bedroom Apartment + BQ",
			position: 3,
		},
		{
			projectId: vId,
			label: "Starting Price",
			value: "Confirm Current Price",
			position: 4,
		},
		{ projectId: vId, label: "Delivery", value: "Completed", position: 5 },
		{ projectId: vId, label: "Title", value: "C of O", position: 6 },
		// Jimo Residences
		{
			projectId: jId,
			label: "Location",
			value: "Yaba, Lagos Mainland",
			position: 0,
		},
		{
			projectId: jId,
			label: "Status",
			value: "Under-development",
			position: 1,
		},
		{
			projectId: jId,
			label: "Project Type",
			value: "Shortlet Apartments",
			position: 2,
		},
		{
			projectId: jId,
			label: "Unit Types",
			value: "Studio, 1-Bedroom Apartment, 1-Bedroom Penthouse",
			position: 3,
		},
		{
			projectId: jId,
			label: "Starting Price",
			value: "From ₦65,000,000",
			position: 4,
		},
		{ projectId: jId, label: "Delivery", value: "Q4 2026", position: 5 },
		{ projectId: jId, label: "Title", value: "C of O", position: 6 },
		// Yaba Hub
		{
			projectId: yId,
			label: "Location",
			value: "Yaba, Lagos Mainland",
			position: 0,
		},
		{ projectId: yId, label: "Status", value: "Concept", position: 1 },
		{
			projectId: yId,
			label: "Project Type",
			value: "Hospitality-Led Real Estate",
			position: 2,
		},
		{
			projectId: yId,
			label: "Unit Types",
			value: "Guest Suite, Serviced Studio, Penthouse Suite",
			position: 3,
		},
		{
			projectId: yId,
			label: "Starting Price",
			value: "Pricing to be announced",
			position: 4,
		},
		{ projectId: yId, label: "Delivery", value: "Coming Soon", position: 5 },
		{ projectId: yId, label: "Title", value: "To be confirmed", position: 6 },
	]);

	// ── Units ────────────────────────────────────────────────────────────────
	await db.insert(projectUnits).values([
		// Vatican Court
		{
			projectId: vId,
			name: "3-Bedroom Apartment + BQ",
			icon: "home",
			priceLabel: "Confirm Current Price",
			availabilityLabel: "Confirm Current Availability",
			position: 0,
		},
		// Jimo Residences
		{
			projectId: jId,
			name: "Studio Apartment",
			icon: "home",
			priceLabel: "From ₦65,000,000",
			availabilityLabel: "10 Available",
			position: 0,
		},
		{
			projectId: jId,
			name: "1-Bedroom Apartment",
			icon: "home",
			priceLabel: "From ₦100,000,000",
			availabilityLabel: "22 Available",
			position: 1,
		},
		{
			projectId: jId,
			name: "1-Bedroom Penthouse",
			icon: "building",
			priceLabel: "From ₦110,000,000",
			availabilityLabel: "4 Available",
			position: 2,
		},
		// Yaba Hub
		{
			projectId: yId,
			name: "Guest Suite",
			icon: "home",
			priceLabel: "Pricing Coming Soon",
			availabilityLabel: "Coming Soon",
			position: 0,
		},
		{
			projectId: yId,
			name: "Serviced Studio",
			icon: "home",
			priceLabel: "Pricing Coming Soon",
			availabilityLabel: "Coming Soon",
			position: 1,
		},
		{
			projectId: yId,
			name: "Penthouse Suite",
			icon: "building",
			priceLabel: "Pricing Coming Soon",
			availabilityLabel: "Coming Soon",
			position: 2,
		},
	]);

	// ── Checklist items (investment highlights + payment plan) ────────────────
	await db.insert(projectChecklistItems).values([
		// Vatican Court — highlights
		{
			projectId: vId,
			kind: "investment_highlight",
			label: "Completed property with immediate ownership potential",
			position: 0,
		},
		{
			projectId: vId,
			kind: "investment_highlight",
			label: "Located in Akoka, Yaba, a strong residential and rental corridor",
			position: 1,
		},
		{
			projectId: vId,
			kind: "investment_highlight",
			label: "Functional 3-bedroom + BQ layout",
			position: 2,
		},
		{
			projectId: vId,
			kind: "investment_highlight",
			label: "C of O title",
			position: 3,
		},
		{
			projectId: vId,
			kind: "investment_highlight",
			label: "Suitable for homeowners and rental investors",
			position: 4,
		},
		// Vatican Court — payment plan
		{
			projectId: vId,
			kind: "payment_plan",
			label: "Outright purchase available",
			position: 0,
		},
		{
			projectId: vId,
			kind: "payment_plan",
			label: "Flexible payment may be available for qualified buyers",
			position: 1,
		},
		{
			projectId: vId,
			kind: "payment_plan",
			label: "Documentation fee to be confirmed by sales team",
			position: 2,
		},
		{
			projectId: vId,
			kind: "payment_plan",
			label: "Mortgage option to be confirmed before publishing",
			position: 3,
		},
		// Jimo Residences — highlights
		{
			projectId: jId,
			kind: "investment_highlight",
			label: "Hospitality-managed shortlet income potential",
			position: 0,
		},
		{
			projectId: jId,
			kind: "investment_highlight",
			label: "Prime Yaba location with strong commercial and academic demand",
			position: 1,
		},
		{
			projectId: jId,
			kind: "investment_highlight",
			label: "Estimated rental yield of 12 to 18 percent",
			position: 2,
		},
		{
			projectId: jId,
			kind: "investment_highlight",
			label: "Flexible unit mix: Studio, 1-Bedroom Apartment, and Penthouse",
			position: 3,
		},
		// Jimo Residences — payment plan
		{
			projectId: jId,
			kind: "payment_plan",
			label: "Outright purchase available",
			position: 0,
		},
		{
			projectId: jId,
			kind: "payment_plan",
			label: "Instalment plans available for qualified investors",
			position: 1,
		},
		{
			projectId: jId,
			kind: "payment_plan",
			label: "Documentation and allocation fees confirmed at point of sale",
			position: 2,
		},
		{
			projectId: jId,
			kind: "payment_plan",
			label: "Diaspora-friendly payment process",
			position: 3,
		},
		// Yaba Hub — highlights
		{
			projectId: yId,
			kind: "investment_highlight",
			label: "Mixed-use hospitality and residential concept",
			position: 0,
		},
		{
			projectId: yId,
			kind: "investment_highlight",
			label: "Restaurant and lifestyle amenity space included",
			position: 1,
		},
		{
			projectId: yId,
			kind: "investment_highlight",
			label: "Positioned in a high-demand Yaba commercial corridor",
			position: 2,
		},
		// Yaba Hub — payment plan
		{
			projectId: yId,
			kind: "payment_plan",
			label: "Payment structure to be confirmed at pre-launch",
			position: 0,
		},
		{
			projectId: yId,
			kind: "payment_plan",
			label: "Early registration may qualify for priority allocation",
			position: 1,
		},
	]);

	// ── Amenities ────────────────────────────────────────────────────────────
	await db.insert(projectAmenities).values([
		// Vatican Court
		{ projectId: vId, label: "CCTV security", icon: "camera", position: 0 },
		{ projectId: vId, label: "Smart access", icon: "fingerprint", position: 1 },
		{ projectId: vId, label: "Treated water", icon: "droplet", position: 2 },
		{
			projectId: vId,
			label: "Dedicated water tank",
			icon: "droplets",
			position: 3,
		},
		{ projectId: vId, label: "Fitted kitchen", icon: "chef-hat", position: 4 },
		{ projectId: vId, label: "Wardrobes", icon: "shirt", position: 5 },
		{ projectId: vId, label: "Water heaters", icon: "flame", position: 6 },
		{ projectId: vId, label: "Parking", icon: "parking-circle", position: 7 },
		{
			projectId: vId,
			label: "Solar wiring provision",
			icon: "sun",
			position: 8,
		},
		// Jimo Residences
		{
			projectId: jId,
			label: "24/7 security",
			icon: "shield-check",
			position: 0,
		},
		{
			projectId: jId,
			label: "Serviced housekeeping",
			icon: "sparkles",
			position: 1,
		},
		{ projectId: jId, label: "High-speed internet", icon: "wifi", position: 2 },
		{
			projectId: jId,
			label: "Backup power",
			icon: "battery-charging",
			position: 3,
		},
		{ projectId: jId, label: "Elevator access", icon: "elevator", position: 4 },
		{ projectId: jId, label: "Fitted kitchen", icon: "chef-hat", position: 5 },
		{ projectId: jId, label: "Smart access", icon: "fingerprint", position: 6 },
		{
			projectId: jId,
			label: "Dedicated parking",
			icon: "parking-circle",
			position: 7,
		},
		// Yaba Hub
		{
			projectId: yId,
			label: "Restaurant & lounge",
			icon: "utensils-crossed",
			position: 0,
		},
		{
			projectId: yId,
			label: "Guest reception",
			icon: "bell-ring",
			position: 1,
		},
		{
			projectId: yId,
			label: "Housekeeping service",
			icon: "sparkles",
			position: 2,
		},
		{
			projectId: yId,
			label: "Backup power",
			icon: "battery-charging",
			position: 3,
		},
		{
			projectId: yId,
			label: "24/7 security",
			icon: "shield-check",
			position: 4,
		},
		{ projectId: yId, label: "Smart access", icon: "fingerprint", position: 5 },
		{ projectId: yId, label: "Elevator access", icon: "elevator", position: 6 },
		{ projectId: yId, label: "Parking", icon: "parking-circle", position: 7 },
	]);

	// ── Media ────────────────────────────────────────────────────────────────
	await db.insert(projectMedia).values([
		// Vatican Court
		{
			projectId: vId,
			type: "image",
			cloudinaryPublicId: "placeholder-vc-exterior",
			src: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=1200&q=80",
			alt: "Vatican Court apartment building exterior",
			position: 0,
		},
		{
			projectId: vId,
			type: "image",
			cloudinaryPublicId: "placeholder-vc-living",
			src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
			alt: "Living room interior representative of Vatican Court apartments",
			position: 1,
		},
		{
			projectId: vId,
			type: "image",
			cloudinaryPublicId: "placeholder-vc-lounge",
			src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
			alt: "Lounge interior representative of Vatican Court apartments",
			position: 2,
		},
		// Jimo Residences
		{
			projectId: jId,
			type: "image",
			cloudinaryPublicId: "placeholder-jr-exterior",
			src: "https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=1200&q=80",
			alt: "Jimo Residences Yaba apartment building exterior",
			position: 0,
		},
		{
			projectId: jId,
			type: "image",
			cloudinaryPublicId: "placeholder-jr-living",
			src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
			alt: "Living room interior representative of Jimo Residences Yaba",
			position: 1,
		},
		{
			projectId: jId,
			type: "image",
			cloudinaryPublicId: "placeholder-jr-lounge",
			src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
			alt: "Lounge interior representative of Jimo Residences Yaba",
			position: 2,
		},
		// Yaba Hub
		{
			projectId: yId,
			type: "image",
			cloudinaryPublicId: "placeholder-yh-exterior",
			src: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=1200&q=80",
			alt: "Yaba Hospitality Hub building facade",
			position: 0,
		},
		{
			projectId: yId,
			type: "image",
			cloudinaryPublicId: "placeholder-yh-living",
			src: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=800&q=80",
			alt: "Living room interior representative of Yaba Hospitality Hub suites",
			position: 1,
		},
		{
			projectId: yId,
			type: "image",
			cloudinaryPublicId: "placeholder-yh-lounge",
			src: "https://images.unsplash.com/photo-1758915753332-cab59126742c?auto=format&fit=crop&w=800&q=80",
			alt: "Lounge interior representative of Yaba Hospitality Hub suites",
			position: 2,
		},
	]);

	console.log("✓ Projects seed complete.");
}
