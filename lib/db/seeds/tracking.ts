
// import { db } from "../index";
// import {
// 	trackingEventDestinations,
// 	trackingEvents,
// 	trackingIntegrations,
// } from "../schema";

// export async function seedTracking() {
// 	  console.log("trackingEventDestinations:", trackingEventDestinations);
// 		console.log("trackingIntegrations:", trackingIntegrations);
// 		console.log("trackingEvents:", trackingEvents);
// 	// ── Integrations ──────────────────────────────────────────────────────────
// 	await db
// 		.insert(trackingIntegrations)
// 		.values([
// 			{
// 				platform: "google_tag_manager",
// 				label: "Google Tag Manager",
// 				isConnected: false,
// 			},
// 			{
// 				platform: "google_analytics_4",
// 				label: "Google Analytics 4",
// 				isConnected: false,
// 			},
// 			{ platform: "meta_pixel", label: "Meta Pixel", isConnected: false },
// 			{ platform: "tiktok_pixel", label: "TikTok Pixel", isConnected: false },
// 			{
// 				platform: "linkedin_insight_tag",
// 				label: "LinkedIn Insight Tag",
// 				isConnected: false,
// 			},
// 			{ platform: "x_pixel", label: "X / Twitter Pixel", isConnected: false },
// 			{
// 				platform: "snapchat_pixel",
// 				label: "Snapchat Pixel",
// 				isConnected: false,
// 			},
// 		])
// 		.onConflictDoNothing();

// 	// ── Events ────────────────────────────────────────────────────────────────
// 	const insertedEvents = await db
// 		.insert(trackingEvents)
// 		.values([
// 			{
// 				eventName: "landing_page_view",
// 				trigger: "All Page Views",
// 				category: "awareness",
// 				status: "active",
// 			},
// 			{
// 				eventName: "form_submit",
// 				trigger: "Form Submitted",
// 				category: "lead_generation",
// 				status: "active",
// 			},
// 			{
// 				eventName: "brochure_form_submit",
// 				trigger: "Form Submitted (Brochure)",
// 				category: "lead_generation",
// 				status: "active",
// 			},
// 			{
// 				eventName: "whatsapp_click",
// 				trigger: "Click on WhatsApp Link",
// 				category: "engagement",
// 				status: "active",
// 			},
// 			{
// 				eventName: "phone_click",
// 				trigger: "Click on Phone Link",
// 				category: "engagement",
// 				status: "active",
// 			},
// 		])
// 		.onConflictDoNothing()
// 		.returning({ id: trackingEvents.id, eventName: trackingEvents.eventName });

// 	// ── Event destinations ────────────────────────────────────────────────────
// 	// Only wire up destinations if events were actually inserted.
// 	// onConflictDoNothing means insertedEvents will be empty if rows already exist.
// 	if (insertedEvents.length > 0) {
// 		const eventMap = Object.fromEntries(
// 			insertedEvents.map((e) => [e.eventName, e.id]),
// 		);

// 		const destinations: {
// 			eventId: string;
// 			platform: (typeof trackingEventDestinations.$inferInsert)["platform"];
// 		}[] = [];

// 		if (eventMap["landing_page_view"]) {
// 			destinations.push(
// 				{
// 					eventId: eventMap["landing_page_view"]!,
// 					platform: "google_tag_manager",
// 				},
// 				{
// 					eventId: eventMap["landing_page_view"]!,
// 					platform: "google_analytics_4",
// 				},
// 				{ eventId: eventMap["landing_page_view"]!, platform: "meta_pixel" },
// 			);
// 		}
// 		if (eventMap["form_submit"]) {
// 			destinations.push(
// 				{ eventId: eventMap["form_submit"]!, platform: "google_tag_manager" },
// 				{ eventId: eventMap["form_submit"]!, platform: "google_analytics_4" },
// 			);
// 		}
// 		if (eventMap["brochure_form_submit"]) {
// 			destinations.push(
// 				{
// 					eventId: eventMap["brochure_form_submit"]!,
// 					platform: "google_tag_manager",
// 				},
// 				{
// 					eventId: eventMap["brochure_form_submit"]!,
// 					platform: "google_analytics_4",
// 				},
// 			);
// 		}
// 		if (eventMap["whatsapp_click"]) {
// 			destinations.push(
// 				{
// 					eventId: eventMap["whatsapp_click"]!,
// 					platform: "google_tag_manager",
// 				},
// 				{ eventId: eventMap["whatsapp_click"]!, platform: "meta_pixel" },
// 			);
// 		}
// 		if (eventMap["phone_click"]) {
// 			destinations.push(
// 				{ eventId: eventMap["phone_click"]!, platform: "google_tag_manager" },
// 				{ eventId: eventMap["phone_click"]!, platform: "google_analytics_4" },
// 			);
// 		}

// 		if (destinations.length > 0) {
// 			await db
// 				.insert(trackingEventDestinations)
// 				.values(destinations)
// 				.onConflictDoNothing();
// 		}
// 	}

// 	console.log("✓ Tracking seed complete.");
// }


// lib/db/seeds/tracking.ts
import { seedDb } from "../seed-client"; // ← direct connection, not db
import { trackingEvents, trackingIntegrations } from "../schema";

export async function seedTracking() {
  // ── Integrations ──────────────────────────────────────────────────────────
  await seedDb
    .insert(trackingIntegrations)
    .values([
      { platform: "google_tag_manager", label: "Google Tag Manager", isConnected: false },
      { platform: "google_analytics_4", label: "Google Analytics 4", isConnected: false },
      { platform: "meta_pixel", label: "Meta Pixel", isConnected: false },
      { platform: "tiktok_pixel", label: "TikTok Pixel", isConnected: false },
      { platform: "linkedin_insight_tag", label: "LinkedIn Insight Tag", isConnected: false },
      { platform: "x_pixel", label: "X / Twitter Pixel", isConnected: false },
      { platform: "snapchat_pixel", label: "Snapchat Pixel", isConnected: false },
    ])
    .onConflictDoNothing();

  console.log("✓ Tracking integrations seeded.");

  // ── Events ────────────────────────────────────────────────────────────────
  await seedDb
    .insert(trackingEvents)
    .values([
      { eventName: "landing_page_view", trigger: "All Page Views", category: "awareness", status: "active" },
      { eventName: "form_submit", trigger: "Form Submitted", category: "lead_generation", status: "active" },
      { eventName: "brochure_form_submit", trigger: "Form Submitted (Brochure)", category: "lead_generation", status: "active" },
      { eventName: "whatsapp_click", trigger: "Click on WhatsApp Link", category: "engagement", status: "active" },
      { eventName: "phone_click", trigger: "Click on Phone Link", category: "engagement", status: "active" },
    ])
    .onConflictDoNothing();

  console.log("✓ Tracking events seeded.");
}