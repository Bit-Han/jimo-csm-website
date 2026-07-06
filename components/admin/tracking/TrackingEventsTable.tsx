import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import type {
	AdminTrackingEventCategory,
	AdminTrackingEventRow,
	AdminTrackingEventStatus,
} from "@/lib/types/admin/tracking-analytics";

const STATUS_BADGE: Record<AdminTrackingEventStatus, AdminBadgeVariant> = {
	active: "active",
	inactive: "draft",
	testing: "review",
};

const CATEGORY_LABELS: Record<AdminTrackingEventCategory, string> = {
	awareness: "Awareness",
	lead_generation: "Lead Generation",
	engagement: "Engagement",
	conversion: "Conversion",
};

export function TrackingEventsTable({
	events,
}: {
	events: AdminTrackingEventRow[];
}) {
	return (
		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[680px] text-left text-sm">
					<thead>
						<tr className="border-b border-stone-100 bg-stone-50/60">
							{[
								"Event Name",
								"Trigger",
								"Destination",
								"Status",
								"Category",
							].map((h) => (
								<th
									key={h}
									className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{events.map((event) => (
							<tr
								key={event.id}
								className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
							>
								<td className="px-6 py-4 font-mono text-sm font-semibold text-ink-950">
									{event.eventName}
								</td>
								<td className="px-6 py-4 text-stone-600">{event.trigger}</td>
								<td className="px-6 py-4">
									<span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
										{event.destinations}
									</span>
								</td>
								<td className="px-6 py-4">
									<AdminBadge variant={STATUS_BADGE[event.status]} />
								</td>
								<td className="px-6 py-4 text-stone-600">
									{CATEGORY_LABELS[event.category]}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
