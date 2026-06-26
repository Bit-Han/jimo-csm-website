"use client";

import { useState } from "react";
import { InsightCard } from "./InsightCard";
import { insightCategoryOptions } from "@/lib/data/insight-categories";
import { cn } from "@/lib/utils/helpers";
import type { InsightCategory, InsightSummary } from "@/lib/types/insight";

type InsightFilterId = "all" | InsightCategory;

export interface InsightsExplorerProps {
	insights: InsightSummary[];
}

export function InsightsExplorer({ insights }: InsightsExplorerProps) {
	const [activeFilter, setActiveFilter] = useState<InsightFilterId>("all");

	const visibleInsights = insights.filter(
		(insight) => activeFilter === "all" || insight.category === activeFilter,
	);

	return (
		<div>
			<div className="flex flex-wrap gap-3">
				<FilterButton
					label="All"
					isActive={activeFilter === "all"}
					onClick={() => setActiveFilter("all")}
				/>
				{insightCategoryOptions.map((option) => (
					<FilterButton
						key={option.value}
						label={option.label}
						isActive={activeFilter === option.value}
						onClick={() => setActiveFilter(option.value)}
					/>
				))}
			</div>

			{visibleInsights.length > 0 ? (
				<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{visibleInsights.map((insight) => (
						<InsightCard key={insight.id} insight={insight} />
					))}
				</div>
			) : (
				<p className="mt-10 rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
					No articles in this category yet.
				</p>
			)}
		</div>
	);
}

interface FilterButtonProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={isActive}
			className={cn(
				"rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
				isActive
					? "border-red-600 bg-red-600 text-white"
					: "border-stone-200 bg-white text-ink-950 hover:border-red-200 hover:bg-red-50",
			)}
		>
			{label}
		</button>
	);
}
