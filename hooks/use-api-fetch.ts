// hooks/use-api-fetch.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight base for all hooks. Handles fetch state, error normalisation,
// and mutation helpers without any external library.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useCallback, useRef } from "react";
import type { ApiResponse, PaginationMeta } from "@/lib/types";

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  meta: PaginationMeta | null;
};

/**
 * Low-level fetcher. Normalises errors into a consistent shape.
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (res.status === 204) return { success: true, data: null as T };

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Generic list hook factory.
 * Returns a hook that manages: data[], loading, error, meta, refetch, setFilters, setPage.
 *
 * @param buildUrl  — function that builds the API URL from current params
 *
 * Usage:
 *   const useFoo = createListHook<Foo>((p) => `/api/foo?${p}`)
 */
export function useListFetch<T, TFilters extends Record<string, unknown>>(
  buildUrl: (params: URLSearchParams) => string,
  defaultFilters: TFilters,
  defaultPage = 1
) {
  const [state, setState] = useState<FetchState<T[]>>({
    data: null,
    loading: true,
    error: null,
    meta: null,
  });

  const [filters, setFilters] = useState<TFilters>(defaultFilters);
  const [page, setPage] = useState(defaultPage);
  // Abort controller ref — cancel in-flight requests when re-fetching
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: null }));

    const params = new URLSearchParams();
    params.set("page", String(page));
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });

    const result = await apiFetch<T[]>(buildUrl(params), {
      signal: controller.signal,
    });

    if (result.success) {
      setState({ data: result.data, loading: false, error: null, meta: result.meta ?? null });
    } else {
      setState((s) => ({ ...s, loading: false, error: result.error }));
    }
  }, [filters, page, buildUrl]);

  return { state, filters, setFilters, page, setPage, refetch: fetch };
}
