// hooks/use-dashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./use-api-fetch";
import type {
	DashboardStats,
	RecentEnquiry,
	OperationalAlert,
	ProjectPerformanceRow,
} from "@/lib/types";

type DashboardData = {
	stats: DashboardStats;
	recentEnquiries: RecentEnquiry[];
	alerts: OperationalAlert[];
	projectRows: ProjectPerformanceRow[];
};

export function useDashboard() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetch = useCallback(async () => {
		setLoading(true);
		const result = await apiFetch<DashboardData>("/api/dashboard");
		if (result.success) {
			setData(result.data);
			setError(null);
		} else {
			setError(result.error);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		fetch();
	}, [fetch]);

	return { data, loading, error, refetch: fetch };
}
