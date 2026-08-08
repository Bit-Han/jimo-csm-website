// // lib/db/queries/tracking-analytics.ts — full file, replace as-is
import { and, count, desc, gte, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { trackingEventLogs, trackingEventDestinations } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import type {
	AdminTrackingEventRow,
	AdminTrackingIntegration,
	AdminTrackingPlatform,
	ConversionEventBar,
	TrackingStatCard,
} from "@/lib/types/admin/tracking-analytics";

const DB_TIMEOUT_MS = 8000;

const PLATFORM_LABELS: Record<AdminTrackingPlatform, string> = {
	google_tag_manager: "GTM",
	google_analytics_4: "GA4",
	meta_pixel: "Meta",
	tiktok_pixel: "TikTok",
	linkedin_insight_tag: "LinkedIn",
	x_pixel: "X",
	snapchat_pixel: "Snapchat",
};

const INTEGRATION_UI_META: Record<
	AdminTrackingPlatform,
	{
		label: string;
		configKey: string;
		configLabel: string;
		configPlaceholder: string;
	}
> = {
	google_tag_manager: {
		label: "Google Tag Manager",
		configKey: "containerId",
		configLabel: "Container ID",
		configPlaceholder: "GTM-XXXXXXX",
	},
	google_analytics_4: {
		label: "Google Analytics 4",
		configKey: "measurementId",
		configLabel: "Measurement ID",
		configPlaceholder: "G-XXXXXXXXXX",
	},
	meta_pixel: {
		label: "Meta Pixel",
		configKey: "pixelId",
		configLabel: "Pixel ID",
		configPlaceholder: "1234567890123456",
	},
	tiktok_pixel: {
		label: "TikTok Pixel",
		configKey: "pixelId",
		configLabel: "Pixel ID",
		configPlaceholder: "CXXXXXXXXXXXXXXXXXXXXXXXXXX",
	},
	linkedin_insight_tag: {
		label: "LinkedIn Insight Tag",
		configKey: "partnerId",
		configLabel: "Partner ID",
		configPlaceholder: "1234567",
	},
	x_pixel: {
		label: "X / Twitter Pixel",
		configKey: "pixelId",
		configLabel: "Pixel ID",
		configPlaceholder: "o1234",
	},
	snapchat_pixel: {
		label: "Snapchat Pixel",
		configKey: "pixelId",
		configLabel: "Pixel ID",
		configPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	},
};

function pctChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

const EVENT_CARDS = [
	{ id: "page-views", label: "Page Views", eventName: "landing_page_view" },
	{ id: "form-submits", label: "Form Submits", eventName: "form_submit" },
	{
		id: "brochure-leads",
		label: "Brochure Leads",
		eventName: "brochure_form_submit",
	},
	{
		id: "whatsapp-clicks",
		label: "WhatsApp Clicks",
		eventName: "whatsapp_click",
	},
] as const;

export async function getTrackingStatCards(): Promise<TrackingStatCard[]> {
	console.info("[admin:getTrackingStatCards] Loading tracking stat cards");

	try {
		const now = Date.now();
		const periodStart = new Date(now - 30 * 24 * 60 * 60 * 1000);
		const previousStart = new Date(now - 60 * 24 * 60 * 60 * 1000);

		const [currentRows, previousRows] = await Promise.all([
			withTimeout(
				db
					.select({ eventName: trackingEventLogs.eventName, count: count() })
					.from(trackingEventLogs)
					.where(gte(trackingEventLogs.createdAt, periodStart))
					.groupBy(trackingEventLogs.eventName),
				DB_TIMEOUT_MS,
				"getTrackingStatCards:current",
			),
			withTimeout(
				db
					.select({ eventName: trackingEventLogs.eventName, count: count() })
					.from(trackingEventLogs)
					.where(
						and(
							gte(trackingEventLogs.createdAt, previousStart),
							lt(trackingEventLogs.createdAt, periodStart),
						),
					)
					.groupBy(trackingEventLogs.eventName),
				DB_TIMEOUT_MS,
				"getTrackingStatCards:previous",
			),
		]);

		console.info(
			`[admin:getTrackingStatCards] Loaded ${currentRows.length} current and ${previousRows.length} previous event groups`,
		);

		function countFor(
			rows: { eventName: string; count: number }[],
			eventName: string,
		): number {
			return rows.find((r) => r.eventName === eventName)?.count ?? 0;
		}

		return EVENT_CARDS.map((c) => {
			const current = countFor(currentRows, c.eventName);
			const previous = countFor(previousRows, c.eventName);
			return {
				id: c.id,
				label: c.label,
				value: current,
				changePercent: pctChange(current, previous),
			};
		});
	} catch (error) {
		console.error(
			"[admin:getTrackingStatCards] Operational failure or timeout:",
			error,
		);
		// Return safe UI fallbacks with 0 metrics to keep the page alive
		return EVENT_CARDS.map((c) => ({
			id: c.id,
			label: c.label,
			value: 0,
			changePercent: 0,
		}));
	}
}

export async function getConversionEventBars(): Promise<ConversionEventBar[]> {
	console.info("[admin:getConversionEventBars] Loading conversion event bars");

	try {
		const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

		const rows = await withTimeout(
			db
				.select({ eventName: trackingEventLogs.eventName, count: count() })
				.from(trackingEventLogs)
				.where(gte(trackingEventLogs.createdAt, periodStart))
				.groupBy(trackingEventLogs.eventName)
				.orderBy(desc(count())),
			DB_TIMEOUT_MS,
			"getConversionEventBars",
		);

		console.info(
			`[admin:getConversionEventBars] Loaded ${rows.length} conversion event groups`,
		);

		const total = rows.reduce((sum, r) => sum + r.count, 0);

		return rows.map((r) => ({
			id: r.eventName,
			eventName: r.eventName,
			count: r.count,
			percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
		}));
	} catch (error) {
		console.error(
			"[admin:getConversionEventBars] Operational failure or timeout:",
			error,
		);
		return []; // Return an empty bar list safely
	}
}

export async function getAdminTrackingIntegrations(): Promise<
	AdminTrackingIntegration[]
> {
	console.info(
		"[admin:getAdminTrackingIntegrations] Loading tracking integrations",
	);

	try {
		const rows = await withTimeout(
			db.query.trackingIntegrations.findMany(),
			DB_TIMEOUT_MS,
			"getAdminTrackingIntegrations",
		);

		console.info(
			`[admin:getAdminTrackingIntegrations] Loaded ${rows.length} tracking integration rows`,
		);

		const byPlatform = new Map(rows.map((r) => [r.platform, r]));

		return (Object.keys(INTEGRATION_UI_META) as AdminTrackingPlatform[]).map(
			(platform) => {
				const meta = INTEGRATION_UI_META[platform];
				const dbRow = byPlatform.get(platform);
				const currentValue =
					dbRow?.config && typeof dbRow.config === "object"
						? ((dbRow.config as unknown as Record<string, string>)[
								meta.configKey
							] ?? "")
						: "";

				return {
					platform,
					label: meta.label,
					isConnected: dbRow?.isConnected ?? false,
					configKey: meta.configKey,
					configLabel: meta.configLabel,
					configPlaceholder: meta.configPlaceholder,
					currentValue,
				};
			},
		);
	} catch (error) {
		console.error(
			"[admin:getAdminTrackingIntegrations] Operational failure or timeout:",
			error,
		);
		// Return empty structural metadata so your forms don't crash rendering
		return (Object.keys(INTEGRATION_UI_META) as AdminTrackingPlatform[]).map(
			(platform) => {
				const meta = INTEGRATION_UI_META[platform];
				return {
					platform,
					label: meta.label,
					isConnected: false,
					configKey: meta.configKey,
					configLabel: meta.configLabel,
					configPlaceholder: meta.configPlaceholder,
					currentValue: "",
				};
			},
		);
	}
}

export async function getAdminTrackingEventRows(): Promise<
	AdminTrackingEventRow[]
> {
	console.info("[admin:getAdminTrackingEventRows] Loading tracking event rows");

	try {
		const rows = await withTimeout(
			db.query.trackingEvents.findMany({
				orderBy: (te, { asc }) => [asc(te.eventName)],
			}),
			DB_TIMEOUT_MS,
			"getAdminTrackingEventRows:events",
		);

		const destinationRows = await withTimeout(
			db.select().from(trackingEventDestinations),
			DB_TIMEOUT_MS,
			"getAdminTrackingEventRows:destinations",
		);

		console.info(
			`[admin:getAdminTrackingEventRows] Loaded ${rows.length} tracking events and ${destinationRows.length} destinations`,
		);

		return rows.map((event) => {
			const destinations = destinationRows
				.filter((d) => d.eventId === event.id)
				.map((d) => PLATFORM_LABELS[d.platform as AdminTrackingPlatform])
				.join(" · ");

			return {
				id: event.id,
				eventName: event.eventName,
				trigger: event.trigger,
				destinations: destinations || "—",
				status: event.status as AdminTrackingEventRow["status"],
				category: event.category as AdminTrackingEventRow["category"],
			};
		});
	} catch (error) {
		console.error(
			"[admin:getAdminTrackingEventRows] Operational failure or timeout:",
			error,
		);
		return []; // Return empty table layout
	}
}
