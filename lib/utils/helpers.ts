// lib/utils/helpers.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/** Tailwind class merge utility */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Convert Kobo (smallest Naira unit, ×100) to a formatted Naira string.
 * e.g. 12000000000 → "₦120M"  or  65000000 → "₦65M"
 */
export function formatNaira(
	kobo: number | null | undefined,
	compact = true,
): string {
	if (kobo == null) return "N/A";
	const naira = kobo / 100;
	if (compact) {
		if (naira >= 1_000_000_000)
			return `₦${(naira / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
		if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(0)}M`;
		if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
	}
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(naira);
}

/** Convert Naira (as entered in UI) to Kobo for storage */
export function nairaToKobo(naira: number): number {
	return Math.round(naira * 100);
}

/** Convert Kobo back to Naira for display in form inputs */
export function koboToNaira(kobo: number | null | undefined): number {
	if (kobo == null) return 0;
	return kobo / 100;
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

/** Format a date for display */
export function formatDate(
	date: Date | string | null | undefined,
	fmt = "MMM d, yyyy",
): string {
	if (!date) return "—";
	return format(new Date(date), fmt);
}

/** Format relative time "2 min ago", "3 hrs ago" */
export function formatRelativeTime(date: Date | string): string {
	const now = new Date();
	const d = new Date(date);
	const diffMs = now.getTime() - d.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	if (diffMins < 1) return "just now";
	if (diffMins < 60) return `${diffMins} min ago`;
	const diffHrs = Math.floor(diffMins / 60);
	if (diffHrs < 24) return `${diffHrs} hr${diffHrs === 1 ? "" : "s"} ago`;
	const diffDays = Math.floor(diffHrs / 24);
	if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
	return formatDate(date);
}

/** Compute pagination meta from total count */
export function buildPaginationMeta(
	total: number,
	page: number,
	pageSize: number,
) {
	return {
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

/** Parse safe integer from query string, with a default fallback */
export function parseIntParam(
	val: string | null | undefined,
	defaultVal: number,
): number {
	if (!val) return defaultVal;
	const n = parseInt(val, 10);
	return Number.isNaN(n) ? defaultVal : n;
}


export function formatPrice(amount: number, currency = '₦'): string {
  if (amount >= 1_000_000_000) return `${currency}${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000)     return `${currency}${(amount / 1_000_000).toFixed(0)}M`
  return `${currency}${amount.toLocaleString()}`
}

export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    completed:   'bg-emerald-100 text-emerald-700',
    'pre-launch': 'bg-amber-100 text-amber-700',
    concept:     'bg-purple-100 text-purple-700',
    active:      'bg-emerald-100 text-emerald-700',
    'sold-out':  'bg-gray-100 text-gray-500',
    draft:       'bg-gray-100 text-gray-500',
  }
  return map[status.toLowerCase()] ?? 'bg-gray-100 text-gray-500'
}