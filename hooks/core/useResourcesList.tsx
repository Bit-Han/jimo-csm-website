// hooks/core/use-resource-list.ts
// (rename from .tsx to .ts while you're in here — no JSX lives in this file,
// .tsx is for files that return JSX. Not the cause of this error, just cleanup.)
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../use-api-fetch";
import type { PaginationMeta } from "@/lib/types";

export function useResourceList
  TItem extends { id: string },
  TFilters extends Record<string, unknown> = Record<string, unknown>
>(baseUrl: string, initialFilters: TFilters = {} as TFilters, initialPage = 1) {
  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page) });
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    });

    const result = await apiFetch<TItem[]>(`${baseUrl}?${params}`, { signal: controller.signal });
    if (controller.signal.aborted) return;

    if (result.success) {
      setItems(result.data);
      setMeta(result.meta ?? null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [baseUrl, filters, page]);

  useEffect(() => {
    refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

  const create = useCallback(async (input: unknown): Promise<TItem | null> => {
    const result = await apiFetch<TItem>(baseUrl, { method: "POST", body: JSON.stringify(input) });
    if (result.success) { setItems((prev) => [result.data, ...prev]); return result.data; }
    setError(result.error);
    return null;
  }, [baseUrl]);

  const update = useCallback(async (id: string, input: unknown): Promise<boolean> => {
    const result = await apiFetch<TItem>(`${baseUrl}/${id}`, { method: "PUT", body: JSON.stringify(input) });
    if (result.success) { setItems((prev) => prev.map((i) => (i.id === id ? result.data : i))); return true; }
    setError(result.error);
    return false;
  }, [baseUrl]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    const result = await apiFetch<null>(`${baseUrl}/${id}`, { method: "DELETE" });
    if (result.success) { setItems((prev) => prev.filter((i) => i.id !== id)); return true; }
    setError((result as { success: false; error: string }).error);
    return false;
  }, [baseUrl]);

  return { items, loading, error, meta, filters, setFilters, page, setPage, refetch, create, update, remove };
}