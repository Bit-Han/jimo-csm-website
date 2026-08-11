
// lib/tracking/render-scripts.tsx
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trackingIntegrations } from "@/lib/db/schema";
import type {
	GtmConfig,
	Ga4Config,
	MetaPixelConfig,
	TikTokPixelConfig,
	LinkedInInsightConfig,
	XPixelConfig,
	SnapchatPixelConfig,
} from "@/lib/db/schema";

export interface ResolvedTrackingConfig {
	gtm: GtmConfig | null;
	ga4: Ga4Config | null;
	meta: MetaPixelConfig | null;
	tiktok: TikTokPixelConfig | null;
	linkedin: LinkedInInsightConfig | null;
	x: XPixelConfig | null;
	snapchat: SnapchatPixelConfig | null;
}

const EMPTY_TRACKING_CONFIG: ResolvedTrackingConfig = {
	gtm: null,
	ga4: null,
	meta: null,
	tiktok: null,
	linkedin: null,
	x: null,
	snapchat: null,
};

/**
 * Runs from the ROOT layout — every page, public and admin, renders
 * through it. Pixel scripts are cosmetic/optional; this must never be
 * able to take the whole site down. Any DB failure here is caught and
 * logged server-side, and the page renders with zero pixel scripts
 * instead of crashing outright.
 */
export const getResolvedTrackingConfig = cache(
	async (): Promise<ResolvedTrackingConfig> => {
		try {
			const rows = await db.query.trackingIntegrations.findMany({
				where: eq(trackingIntegrations.isConnected, true),
			});

			const byPlatform = new Map(rows.map((r) => [r.platform, r.config]));

			return {
				gtm: (byPlatform.get("google_tag_manager") as GtmConfig) ?? null,
				ga4: (byPlatform.get("google_analytics_4") as Ga4Config) ?? null,
				meta: (byPlatform.get("meta_pixel") as MetaPixelConfig) ?? null,
				tiktok: (byPlatform.get("tiktok_pixel") as TikTokPixelConfig) ?? null,
				linkedin:
					(byPlatform.get("linkedin_insight_tag") as LinkedInInsightConfig) ??
					null,
				x: (byPlatform.get("x_pixel") as XPixelConfig) ?? null,
				snapchat: (byPlatform.get("snapchat_pixel") as SnapchatPixelConfig) ?? null,
			};
		} catch (error) {
			console.error(
				"[getResolvedTrackingConfig] failed — rendering with no pixels:",
				error,
			);
			return EMPTY_TRACKING_CONFIG;
		}
	},
);