import { cn } from "@/lib/utils/helpers";
import type { ConversionEventBar } from "@/lib/types/admin/tracking-analytics";

export function ConversionEventsPanel({
	events,
}: {
	events: ConversionEventBar[];
}) {
	const max = Math.max(...events.map((e) => e.percentage));

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h3 className="text-sm font-bold text-ink-950">Conversion Events</h3>
			<div className="mt-5 space-y-4">
				{events.map((event) => {
					const barWidth = max > 0 ? (event.percentage / max) * 100 : 0;
					return (
						<div key={event.id}>
							<div className="flex items-center justify-between text-xs text-stone-600">
								<span className="font-mono">{event.eventName}</span>
								<span className="font-semibold text-ink-950">
									{event.count.toLocaleString()} · {event.percentage}%
								</span>
							</div>
							<div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100">
								<div
									className={cn(
										"h-full rounded-full bg-blue-500 transition-all duration-500",
									)}
									style={{ width: `${barWidth}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
