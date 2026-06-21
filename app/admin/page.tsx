// app/(dashboard)/page.tsx — corrected: no manual useEffect, no casts
"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	Users,
	Download,
	MessageCircle,
	Phone,
	Building2,
	Megaphone,
	AlertCircle,
	CheckCircle,
	ArrowRight,
	ExternalLink,
} from "lucide-react";
import Link from "next/link";

const MOCK_CHART_DATA = [
	{ day: "May 11", leads: 12 },
	{ day: "May 14", leads: 18 },
	{ day: "May 17", leads: 15 },
	{ day: "May 20", leads: 22 },
	{ day: "May 23", leads: 28 },
	{ day: "May 26", leads: 24 },
	{ day: "May 29", leads: 31 },
	{ day: "Jun 1", leads: 27 },
	{ day: "Jun 4", leads: 35 },
	{ day: "Jun 7", leads: 42 },
	{ day: "Jun 9", leads: 38 },
];

export default function DashboardPage() {
	// useDashboard already fetches on mount internally (hooks/core/use-fetch.ts).
	// No extra useEffect needed here — that was the double-fetch bug.
	const { data, loading, error } = useDashboard();

	if (loading) {
		return (
			<div className="space-y-4 animate-pulse">
				<div className="h-8 w-48 bg-gray-200 rounded" />
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-28 bg-gray-200 rounded-xl" />
					))}
				</div>
				<div className="h-72 bg-gray-200 rounded-xl" />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-sm text-red-600">
					{error ?? "Failed to load dashboard."}
				</p>
			</div>
		);
	}

	const { stats, recentEnquiries, alerts, projectRows } = data;

	return (
		<div className="space-y-6 max-w-[1400px]">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
				<p className="text-sm text-gray-500 mt-0.5">
					Welcome back. Here is what is happening across Jimo projects and
					campaigns.
				</p>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
				<StatCard
					label="Total Leads"
					value={stats.totalLeads}
					change={stats.totalLeadsChange}
					icon={Users}
					iconColor="text-blue-500"
				/>
				<StatCard
					label="Brochure Download"
					value={stats.brochureDownloads}
					change={stats.brochureDownloadsChange}
					icon={Download}
					iconColor="text-green-500"
				/>
				<StatCard
					label="WhatsApp Clicks"
					value={stats.whatsappClicks}
					change={stats.whatsappClicksChange}
					icon={MessageCircle}
					iconColor="text-emerald-500"
				/>
				<StatCard
					label="Phone Clicks"
					value={stats.phoneClicks}
					change={stats.phoneClicksChange}
					icon={Phone}
					iconColor="text-orange-500"
				/>
				<StatCard
					label="Active Projects"
					value={stats.activeProjects}
					subLabel={`↑ ${stats.preLaunchProjects} in pre-launch`}
					icon={Building2}
					iconColor="text-purple-500"
				/>
				<StatCard
					label="Active Campaigns"
					value={stats.activeCampaigns}
					subLabel={`↑ ${stats.campaignsNeedReview} need review`}
					icon={Megaphone}
					iconColor="text-pink-500"
				/>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="font-semibold text-gray-900">Lead Performance</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								Last 30 days by source, campaign and project.
							</p>
						</div>
						<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
							Last 30 days
						</span>
					</div>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart
							data={MOCK_CHART_DATA}
							margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis
								dataKey="day"
								tick={{ fontSize: 11 }}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11 }}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip
								contentStyle={{
									fontSize: 12,
									border: "1px solid #e5e7eb",
									borderRadius: 8,
								}}
							/>
							<Line
								type="monotone"
								dataKey="leads"
								stroke="#3b82f6"
								strokeWidth={2}
								dot={{ r: 3 }}
								activeDot={{ r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-5">
					<h2 className="font-semibold text-gray-900 mb-4">Recent Enquiries</h2>
					<div className="space-y-3">
						{recentEnquiries.map((lead) => (
							<div
								key={lead.id}
								className="flex items-center justify-between gap-2"
							>
								<div className="min-w-0">
									<p className="text-sm font-medium text-gray-800 truncate">
										{lead.name}
									</p>
									<p className="text-xs text-gray-500 truncate">
										{lead.projectName} • {lead.budgetRange}
									</p>
								</div>
								<StatusBadge status={lead.status} className="shrink-0" />
							</div>
						))}
					</div>
					<Link
						href="/leads"
						className="flex items-center gap-1.5 text-sm text-[#c8a84b] font-medium mt-4 hover:underline"
					>
						View all enquiries <ArrowRight size={13} />
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100">
								{["Project", "Leads", "Brochure", "WhatsApp", "Status"].map(
									(h) => (
										<th
											key={h}
											className="text-left text-xs font-medium text-gray-500 px-4 py-3"
										>
											{h}
										</th>
									),
								)}
							</tr>
						</thead>
						<tbody>
							{projectRows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
								>
									<td className="px-4 py-3 font-medium text-gray-800">
										{row.name}
									</td>
									<td className="px-4 py-3 text-gray-600">{row.leadsCount}</td>
									<td className="px-4 py-3 text-gray-600">
										{row.brochureDownloads ?? "—"}
									</td>
									<td className="px-4 py-3 text-gray-600">
										{row.whatsappClicks ?? "—"}
									</td>
									<td className="px-4 py-3">
										<StatusBadge status={row.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-5">
					<h2 className="font-semibold text-gray-900 mb-4">
						Operational Alerts
					</h2>
					<div className="space-y-3">
						{alerts.map((alert) => (
							<div key={alert.id} className="flex items-start gap-3">
								<div className="mt-0.5">
									{alert.severity === "connected" ? (
										<CheckCircle size={14} className="text-blue-500" />
									) : (
										<AlertCircle
											size={14}
											className={
												alert.severity === "needs_attention"
													? "text-orange-500"
													: "text-yellow-500"
											}
										/>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-gray-800">{alert.message}</p>
									<p className="text-xs text-gray-500">{alert.detail}</p>
								</div>
								<StatusBadge
									status={alert.severity}
									className="shrink-0 text-xs"
								/>
							</div>
						))}
					</div>
					<Link
						href="/seo"
						className="flex items-center justify-center gap-1.5 w-full mt-4 py-2 bg-[#0f1f35] text-white text-sm font-medium rounded-lg hover:bg-[#1b2d4f] transition"
					>
						Open SEO Centre <ExternalLink size={12} />
					</Link>
				</div>
			</div>
		</div>
	);
}
