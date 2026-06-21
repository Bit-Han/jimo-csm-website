// hooks/use-leads.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./use-api-fetch";
import type { Lead, PaginationMeta } from "@/lib/types";

type LeadFilters = {
	projectId?: string;
	status?: string;
	assignedTo?: string;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
};

type LeadDetail = Lead & {
	project?: { id: string; name: string; slug: string } | null;
	assignedTo?: { id: string; name: string; email: string } | null;
	activities: Array<{
		id: string;
		type: string;
		description: string;
		createdAt: string;
		actor?: { name: string } | null;
	}>;
	notes: Array<{
		id: string;
		content: string;
		createdAt: string;
		author: { id: string; name: string };
	}>;
};

export function useLeads(initialFilters: LeadFilters = {}) {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [meta, setMeta] = useState<PaginationMeta | null>(null);
	const [filters, setFilters] = useState<LeadFilters>(initialFilters);
	const [page, setPage] = useState(1);

	const fetchLeads = useCallback(async () => {
		setLoading(true);
		const params = new URLSearchParams({ page: String(page) });
		Object.entries(filters).forEach(([k, v]) => {
			if (v) params.set(k, v);
		});
		const result = await apiFetch<Lead[]>(`/api/leads?${params}`);
		if (result.success) {
			setLeads(result.data);
			setMeta(result.meta ?? null);
			setError(null);
		} else {
			setError(result.error);
		}
		setLoading(false);
	}, [filters, page]);

	useEffect(() => {
		fetchLeads();
	}, [fetchLeads]);

	const updateLeadStatus = useCallback(
		async (id: string, status: Lead["status"]) => {
			const result = await apiFetch<Lead>(`/api/leads/${id}`, {
				method: "PUT",
				body: JSON.stringify({ status }),
			});
			if (result.success) {
				setLeads((prev) =>
					prev.map((l) => (l.id === id ? { ...l, status } : l)),
				);
			}
			return result.success;
		},
		[],
	);

	const assignLead = useCallback(
		async (id: string, assignedTo: string | null) => {
			const result = await apiFetch<Lead>(`/api/leads/${id}/assign`, {
				method: "POST",
				body: JSON.stringify({ assignedTo }),
			});
			if (result.success) await fetchLeads();
			return result.success;
		},
		[fetchLeads],
	);

	const exportLeads = useCallback(() => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([k, v]) => {
			if (v) params.set(k, v);
		});
		window.location.href = `/api/leads/export?${params}`;
	}, [filters]);

	const syncCrm = useCallback(async () => {
		return apiFetch("/api/leads/sync-crm", { method: "POST" });
	}, []);

	return {
		leads,
		loading,
		error,
		meta,
		filters,
		page,
		setFilters,
		setPage,
		refetch: fetchLeads,
		updateLeadStatus,
		assignLead,
		exportLeads,
		syncCrm,
	};
}

export function useLead(id: string | null) {
	const [lead, setLead] = useState<LeadDetail | null>(null);
	const [loading, setLoading] = useState(!!id);
	const [error, setError] = useState<string | null>(null);

	const fetchLead = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		const result = await apiFetch<LeadDetail>(`/api/leads/${id}`);
		if (result.success) {
			setLead(result.data);
			setError(null);
		} else setError(result.error);
		setLoading(false);
	}, [id]);

	useEffect(() => {
		fetchLead();
	}, [fetchLead]);

	const addNote = useCallback(
		async (content: string, mentionedUsers: string[] = []) => {
			if (!id) return false;
			const result = await apiFetch(`/api/leads/${id}/notes`, {
				method: "POST",
				body: JSON.stringify({ content, mentionedUsers }),
			});
			if (result.success) await fetchLead();
			return result.success;
		},
		[id, fetchLead],
	);

	const updateStatus = useCallback(
		async (status: Lead["status"]) => {
			if (!id) return false;
			const result = await apiFetch<Lead>(`/api/leads/${id}`, {
				method: "PUT",
				body: JSON.stringify({ status }),
			});
			if (result.success)
				setLead((prev) => (prev ? { ...prev, status } : prev));
			return result.success;
		},
		[id],
	);

	return { lead, loading, error, refetch: fetchLead, addNote, updateStatus };
}
