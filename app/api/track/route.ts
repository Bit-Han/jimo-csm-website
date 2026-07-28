// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import { TRACKING_EVENT_NAMES } from "@/lib/constants/tracking-events";

const DB_TIMEOUT_MS = 5000;
const MAX_METADATA_ENTRIES = 10;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => null);

		if (!body || typeof body.eventName !== "string") {
			return NextResponse.json({ success: false }, { status: 400 });
		}

		// Reject anything outside the known list outright — keeps this
		// public, unauthenticated endpoint from being used to write
		// arbitrary event names into the table.
		if (!(TRACKING_EVENT_NAMES as readonly string[]).includes(body.eventName)) {
			return NextResponse.json({ success: false }, { status: 400 });
		}

		const pagePath =
			typeof body.pagePath === "string" ? body.pagePath.slice(0, 300) : "/";

		const metadata: Record<string, string> = {};
		if (body.metadata && typeof body.metadata === "object") {
			for (const [key, value] of Object.entries(body.metadata).slice(
				0,
				MAX_METADATA_ENTRIES,
			)) {
				if (typeof value === "string")
					metadata[key.slice(0, 60)] = value.slice(0, 300);
			}
		}

		await withTimeout(
			db.insert(trackingEventLogs).values({
				eventName: body.eventName,
				pagePath,
				landingPageSlug: metadata.landingPageSlug ?? null,
				projectSlug: metadata.projectSlug ?? null,
				referrer: request.headers.get("referer"),
				userAgent: request.headers.get("user-agent"),
				metadata,
			}),
			DB_TIMEOUT_MS,
			"trackEvent:insert",
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		// A tracking failure must be invisible to the caller — sendBeacon
		// callers don't inspect the response anyway. Log server-side only.
		console.error(
			"[api/track]",
			error instanceof Error ? error.message : error,
		);
		return NextResponse.json({ success: false }, { status: 200 });
	}
}
