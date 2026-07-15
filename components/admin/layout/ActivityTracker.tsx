"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 hour
const CHECK_INTERVAL_MS = 60 * 1000; // check every 60 seconds
const STORAGE_KEY = "jimo-admin-last-activity";

function recordActivity() {
	try {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
	} catch {
		// localStorage not available (SSR guard — component is client-only)
	}
}

export function ActivityTracker() {
	const router = useRouter();

	useEffect(() => {
		// Record activity on mount
		recordActivity();

		// Track user interactions
		const events = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
			"click",
		] as const;

		for (const event of events) {
			window.addEventListener(event, recordActivity, { passive: true });
		}

		// Check inactivity every minute
		const interval = setInterval(async () => {
			try {
				const lastActivity = Number(localStorage.getItem(STORAGE_KEY) ?? "0");
				const elapsed = Date.now() - lastActivity;

				if (elapsed >= INACTIVITY_LIMIT_MS) {
					const supabase = createClient();
					await supabase.auth.signOut();
					router.push("/admin/auth/login?reason=inactivity");
				}
			} catch {
				// Ignore localStorage errors
			}
		}, CHECK_INTERVAL_MS);

		return () => {
			for (const event of events) {
				window.removeEventListener(event, recordActivity);
			}
			clearInterval(interval);
		};
	}, [router]);

	return null;
}
