import { Building2, Download, MessageCircle, Phone, Users } from "lucide-react";
import type {
	ChartPeriod,
	DashboardStat,
	LeadChartDataPoint,
	OperationalAlert,
	ProjectStatRow,
	RecentEnquiry,
} from "@/lib/types/admin/dashboard";

// ─── Stats ────────────────────────────────────────────────────────────────────
// TODO (integration stage): replace with real Drizzle queries:
//   Total Leads      → db.select({ count: count() }).from(leads)
//   Brochure Downloads → db.select({ count: count() }).from(leads).where(eq(leads.source, "brochure"))
//   WhatsApp Clicks  → from tracking_events log (future)
//   Phone Clicks     → from tracking_events log (future)
//   Active Projects  → db.select({ count: count() }).from(projects).where(eq(projects.publishStatus, "published"))
export const mockDashboardStats: DashboardStat[] = [
	{
		id: "total-leads",
		label: "Total Leads",
		value: 428,
		changePercent: 18,
		icon: Users,
		iconBgClass: "bg-blue-50",
		iconColorClass: "text-blue-600",
	},
	{
		id: "brochure-downloads",
		label: "Brochure Downloads",
		value: 193,
		changePercent: 19,
		icon: Download,
		iconBgClass: "bg-emerald-50",
		iconColorClass: "text-emerald-600",
	},
	{
		id: "whatsapp-clicks",
		label: "WhatsApp Clicks",
		value: 87,
		changePercent: 16,
		icon: MessageCircle,
		iconBgClass: "bg-violet-50",
		iconColorClass: "text-violet-600",
	},
	{
		id: "phone-clicks",
		label: "Phone Clicks",
		value: 42,
		changePercent: 12,
		icon: Phone,
		iconBgClass: "bg-orange-50",
		iconColorClass: "text-orange-600",
	},
	{
		id: "active-projects",
		label: "Active Projects",
		value: 6,
		changeNote: "2 in pre-launch",
		icon: Building2,
		iconBgClass: "bg-sky-50",
		iconColorClass: "text-sky-600",
	},
];

// ─── Chart data ───────────────────────────────────────────────────────────────
// 90 deterministic daily lead counts trending upward.
// Fixed reference date: July 3 2026 (day 90). Dates computed at module init.
// TODO (integration stage):
//   db.select({ date: sql<string>`date_trunc('day', ${leads.createdAt})`, count: count() })
//     .from(leads)
//     .where(gte(leads.createdAt, subDays(new Date(), days)))
//     .groupBy(sql`1`)
//     .orderBy(sql`1`)

const COUNTS_90: number[] = [
	// Apr 4–10
	6, 8, 5, 9, 7, 11, 8,
	// Apr 11–17
	10, 9, 12, 7, 13, 10, 14,
	// Apr 18–24
	11, 13, 9, 15, 12, 16, 10,
	// Apr 25–May 1
	17, 13, 18, 14, 15, 12, 19,
	// May 2–8
	15, 20, 13, 21, 16, 22, 14,
	// May 9–15
	23, 17, 24, 15, 25, 18, 26,
	// May 16–22
	16, 27, 19, 28, 17, 29, 20,
	// May 23–29
	27, 18, 28, 21, 29, 22, 30,
	// May 30–Jun 5
	20, 31, 23, 29, 21, 32, 24,
	// Jun 6–12
	30, 22, 33, 25, 31, 23, 34,
	// Jun 13–19
	26, 32, 24, 35, 27, 33, 25,
	// Jun 20–26
	36, 28, 34, 26, 37, 29, 35,
	// Jun 27–Jul 3
	28, 36, 30, 38, 34, 36, 35,
];

