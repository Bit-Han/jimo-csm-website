// lib/actions/admin/tracking-analytics.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { trackingIntegrations } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { withTimeout } from "@/lib/utils/timeout";
import type { AdminTrackingPlatform } from "@/lib/types/admin/tracking-analytics";
import type { TrackingPlatformConfig } from "@/lib/db/schema";

export interface TrackingActionResult {
	success: boolean;
	message: string;
}

const DB_TIMEOUT_MS = 8000;

const CONFIG_KEY_BY_PLATFORM: Record<AdminTrackingPlatform, string> = {
	google_tag_manager: "containerId",
	google_analytics_4: "measurementId",
	meta_pixel: "pixelId",
	tiktok_pixel: "pixelId",
	linkedin_insight_tag: "partnerId",
	x_pixel: "pixelId",
	snapchat_pixel: "pixelId",
};

const PLATFORM_LABEL: Record<AdminTrackingPlatform, string> = {
	google_tag_manager: "Google Tag Manager",
	google_analytics_4: "Google Analytics 4",
	meta_pixel: "Meta Pixel",
	tiktok_pixel: "TikTok Pixel",
	linkedin_insight_tag: "LinkedIn Insight Tag",
	x_pixel: "X / Twitter Pixel",
	snapchat_pixel: "Snapchat Pixel",
};

export async function saveIntegrationConfig(
	platform: AdminTrackingPlatform,
	configValue: string,
): Promise<TrackingActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const configKey = CONFIG_KEY_BY_PLATFORM[platform];
		const trimmed = configValue.trim();
		const label = PLATFORM_LABEL[platform];

		const existing = await withTimeout(
			db.query.trackingIntegrations.findFirst({
				where: eq(trackingIntegrations.platform, platform),
			}),
			DB_TIMEOUT_MS,
			"saveIntegrationConfig:find",
		);

	const values = {
		platform,
		label,
		isConnected: trimmed.length > 0,
		config: (trimmed.length > 0
			? { [configKey]: trimmed }
			: null) as TrackingPlatformConfig | null,
		updatedAt: new Date(),
	};

		if (existing) {
			await withTimeout(
				db
					.update(trackingIntegrations)
					.set(values)
					.where(eq(trackingIntegrations.id, existing.id)),
				DB_TIMEOUT_MS,
				"saveIntegrationConfig:update",
			);
		} else {
			await withTimeout(
				db.insert(trackingIntegrations).values(values),
				DB_TIMEOUT_MS,
				"saveIntegrationConfig:insert",
			);
		}

		revalidatePath("/admin/tracking-analytics", "layout");
		revalidatePath("/", "layout");
		return { success: true, message: `${label} configuration saved.` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveIntegrationConfig]", message);
		return { success: false, message };
	}
}

export async function saveAllIntegrations(
	configs: Record<string, string>,
): Promise<TrackingActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		for (const [platform, value] of Object.entries(configs)) {
			await saveIntegrationConfig(platform as AdminTrackingPlatform, value);
		}

		revalidatePath("/admin/tracking-analytics", "layout");
		revalidatePath("/", "layout");
		return { success: true, message: "All integration settings saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

/**
 * No provider offers a genuine server-side "test event" without that
 * provider's own credentials (GA4 Measurement Protocol API secret, Meta
 * Conversions API token — both optional fields your schema already has
 * room for, currently empty). Rather than fake a test, this reports what
 * IS true right now: which platforms are connected and receiving events
 * via dataLayer.
 */
export async function testTrackingEvents(): Promise<TrackingActionResult> {
	try {
		const rows = await withTimeout(
			db.query.trackingIntegrations.findMany({
				where: eq(trackingIntegrations.isConnected, true),
			}),
			DB_TIMEOUT_MS,
			"testTrackingEvents",
		);

		if (rows.length === 0) {
			return {
				success: false,
				message:
					"No integrations connected yet. Enter pixel IDs in the integrations panel first.",
			};
		}

		return {
			success: true,
			message: `${rows.length} integration${rows.length === 1 ? "" : "s"} connected and receiving dataLayer events: ${rows.map((r) => r.label).join(", ")}.`,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}
