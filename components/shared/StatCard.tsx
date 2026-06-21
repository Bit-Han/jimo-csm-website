// src/components/shared/StatCard.tsx
// Renders one KPI card — icon, label, value, and % change vs previous period
// Matches the card style in screenshot 1 (Dashboard) and screenshot 17 (Analytics)
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { ReactNode } from "react";

interface StatCardProps {
	label: string;
	value: string | number;
	change?: number; // positive = up, negative = down, undefined = no change shown
	changePeriod?: string; // e.g. "vs previous 30 days"
	icon?: ReactNode;
	iconBg?: string; // Tailwind bg class e.g. "bg-blue-50"
	iconColor?: string; // Tailwind text class e.g. "text-blue-600"
	suffix?: string; // e.g. "in pre-launch"
	className?: string;
}

export function StatCard({
	label,
	value,
	change,
	changePeriod = "vs previous 30 days",
	icon,
	iconBg = "bg-gray-100",
	iconColor = "text-gray-600",
	suffix,
	className,
}: StatCardProps) {
	const isPositive = change !== undefined && change >= 0;
	const hasChange = change !== undefined;

	return (
		<div
			className={cn(
				"rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
				className,
			)}
		>
			<div className="flex items-start gap-4">
				{/* Icon */}
				{icon && (
					<div
						className={cn(
							"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
							iconBg,
							iconColor,
						)}
					>
						{icon}
					</div>
				)}

				{/* Content */}
				<div className="flex-1 min-w-0">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
						{label}
					</p>
					<p className="mt-1 text-2xl font-bold text-gray-900 leading-none">
						{typeof value === "number" ? value.toLocaleString() : value}
					</p>

					{/* Change indicator */}
					{hasChange && (
						<div className="mt-1.5 flex items-center gap-1">
							{isPositive ? (
								<TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
							) : (
								<TrendingDown className="h-3.5 w-3.5 text-red-500" />
							)}
							<span
								className={cn(
									"text-xs font-semibold",
									isPositive ? "text-emerald-600" : "text-red-600",
								)}
							>
								{isPositive ? "+" : ""}
								{change}%
							</span>
							<span className="text-xs text-gray-400">{changePeriod}</span>
						</div>
					)}

					{/* Suffix (e.g. "2 in pre-launch") */}
					{suffix && !hasChange && (
						<p className="mt-1 text-xs text-gray-500">{suffix}</p>
					)}
				</div>
			</div>
		</div>
	);
}