const DATES_90: string[] = [
	"4 Apr",
	"5 Apr",
	"6 Apr",
	"7 Apr",
	"8 Apr",
	"9 Apr",
	"10 Apr",
	"11 Apr",
	"12 Apr",
	"13 Apr",
	"14 Apr",
	"15 Apr",
	"16 Apr",
	"17 Apr",
	"18 Apr",
	"19 Apr",
	"20 Apr",
	"21 Apr",
	"22 Apr",
	"23 Apr",
	"24 Apr",
	"25 Apr",
	"26 Apr",
	"27 Apr",
	"28 Apr",
	"29 Apr",
	"30 Apr",
	"1 May",
	"2 May",
	"3 May",
	"4 May",
	"5 May",
	"6 May",
	"7 May",
	"8 May",
	"9 May",
	"10 May",
	"11 May",
	"12 May",
	"13 May",
	"14 May",
	"15 May",
	"16 May",
	"17 May",
	"18 May",
	"19 May",
	"20 May",
	"21 May",
	"22 May",
	"23 May",
	"24 May",
	"25 May",
	"26 May",
	"27 May",
	"28 May",
	"29 May",
	"30 May",
	"31 May",
	"1 Jun",
	"2 Jun",
	"3 Jun",
	"4 Jun",
	"5 Jun",
	"6 Jun",
	"7 Jun",
	"8 Jun",
	"9 Jun",
	"10 Jun",
	"11 Jun",
	"12 Jun",
	"13 Jun",
	"14 Jun",
	"15 Jun",
	"16 Jun",
	"17 Jun",
	"18 Jun",
	"19 Jun",
	"20 Jun",
	"21 Jun",
	"22 Jun",
	"23 Jun",
	"24 Jun",
	"25 Jun",
	"26 Jun",
	"27 Jun",
	"28 Jun",
	"29 Jun",
	"30 Jun",
	"1 Jul",
	"2 Jul",
	"3 Jul",
];

function buildChartData(days: number): LeadChartDataPoint[] {
	const start = 90 - days;
	return COUNTS_90.slice(start).map((leads, i) => ({
		date: DATES_90[start + i] ?? "",
		leads,
	}));
}

export const mockLeadChartData: Record<ChartPeriod, LeadChartDataPoint[]> = {
	"7": buildChartData(7),
	"30": buildChartData(30),
	"90": buildChartData(90),
};

// ─── Recent Enquiries ─────────────────────────────────────────────────────────
// TODO (integration stage):
//   db.query.leads.findMany({ limit: 5, orderBy: [desc(leads.createdAt)], with: { project: true } })
export const mockRecentEnquiries: RecentEnquiry[] = [
	{
		id: "1",
		name: "Adebayo Olalekan",
		projectAndBudget: "Jimo Residences · ₦20M–₦50M",
		status: "new",
	},
	{
		id: "2",
		name: "Emeka Chidi",
		projectAndBudget: "Vatican Court · ₦90M–₦120M",
		status: "contacted",
	},
	{
		id: "3",
		name: "Funmi Okafor",
		projectAndBudget: "Yaba Hospitality Hub · ₦200M+",
		status: "qualified",
	},
	{
		id: "4",
		name: "Bolanle Bello",
		projectAndBudget: "Jimo Residences Studio · ₦60M–₦80M",
		status: "new",
	},
	{
		id: "5",
		name: "Ibrahim Musa",
		projectAndBudget: "Future Project Land · ₦50M–₦100M",
		status: "inspection",
	},
];

// ─── Project Stats ────────────────────────────────────────────────────────────
// TODO (integration stage):
//   db.query.projects.findMany({ with: { leads: { columns: { id: true } } } })
//   then aggregate lead counts per project
export const mockProjectStats: ProjectStatRow[] = [
	{
		id: "jimo-residences-yaba",
		name: "Jimo Residences Yaba",
		leads: 428,
		leadChangePercent: 18,
		brochures: 214,
		whatsapp: 85,
		status: "under-development",
	},
	{
		id: "vatican-court",
		name: "Vatican Court",
		leads: 316,
		leadChangePercent: 12,
		brochures: 158,
		whatsapp: 63,
		status: "active",
	},
	{
		id: "yaba-hospitality-hub",
		name: "Yaba Hospitality Hub",
		leads: 214,
		leadChangePercent: 24,
		brochures: 107,
		whatsapp: 42,
		status: "completed",
	},
	{
		id: "future-project",
		name: "Future Project",
		leads: 86,
		leadChangePercent: -8,
		brochures: 43,
		whatsapp: 17,
		status: "under-development",
	},
];

// ─── Operational Alerts ───────────────────────────────────────────────────────
// TODO (integration stage):
//   Derived from:
//   - seoIssues table (count open issues)
//   - brochures table (projects with no active brochure)
//   - trackingIntegrations table (isConnected checks)
export const mockOperationalAlerts: OperationalAlert[] = [
	{
		id: "seo-descriptions",
		message: "2 pages missing SEO descriptions",
		detail: "SEO centre needs attention",
		severity: "needs-attention",
		actionLabel: "Open SEO Centre",
		actionHref: "/admin/seo-centre",
	},
	{
		id: "no-brochure",
		message: "1 active project has no brochure",
		detail: "Upload brochure or hide download CTA",
		severity: "review",
		actionLabel: "Open Brochures",
		actionHref: "/admin/brochures",
	},
	{
		id: "crm-sync",
		message: "CRM sync is healthy",
		detail: "Last sync 5 minutes ago",
		severity: "healthy",
	},
];
