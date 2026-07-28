// lib/db/seeds/tracking.ts
import { seedDb } from "../seed-client"; // ← direct connection, not db
import { trackingEvents, trackingIntegrations, trackingEventDestinations } from "../schema";
import { db } from "../index";

export async function seedTracking() {
	// ── Integrations ──────────────────────────────────────────────────────────
	await seedDb
		.insert(trackingIntegrations)
		.values([
			{
				platform: "google_tag_manager",
				label: "Google Tag Manager",
				isConnected: false,
			},
			{
				platform: "google_analytics_4",
				label: "Google Analytics 4",
				isConnected: false,
			},
			{ platform: "meta_pixel", label: "Meta Pixel", isConnected: false },
			{ platform: "tiktok_pixel", label: "TikTok Pixel", isConnected: false },
			{
				platform: "linkedin_insight_tag",
				label: "LinkedIn Insight Tag",
				isConnected: false,
			},
			{ platform: "x_pixel", label: "X / Twitter Pixel", isConnected: false },
			{
				platform: "snapchat_pixel",
				label: "Snapchat Pixel",
				isConnected: false,
			},
		])
		.onConflictDoNothing();

	console.log("✓ Tracking integrations seeded.");

	// ── Events ────────────────────────────────────────────────────────────────
	await seedDb
		.insert(trackingEvents)
		.values([
			{
				eventName: "landing_page_view",
				trigger: "All Page Views",
				category: "awareness",
				status: "active",
			},
			{
				eventName: "form_submit",
				trigger: "Form Submitted",
				category: "lead_generation",
				status: "active",
			},
			{
				eventName: "brochure_form_submit",
				trigger: "Form Submitted (Brochure)",
				category: "lead_generation",
				status: "active",
			},
			{
				eventName: "whatsapp_click",
				trigger: "Click on WhatsApp Link",
				category: "engagement",
				status: "active",
			},
			{
				eventName: "phone_click",
				trigger: "Click on Phone Link",
				category: "engagement",
				status: "active",
			},
		])
		.onConflictDoNothing();

	// lib/db/seeds/tracking.ts — add this to the existing seedTracking() function,
	// after the trackingEvents insert, before the closing console.log
	const eventRows = await db.query.trackingEvents.findMany();
	const findEventId = (name: string) =>
		eventRows.find((e) => e.eventName === name)?.id;

	const destinationSeeds: {
		eventId: string;
		platform: "google_tag_manager" | "google_analytics_4" | "meta_pixel";
	}[] = [];

	const lpv = findEventId("landing_page_view");
	if (lpv) {
		destinationSeeds.push(
			{ eventId: lpv, platform: "google_tag_manager" },
			{ eventId: lpv, platform: "google_analytics_4" },
			{ eventId: lpv, platform: "meta_pixel" },
		);
	}

	const fs = findEventId("form_submit");
	if (fs) {
		destinationSeeds.push(
			{ eventId: fs, platform: "google_tag_manager" },
			{ eventId: fs, platform: "google_analytics_4" },
		);
	}

	const bfs = findEventId("brochure_form_submit");
	if (bfs) {
		destinationSeeds.push(
			{ eventId: bfs, platform: "google_tag_manager" },
			{ eventId: bfs, platform: "google_analytics_4" },
		);
	}

	const wc = findEventId("whatsapp_click");
	if (wc) {
		destinationSeeds.push(
			{ eventId: wc, platform: "google_tag_manager" },
			{ eventId: wc, platform: "meta_pixel" },
		);
	}

	const pc = findEventId("phone_click");
	if (pc) {
		destinationSeeds.push({ eventId: pc, platform: "google_tag_manager" });
	}

	if (destinationSeeds.length > 0) {
		await db
			.insert(trackingEventDestinations)
			.values(destinationSeeds)
			.onConflictDoNothing();
	}

	console.log("✓ Tracking event destinations seeded.");

	console.log("✓ Tracking events seeded.");
}