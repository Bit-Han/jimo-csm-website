import { cn } from "@/lib/utils/helpers";

export type AdminBadgeVariant =
	| "new"
	| "contacted"
	| "qualified"
	| "inspection"
	| "negotiation"
	| "won"
	| "lost"
	| "under-development"
	| "active"
	| "pre-launch"
	| "draft"
	| "published"
	| "needs-attention"
	| "review"
	| "healthy"
	| "connected"
	| "good"
	| "completed"
	| "open";

const styles: Record<AdminBadgeVariant, string> = {
	new: "bg-emerald-50 text-emerald-700",
	contacted: "bg-blue-50 text-blue-700",
	qualified: "bg-teal-50 text-teal-700",
	inspection: "bg-amber-50 text-amber-700",
	negotiation: "bg-purple-50 text-purple-700",
	won: "bg-emerald-100 text-emerald-800",
	lost: "bg-stone-100 text-stone-600",
	"under-development": "bg-emerald-50 text-emerald-700",
	active: "bg-blue-50 text-blue-700",
	"pre-launch": "bg-amber-50 text-amber-700",
	draft: "bg-orange-50 text-orange-600",
	published: "bg-emerald-50 text-emerald-700",
	"needs-attention": "bg-orange-50 text-orange-600",
	review: "bg-amber-50 text-amber-700",
	healthy: "bg-emerald-50 text-emerald-700",
	connected: "bg-emerald-50 text-emerald-700",
	good: "bg-emerald-50 text-emerald-700",
	completed: "bg-emerald-50 text-emerald-700",
	open: "bg-red-50 text-red-600",
};

const labels: Record<AdminBadgeVariant, string> = {
	new: "New",
	contacted: "Contacted",
	qualified: "Qualified",
	inspection: "Inspection",
	negotiation: "Negotiation",
	won: "Won",
	lost: "Lost",
	"under-development": "Under Development",
	active: "Active",
	"pre-launch": "Pre-launch",
	draft: "Draft",
	published: "Published",
	"needs-attention": "Needs attention",
	review: "Review",
	healthy: "Healthy",
	connected: "Connected",
	good: "Good",
	completed: "Completed",
	open: "Open",
};

export interface AdminBadgeProps {
	variant: AdminBadgeVariant;
	className?: string;
}

export function AdminBadge({ variant, className }: AdminBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
				styles[variant],
				className,
			)}
		>
			{labels[variant]}
		</span>
	);
}
