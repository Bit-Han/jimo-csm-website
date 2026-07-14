import type { Metadata } from "next";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { LeadPerformanceChart } from "@/components/admin/dashboard/LeadPerformanceChart";
import { RecentEnquiriesPanel } from "@/components/admin/dashboard/RecentEnquiriesPanel";
import { ProjectStatsTable } from "@/components/admin/dashboard/ProjectStatsTable";
import { OperationalAlertsPanel } from "@/components/admin/dashboard/OperationalAlertsPanel";
import {
	mockDashboardStats,
	mockLeadChartData,
	mockOperationalAlerts,
	mockProjectStats,
	mockRecentEnquiries,
} from "@/lib/data/admin/dashboard";

export const metadata: Metadata = {
	title: "Dashboard | Jimo Command Centre",
};

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
					Dashboard
				</h1>
				<p className="mt-1 text-sm text-stone-500">
					Welcome back. Here is what is happening across Jimo projects and
					campaigns.
				</p>
			</div>

			{/* 5 stat cards */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
				{mockDashboardStats.map((stat) => (
					<StatCard key={stat.id} {...stat} />
				))}
			</div>

			{/* Lead chart (left) + Recent Enquiries (right) */}
			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
				{/* Data passed as props — LucideIcons stay server-side only */}
				<LeadPerformanceChart data={mockLeadChartData} />
				<RecentEnquiriesPanel enquiries={mockRecentEnquiries} />
			</div>

			{/* Project table (left) + Operational Alerts (right) */}
			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
				<ProjectStatsTable projects={mockProjectStats} />
				<OperationalAlertsPanel alerts={mockOperationalAlerts} />
			</div>
		</div>
	);
}

// import type { Metadata } from "next";
// import { StatCard } from "@/components/admin/dashboard/StatCard";
// import { LeadPerformanceChart } from "@/components/admin/dashboard/LeadPerformanceChart";
// import { RecentEnquiriesPanel } from "@/components/admin/dashboard/RecentEnquiriesPanel";
// import { ProjectStatsTable } from "@/components/admin/dashboard/ProjectStatsTable";
// import { OperationalAlertsPanel } from "@/components/admin/dashboard/OperationalAlertsPanel";
// import {
// 	buildDashboardStats,
// 	getDashboardChartData,
// 	getDashboardLeadStats,
// 	getDashboardOperationalAlerts,
// } from "@/lib/db/queries/dashboard";
// import { getAdminLeadListRows } from "@/lib/db/queries/leads";
// import { getAdminProjectListRows } from "@/lib/db/queries/projects";
// import type {
// 	RecentEnquiry,
// 	ProjectStatRow,
// } from "@/lib/types/admin/dashboard";
// import type { LeadStatus } from "@/lib/types/admin/dashboard";
// import type { AdminDisplayStatus } from "@/lib/types/admin/project";

// export const metadata: Metadata = {
// 	title: "Dashboard | Jimo Command Centre",
// };

// // Always fresh — dashboard shows live operational data
// export const dynamic = "force-dynamic";

// export default async function AdminDashboardPage() {
// 	// All queries run in parallel — no waterfall
// 	const [leadStats, chartData, recentLeadRows, projectRows, operationalAlerts] =
// 		await Promise.all([
// 			getDashboardLeadStats(),
// 			getDashboardChartData(),
// 			getAdminLeadListRows(5),
// 			getAdminProjectListRows(),
// 			getDashboardOperationalAlerts(),
// 		]);

// 	// Build typed stat cards from real DB counts
// 	const stats = buildDashboardStats(leadStats);

// 	// Map lead list rows to the display shape the panel expects
// 	const recentEnquiries: RecentEnquiry[] = recentLeadRows.map((lead) => ({
// 		id: lead.id,
// 		name: lead.name,
// 		projectAndBudget: [lead.projectPage, lead.budget]
// 			.filter((v) => v && v !== "—")
// 			.join(" · "),
// 		status: lead.status as LeadStatus,
// 	}));

// 	// Map project admin rows to the dashboard project stats shape.
// 	// Brochure and WhatsApp counts come from tracking (not yet wired) → 0
// 	const projectStats: ProjectStatRow[] = projectRows.slice(0, 5).map((p) => ({
// 		id: p.id,
// 		name: p.name,
// 		leads: p.leads,
// 		leadChangePercent: p.leadChangePercent,
// 		brochures: 0, // TODO (tracking integration): per-project brochure download count
// 		whatsapp: 0, // TODO (tracking integration): per-project WhatsApp click count
// 		status: p.adminStatus as AdminDisplayStatus,
// 	}));

// 	return (
// 		<div className="space-y-6">
// 			<div>
// 				<h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
// 					Dashboard
// 				</h1>
// 				<p className="mt-1 text-sm text-stone-500">
// 					Welcome back. Here is what is happening across Jimo projects and
// 					campaigns.
// 				</p>
// 			</div>

// 			{/* ── 5 stat cards ── */}
// 			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
// 				{stats.map((stat) => (
// 					<StatCard key={stat.id} {...stat} />
// 				))}
// 			</div>

// 			{/* ── Lead chart + Recent Enquiries ── */}
// 			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
// 				<LeadPerformanceChart data={chartData} />
// 				<RecentEnquiriesPanel enquiries={recentEnquiries} />
// 			</div>

// 			{/* ── Project table + Operational Alerts ── */}
// 			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
// 				<ProjectStatsTable projects={projectStats} />
// 				<OperationalAlertsPanel alerts={operationalAlerts} />
// 			</div>
// 		</div>
// 	);
// }