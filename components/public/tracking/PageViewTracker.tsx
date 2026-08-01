// components/public/tracking/PageViewTracker.tsx
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking/dispatch";

export function PageViewTracker({
	metadata,
}: {
	metadata?: Record<string, string>;
}) {
	useEffect(() => {
		trackEvent("landing_page_view", metadata);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}
