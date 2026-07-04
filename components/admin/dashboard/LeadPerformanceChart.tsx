"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils/helpers";
import type {
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { ChartPeriod, LeadChartDataPoint } from "@/lib/types/admin/dashboard";

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
];

// Show every Nth label on the X axis to avoid crowding
const X_TICK_INTERVAL: Record<ChartPeriod, number> = {
  "7": 0,
  "30": 4,
  "90": 13,
};

const PERIOD_SUBTITLE: Record<ChartPeriod, string> = {
  "7": "Last 7 days by source, campaign and project.",
  "30": "Last 30 days by source, campaign and project.",
  "90": "Last 90 days by source, campaign and project.",
};

export interface LeadPerformanceChartProps {
  data: Record<ChartPeriod, LeadChartDataPoint[]>;
}

export function LeadPerformanceChart({ data }: LeadPerformanceChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>("30");
  const chartData = data[period];

  return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="text-base font-bold text-ink-950">Lead Performance</h2>
					<p className="mt-0.5 text-xs text-stone-500">
						{PERIOD_SUBTITLE[period]}
					</p>
				</div>

				<div className="flex overflow-hidden rounded-lg border border-stone-200">
					{PERIODS.map(({ value, label }) => (
						<button
							key={value}
							type="button"
							onClick={() => setPeriod(value)}
							className={cn(
								"border-r border-stone-200 px-3 py-1.5 text-xs font-semibold transition-colors last:border-r-0",
								period === value
									? "bg-ink-950 text-white"
									: "bg-white text-stone-600 hover:bg-stone-50",
							)}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<div className="mt-6 h-[220px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={chartData}
						margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#f0ede8"
							vertical={false}
						/>
						<XAxis
							dataKey="date"
							tick={{ fontSize: 10, fill: "#78716c" }}
							tickLine={false}
							axisLine={false}
							interval={X_TICK_INTERVAL[period]}
						/>
						<YAxis
							tick={{ fontSize: 10, fill: "#78716c" }}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "8px",
								border: "1px solid #e7e5e4",
								fontSize: "12px",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
								padding: "8px 12px",
							}}
							labelStyle={{
								fontWeight: 600,
								color: "#1c1917",
								marginBottom: 2,
							}}
							formatter={
								((value: ValueType | undefined) => [
									typeof value === "number" ? value : String(value ?? ""),
									"Leads",
								]) as never
							}
						/>
						<Line
							type="monotone"
							dataKey="leads"
							stroke="#2563eb"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}