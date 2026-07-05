import { cn } from "@/lib/utils/helpers";
import type { LeadDetail } from "@/lib/types/admin/lead";

export function ActivityTimelinePanel({ lead }: { lead: LeadDetail }) {
	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Activity Timeline</h2>
			<ol className="mt-4 space-y-0">
				{lead.activityTimeline.map((event, index) => {
					const isLast = index === lead.activityTimeline.length - 1;
					return (
						<li key={event.id} className="flex items-start gap-3">
							<div className="flex flex-col items-center">
								<span
									className={cn(
										"mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2",
										event.isCurrent
											? "border-red-600 bg-red-600"
											: "border-stone-300 bg-white",
									)}
								/>
								{!isLast ? (
									<span className="my-1 h-8 w-0.5 bg-stone-100" />
								) : null}
							</div>
							<div className="flex w-full items-start justify-between gap-2 pb-2">
								<p
									className={cn(
										"text-sm",
										event.isCurrent
											? "font-semibold text-ink-950"
											: "text-stone-600",
									)}
								>
									{event.label}
								</p>
								<p className="shrink-0 text-xs text-stone-400">
									{event.timestamp}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
