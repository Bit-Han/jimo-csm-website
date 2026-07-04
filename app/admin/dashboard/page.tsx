// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// export default function AdminDashboardPage() {
// 	return (
// 		<AdminPlaceholderPage
// 			title="Dashboard"
// 			description="Welcome back. Here is what is happening across Jimo projects and campaigns."
// 			stageNote="Lead performance chart, recent enquiries, and operational alerts land once Leads and Projects are wired to real data."
// 		/>
// 	);
// }
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