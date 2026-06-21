
// src/app/(cms)/dashboard/page.tsx
// DATA FLOW:
//  useFetch("/api/dashboard") → single state object, one render on load
//  No cascading setState — all derived values computed from data at render time
//  Chart data is a memo-free inline transform (simple enough to keep in render)
"use client";
import { useRouter } from "next/navigation";
import {
  Users, Download, MessageCircle, Phone, Building2, Megaphone, ArrowRight, MoreVertical,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { apiFetch } from "@/hooks/use-api-fetch";
import { StatCard } from "@/components/shared/StatCard";
import { Badge, statusToBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatRelativeTime } from "@/lib/utils/helpers";

interface DashboardData {
  stats: {
    totalLeads: number; totalLeadsChange: number;
    brochureDownloads: number; brochureDownloadsChange: number;
    whatsappClicks: number; whatsappClicksChange: number;
    phoneClicks: number; phoneClicksChange: number;
    activeProjects: number; prelaunchProjects: number;
    activeCampaigns: number; campaignsNeedReview: number;
  };
  recentLeads: {
    id: string; name: string; projectInterest: string | null;
    budgetLabel: string | null; status: string; createdAt: string;
  }[];
  projectSummary: {
    id: string; name: string; status: string;
    totalLeads: number; totalBrochureDownloads: number; totalWhatsappClicks: number;
  }[];
  leadsByDay: { date: string; count: number }[];
  alerts: { message: string; detail: string; type: "warning" | "info" | "success" | "error" }[];
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{payload[0].value} leads</p>
    </div>
  );
}

const ALERT_VARIANT: Record<string, "warning" | "success" | "info" | "error"> = {
  warning: "warning", success: "success", info: "info", error: "error",
};
const ALERT_LABEL: Record<string, string> = {
  warning: "Needs attention", success: "Connected", info: "Info", error: "Error",
};
const PROJECT_STATUS_LABEL: Record<string, string> = {
  draft: "Draft", pre_launch: "Pre-launch", active: "Active",
  selling_now: "Selling Now", sold_out: "Sold Out", archived: "Archived",
};

export default function DashboardPage() {
  const router = useRouter();
  // Single fetch → single state object → one render on load, one on data arrival
  const { data, loading } = apiFetch<DashboardData>("/api/dashboard");

  if (loading) return <PageSpinner />;
  if (!data) return null;

  const { stats, recentLeads, projectSummary, leadsByDay, alerts } = data;

  // Derived inline — no extra state needed
  const chartData = leadsByDay.map((d) => ({
    label: new Date(d.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
    count: d.count,
  }));

  return (
    <div className="min-h-full">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is what is happening across Jimo projects and campaigns."
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Leads" value={stats.totalLeads} change={stats.totalLeadsChange}
            icon={<Users className="h-5 w-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Brochure Downloads" value={stats.brochureDownloads} change={stats.brochureDownloadsChange}
            icon={<Download className="h-5 w-5" />} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard label="WhatsApp Clicks" value={stats.whatsappClicks} change={stats.whatsappClicksChange}
            icon={<MessageCircle className="h-5 w-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard label="Phone Clicks" value={stats.phoneClicks} change={stats.phoneClicksChange}
            icon={<Phone className="h-5 w-5" />} iconBg="bg-orange-50" iconColor="text-orange-600" />
          <StatCard label="Active Projects" value={stats.activeProjects}
            suffix={`${stats.prelaunchProjects} in pre-launch`}
            icon={<Building2 className="h-5 w-5" />} iconBg="bg-violet-50" iconColor="text-violet-600" />
          <StatCard label="Active Campaigns" value={stats.activeCampaigns}
            suffix={`${stats.campaignsNeedReview} need review`}
            icon={<Megaphone className="h-5 w-5" />} iconBg="bg-pink-50" iconColor="text-pink-600" />
        </div>

        {/* Chart + Recent Enquiries */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Lead Performance</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 30 days by source, campaign and project.</p>
              </div>
              <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                Last 30 days
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5}
                  dot={{ fill: "#2563eb", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Recent Enquiries</h2>
            </div>
            <div className="flex-1 divide-y divide-gray-50">
              {recentLeads.map((lead) => (
                <div key={lead.id} onClick={() => router.push(`/leads/${lead.id}`)}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {lead.projectInterest ?? "—"}{lead.budgetLabel ? ` • ${lead.budgetLabel}` : ""}
                    </p>
                  </div>
                  <Badge variant={statusToBadgeVariant(lead.status)} className="ml-3 shrink-0">
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-3">
              <Button variant="navy" size="sm" className="w-full justify-center gap-1.5"
                onClick={() => router.push("/leads")}>
                View all enquiries <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Project Table + Alerts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/60">
                  {["Project", "Leads", "Brochure", "WhatsApp", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectSummary.map((proj) => (
                  <tr key={proj.id} onClick={() => router.push(`/projects/${proj.id}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-900">{proj.name}</td>
                    <td className="px-4 py-3.5 text-gray-700">{proj.totalLeads}</td>
                    <td className="px-4 py-3.5 text-gray-700">{proj.totalBrochureDownloads}</td>
                    <td className="px-4 py-3.5 text-gray-700">{proj.totalWhatsappClicks}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusToBadgeVariant(proj.status)}>
                        {PROJECT_STATUS_LABEL[proj.status] ?? proj.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Operational Alerts</h2>
            </div>
            <div className="flex-1 divide-y divide-gray-50">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start justify-between px-5 py-3.5 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.detail}</p>
                  </div>
                  <Badge variant={ALERT_VARIANT[alert.type] ?? "info"} className="shrink-0">
                    {ALERT_LABEL[alert.type] ?? alert.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-3">
              <Button variant="navy" size="sm" className="w-full justify-center"
                onClick={() => router.push("/seo")}>
                Open SEO Centre
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}