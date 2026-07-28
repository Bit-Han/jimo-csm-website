// lib/tracking/dispatch.ts
"use client";

import type { TrackingEventName } from "@/lib/constants/tracking-events";

declare global {
	interface Window {
		dataLayer?: Record<string, unknown>[];
	}
}

/**
 * Fires a tracking event two ways:
 *  1. Pushes to window.dataLayer — the actual mechanism GTM listens on.
 *     Once a GTM container is connected, its own tag/trigger config (built
 *     in the GTM UI, outside this codebase) is what forwards this on to
 *     GA4, Meta, TikTok etc. We only need to push consistently.
 *  2. Logs it to our own tracking_event_logs table via /api/track — this
 *     is what powers the admin stat cards regardless of pixel status.
 *
 * Never throws, never blocks the caller, never surfaces an error to the
 * visitor — tracking failing must never break the actual user action
 * (form submit, WhatsApp link, etc.) it's attached to.
 */
export function trackEvent(
	eventName: TrackingEventName,
	metadata?: Record<string, string>,
) {
	if (typeof window === "undefined") return;

	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event: eventName, ...metadata });

	const payload = JSON.stringify({
		eventName,
		pagePath: window.location.pathname,
		metadata: metadata ?? {},
	});

	// sendBeacon survives the page navigating away right after — important
	// for outbound clicks like WhatsApp/tel: links. Falls back to fetch
	// with keepalive for browsers without sendBeacon.
	if (navigator.sendBeacon) {
		navigator.sendBeacon(
			"/api/track",
			new Blob([payload], { type: "application/json" }),
		);
	} else {
		fetch("/api/track", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: payload,
			keepalive: true,
		}).catch(() => {
			/* intentionally swallowed — see doc comment above */
		});
	}
}
