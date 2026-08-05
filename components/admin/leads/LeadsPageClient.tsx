"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadsExplorer } from "./LeadsExplorer";
import { LeadsHeaderActions } from "./LeadsHeaderActions";
import { LeadSummaryCards } from "./LeadSummaryCards";
import type {
	AssignableAdmin,
	LeadFilterOptions,
	LeadFilters,
	LeadSummaryStats,
	PaginatedLeadsResult,
} from "@/lib/types/admin/lead";

export function LeadsPageClient({
	initialResult,
	currentFilters,
	stats,
	admins,
	filterOptions,
}: {
	initialResult: PaginatedLeadsResult;
	currentFilters: LeadFilters;
	stats: LeadSummaryStats;
	admins: AssignableAdmin[];
	filterOptions: LeadFilterOptions;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isPending, startTransition] = useTransition();

	// Converts a filter patch into URL search params and pushes.
	// Any filter change resets to page 1 unless page is explicitly set.
	const updateUrl = useCallback(
		(patch: Partial<LeadFilters>) => {
			const next = new URLSearchParams(searchParams.toString());
			const merged = { ...currentFilters, ...patch };

			if (!("page" in patch)) next.set("page", "1");
			else next.set("page", String(merged.page ?? 1));

			const set = (key: string, val: string | undefined, skip = "all") => {
				if (val && val !== skip) next.set(key, val);
				else next.delete(key);
			};

			set("status", merged.status);
			set("source", merged.source);
			set("project", merged.projectSlug);
			set("landingPage", merged.landingPageSlug);
			if (merged.search?.trim()) next.set("search", merged.search.trim());
			else next.delete("search");
			if (merged.sort && merged.sort !== "newest")
				next.set("sort", merged.sort);
			else next.delete("sort");

			startTransition(() => {
				router.push(`/admin/leads?${next.toString()}`, { scroll: false });
			});
		},
		[currentFilters, router, searchParams],
	);

	return (
		<div className="space-y-4">
			<LeadsHeaderActions
				selectedIds={selectedIds}
				admins={admins}
				currentFilters={currentFilters}
				onAssigned={() => {
					setSelectedIds(new Set());
					startTransition(() => router.refresh());
				}}
			/>

			<LeadsExplorer
				result={initialResult}
				currentFilters={currentFilters}
				filterOptions={filterOptions}
				isLoading={isPending}
				selectedIds={selectedIds}
				onSelectedIdsChange={setSelectedIds}
				onFilterChange={updateUrl}
				onPageChange={(page) => updateUrl({ page })}
			/>

			<LeadSummaryCards stats={stats} />
		</div>
	);
}
