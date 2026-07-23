// components/ChunkErrorRecovery.tsx — add once to your root layout
"use client";

import { useEffect } from "react";

export function ChunkErrorRecovery() {
	useEffect(() => {
		function handleError(event: ErrorEvent | PromiseRejectionEvent) {
			const message =
				"reason" in event
					? String(event.reason?.message ?? "")
					: String(event.message ?? "");

			const isChunkError =
				/loading chunk/i.test(message) ||
				/failed to fetch dynamically imported module/i.test(message) ||
				/network error/i.test(message);

			if (isChunkError) {
				console.warn("Stale chunk detected — forcing reload.");
				window.location.reload();
			}
		}

		window.addEventListener("error", handleError);
		window.addEventListener("unhandledrejection", handleError);
		return () => {
			window.removeEventListener("error", handleError);
			window.removeEventListener("unhandledrejection", handleError);
		};
	}, []);

	return null;
}
