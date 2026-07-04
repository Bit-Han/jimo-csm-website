import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { DashboardStat } from "@/lib/types/admin/dashboard";

export function StatCard({
	label,
	value,
	changePercent,
	changeNote,
	icon: Icon,
	iconBgClass,
	iconColorClass,
}: DashboardStat) {
	const isPositive = changePercent === undefined ? true : changePercent >= 0;

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-5">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-xs font-medium text-stone-500">{label}</p>
					<p className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
						{value.toLocaleString()}
					</p>
				</div>
				<span
					className={cn(
						"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
						iconBgClass,
					)}
				>
					<Icon className={cn("h-5 w-5", iconColorClass)} />
				</span>
			</div>

			<div className="mt-3 flex items-center gap-1.5">
				{changePercent !== undefined ? (
					<>
						{isPositive ? (
							<TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
						) : (
							<TrendingDown className="h-3.5 w-3.5 text-red-500" />
						)}
						<span
							className={cn(
								"text-xs font-medium",
								isPositive ? "text-emerald-600" : "text-red-500",
							)}
						>
							{isPositive ? "+" : ""}
							{changePercent}% vs last 30 days
						</span>
					</>
				) : changeNote ? (
					<>
						<TrendingUp className="h-3.5 w-3.5 text-sky-600" />
						<span className="text-xs font-medium text-sky-600">
							{changeNote}
						</span>
					</>
				) : null}
			</div>
		</div>
	);
}
