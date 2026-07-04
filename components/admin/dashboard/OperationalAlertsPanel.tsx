import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import type {
	AlertSeverity,
	OperationalAlert,
} from "@/lib/types/admin/dashboard";

type AlertConfigEntry = {
	Icon: typeof AlertTriangle;
	iconClass: string;
	badge: AdminBadgeVariant;
};

const alertConfig: Record<AlertSeverity, AlertConfigEntry> = {
	"needs-attention": {
		Icon: AlertTriangle,
		iconClass: "text-orange-500",
		badge: "needs-attention",
	},
	review: {
		Icon: Info,
		iconClass: "text-amber-500",
		badge: "review",
	},
	healthy: {
		Icon: CheckCircle2,
		iconClass: "text-emerald-500",
		badge: "connected",
	},
};

export interface OperationalAlertsPanelProps {
	alerts: OperationalAlert[];
}

export function OperationalAlertsPanel({
	alerts,
}: OperationalAlertsPanelProps) {
	// Primary action = first non-healthy alert that has an href
	const primaryAction = alerts.find(
		(a) => a.severity !== "healthy" && a.actionHref,
	);

	return (
		<div className="flex flex-col rounded-2xl border border-stone-200 bg-white">
			<div className="border-b border-stone-100 px-6 py-5">
				<h2 className="text-base font-bold text-ink-950">Operational Alerts</h2>
			</div>

			<ul className="flex-1 divide-y divide-stone-100">
				{alerts.map((alert) => {
					const { Icon, iconClass, badge } = alertConfig[alert.severity];
					return (
						<li
							key={alert.id}
							className="flex items-start justify-between gap-3 px-6 py-4"
						>
							<div className="flex items-start gap-3">
								<Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconClass)} />
								<div>
									<p className="text-sm font-semibold text-ink-950">
										{alert.message}
									</p>
									<p className="mt-0.5 text-xs text-stone-500">
										{alert.detail}
									</p>
								</div>
							</div>
							<AdminBadge variant={badge} className="shrink-0" />
						</li>
					);
				})}
			</ul>

			{primaryAction?.actionHref ? (
				<div className="border-t border-stone-100 p-4">
					<Link
						href={primaryAction.actionHref}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900"
					>
						{primaryAction.actionLabel}
					</Link>
				</div>
			) : null}
		</div>
	);
}
