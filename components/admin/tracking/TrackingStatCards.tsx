import { TrendingUp } from "lucide-react";
import type { TrackingStatCard } from "@/lib/types/admin/tracking-analytics";

export function TrackingStatCards({ stats }: { stats: TrackingStatCard[] }) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{stats.map((stat) => (
				<div
					key={stat.id}
					className="rounded-2xl border border-stone-200 bg-white p-5"
				>
					<p className="text-xs font-medium text-stone-500">{stat.label}</p>
					<p className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
						{stat.value.toLocaleString()}
					</p>
					<div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
						<TrendingUp className="h-3.5 w-3.5" />+{stat.changePercent}%
					</div>
				</div>
			))}
		</div>
	);
}
