import { cn } from "@/lib/utils/helpers";
import type { SeoHealthStat } from "@/lib/types/admin/seo-centre";

export function SeoStatCards({ stats }: { stats: SeoHealthStat[] }) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{stats.map((stat) => (
				<div
					key={stat.id}
					className="rounded-2xl border border-stone-200 bg-white p-4 text-center"
				>
					<p className="text-2xl font-bold text-ink-950">
						{stat.value.toLocaleString()}
					</p>
					<p className="mt-1 text-[11px] font-medium text-stone-500">
						{stat.label}
					</p>
					<span
						className={cn(
							"mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
							stat.severity === "needs-attention"
								? "bg-orange-50 text-orange-600"
								: "bg-emerald-50 text-emerald-700",
						)}
					>
						{stat.severity === "needs-attention" ? "Needs attention" : "Good"}
					</span>
				</div>
			))}
		</div>
	);
}
