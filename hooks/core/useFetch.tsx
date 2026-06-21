// hooks/core/use-fetch.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generic single-resource GET hook. Used for any endpoint that returns one
// object with no pagination: dashboard summary, settings, SEO overview,
// tracking overview, users overview.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../use-api-fetch";

export function useFetch<T>(url: string | null) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(!!url);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const refetch = useCallback(async () => {
		if (!url) return;
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setLoading(true);
		setError(null);
		const result = await apiFetch<T>(url, { signal: controller.signal });
		if (controller.signal.aborted) return;

		if (result.success) setData(result.data);
		else setError(result.error);
		setLoading(false);
	}, [url]);

	// The ONLY effect for this hook. Any component consuming useFetch must NOT
	// add its own useEffect to trigger a fetch — that causes the double-fetch
	// bug we just fixed on the dashboard page.
	useEffect(() => {
		refetch();
		return () => abortRef.current?.abort();
	}, [refetch]);

	return { data, loading, error, refetch, setData };
}
