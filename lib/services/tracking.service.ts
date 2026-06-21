// lib/services/tracking.service.ts
import { db } from "@/lib/db";
import {
	trackingEvents,
	trackingIntegrations,
	pageViewStats,
} from "@/lib/db/schema";
import { eq, desc, sum, sql } from "drizzle-orm";
import type { TrackingEvent, TrackingIntegration } from "@/lib/types";

export async function getTrackingOverview() {
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

	const [stats] = await db
		.select({
			pageViews: sql<number>`COALESCE(SUM(views), 0)::int`,
			formSubmits: sql<number>`COALESCE(SUM(form_submits), 0)::int`,
			brochureLeads: sql<number>`COALESCE(SUM(brochure_leads), 0)::int`,
			whatsappClicks: sql<number>`COALESCE(SUM(whatsapp_clicks), 0)::int`,
			phoneClicks: sql<number>`COALESCE(SUM(phone_clicks), 0)::int`,
		})
		.from(pageViewStats)
		.where(sql`date >= ${thirtyDaysAgo}`);

	const events = await db
		.select()
		.from(trackingEvents)
		.orderBy(desc(trackingEvents.count30d));

	const integrations = await db.select().from(trackingIntegrations);

	return { stats, events, integrations };
}

export async function getTrackingIntegrations(): Promise<
	TrackingIntegration[]
> {
	return db.select().from(trackingIntegrations);
}

export async function upsertTrackingIntegration(input: {
	name: TrackingIntegration["name"];
	trackingId?: string;
	status: TrackingIntegration["status"];
}): Promise<TrackingIntegration> {
	const existing = await db
		.select()
		.from(trackingIntegrations)
		.where(eq(trackingIntegrations.name, input.name))
		.limit(1);

	if (existing[0]) {
		const [updated] = await db
			.update(trackingIntegrations)
			.set({ ...input, updatedAt: new Date() })
			.where(eq(trackingIntegrations.name, input.name))
			.returning();
		return updated;
	}

	const [created] = await db
		.insert(trackingIntegrations)
		.values(input)
		.returning();
	return created;
}

export async function getTrackingEvents(): Promise<TrackingEvent[]> {
	return db
		.select()
		.from(trackingEvents)
		.orderBy(desc(trackingEvents.count30d));
}

export async function upsertTrackingEvent(input: {
	name: string;
	trigger: string;
	destinations: string[];
	status: TrackingEvent["status"];
	category: TrackingEvent["category"];
}): Promise<TrackingEvent> {
	const existing = await db
		.select()
		.from(trackingEvents)
		.where(eq(trackingEvents.name, input.name))
		.limit(1);

	if (existing[0]) {
		const [updated] = await db
			.update(trackingEvents)
			.set({ ...input, updatedAt: new Date() })
			.where(eq(trackingEvents.name, input.name))
			.returning();
		return updated;
	}

	const [created] = await db.insert(trackingEvents).values(input).returning();
	return created;
}
