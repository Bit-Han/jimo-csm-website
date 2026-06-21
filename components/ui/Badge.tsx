import { cn } from "@/lib/utils/helpers";

type BadgeVariant =
  | "new" | "contacted" | "qualified" | "inspection" | "negotiation"
  | "closed_won" | "closed_lost"
  | "published" | "draft" | "review" | "archived"
  | "selling_now" | "active" | "pre_launch" | "sold_out"
  | "success" | "warning" | "error" | "info"
  | "connected" | "needs_attention" | "default";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  // Lead statuses
  new:          "bg-blue-50 text-blue-700 border-blue-200",
  contacted:    "bg-purple-50 text-purple-700 border-purple-200",
  qualified:    "bg-green-50 text-green-700 border-green-200",
  inspection:   "bg-orange-50 text-orange-700 border-orange-200",
  negotiation:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  closed_won:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed_lost:  "bg-red-50 text-red-700 border-red-200",
  // Content statuses
  published:    "bg-green-50 text-green-700 border-green-200",
  draft:        "bg-yellow-50 text-yellow-700 border-yellow-200",
  review:       "bg-orange-50 text-orange-700 border-orange-200",
  archived:     "bg-gray-100 text-gray-500 border-gray-200",
  // Project statuses
  selling_now:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  active:       "bg-green-50 text-green-700 border-green-200",
  pre_launch:   "bg-blue-50 text-blue-700 border-blue-200",
  sold_out:     "bg-red-50 text-red-700 border-red-200",
  // Alerts
  success:      "bg-green-50 text-green-700 border-green-200",
  warning:      "bg-orange-50 text-orange-700 border-orange-200",
  error:        "bg-red-50 text-red-700 border-red-200",
  info:         "bg-blue-50 text-blue-700 border-blue-200",
  connected:    "bg-green-50 text-green-700 border-green-200",
  needs_attention: "bg-orange-50 text-orange-700 border-orange-200",
  default:      "bg-gray-100 text-gray-600 border-gray-200",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Convenience: derive variant from a raw status string
export function statusToBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    new: "new", contacted: "contacted", qualified: "qualified",
    inspection: "inspection", negotiation: "negotiation",
    closed_won: "closed_won", closed_lost: "closed_lost",
    published: "published", draft: "draft", review: "review", archived: "archived",
    selling_now: "selling_now", active: "active", pre_launch: "pre_launch", sold_out: "sold_out",
    connected: "connected",
  };
  return map[status] ?? "default";
}