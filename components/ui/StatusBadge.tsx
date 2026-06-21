// // components/ui/status-badge.tsx
// import { cn } from "@/lib/utils/helpers";

// const VARIANTS: Record<string, string> = {
// 	// Project statuses
// 	selling_now: "bg-green-100 text-green-700 border-green-200",
// 	active: "bg-blue-100 text-blue-700 border-blue-200",
// 	pre_launch: "bg-orange-100 text-orange-700 border-orange-200",
// 	draft: "bg-gray-100 text-gray-600 border-gray-200",
// 	sold_out: "bg-red-100 text-red-700 border-red-200",
// 	// Lead statuses
// 	new: "bg-green-100 text-green-700 border-green-200",
// 	contacted: "bg-blue-100 text-blue-700 border-blue-200",
// 	qualified: "bg-emerald-100 text-emerald-700 border-emerald-200",
// 	inspection: "bg-orange-100 text-orange-700 border-orange-200",
// 	negotiation: "bg-purple-100 text-purple-700 border-purple-200",
// 	closed_won: "bg-green-100 text-green-700 border-green-200",
// 	closed_lost: "bg-red-100 text-red-700 border-red-200",
// 	// Content statuses
// 	published: "bg-green-100 text-green-700 border-green-200",
// 	archived: "bg-gray-100 text-gray-600 border-gray-200",
// 	review: "bg-yellow-100 text-yellow-700 border-yellow-200",
// 	// Generic
// 	connected: "bg-blue-100 text-blue-700 border-blue-200",
// 	needs_attention: "bg-orange-100 text-orange-700 border-orange-200",
// };

// const LABELS: Record<string, string> = {
// 	selling_now: "Selling Now",
// 	pre_launch: "Pre-launch",
// 	sold_out: "Sold Out",
// 	closed_won: "Closed Won",
// 	closed_lost: "Closed Lost",
// 	needs_attention: "Needs Attention",
// };

// type StatusBadgeProps = {
// 	status: string;
// 	className?: string;
// };

// export function StatusBadge({ status, className }: StatusBadgeProps) {
// 	const variant =
// 		VARIANTS[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
// 	const label =
// 		LABELS[status] ??
// 		status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// 	return (
// 		<span
// 			className={cn(
// 				"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
// 				variant,
// 				className,
// 			)}
// 		>
// 			{label}
// 		</span>
// 	);
// }



// components/ui/status-badge.tsx
import { cn } from "@/lib/utils/helpers";

const VARIANTS: Record<string, string> = {
  // Project statuses
  selling_now: "bg-green-100 text-green-700 border-green-200",
  active:      "bg-blue-100 text-blue-700 border-blue-200",
  pre_launch:  "bg-orange-100 text-orange-700 border-orange-200",
  draft:       "bg-gray-100 text-gray-600 border-gray-200",
  sold_out:    "bg-red-100 text-red-700 border-red-200",
  // Lead statuses
  new:         "bg-green-100 text-green-700 border-green-200",
  contacted:   "bg-blue-100 text-blue-700 border-blue-200",
  qualified:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  inspection:  "bg-orange-100 text-orange-700 border-orange-200",
  negotiation: "bg-purple-100 text-purple-700 border-purple-200",
  closed_won:  "bg-green-100 text-green-700 border-green-200",
  closed_lost: "bg-red-100 text-red-700 border-red-200",
  // Content statuses
  published:   "bg-green-100 text-green-700 border-green-200",
  archived:    "bg-gray-100 text-gray-600 border-gray-200",
  review:      "bg-yellow-100 text-yellow-700 border-yellow-200",
  // Generic
  connected:   "bg-blue-100 text-blue-700 border-blue-200",
  needs_attention: "bg-orange-100 text-orange-700 border-orange-200",
};

const LABELS: Record<string, string> = {
  selling_now: "Selling Now",
  pre_launch: "Pre-launch",
  sold_out: "Sold Out",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
  needs_attention: "Needs Attention",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = VARIANTS[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const label = LABELS[status] ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        variant,
        className
      )}
    >
      {label}
    </span>
  );
}
