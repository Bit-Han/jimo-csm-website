// //@/lib/db/queries/dashboard.ts
// import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm";
// import {
//   Building2,
//   Download,
//   MessageCircle,
//   Phone,
//   Users,
// } from "lucide-react";
// import { db } from "@/lib/db";
// import { brochures, leads, projects, seoIssues } from "@/lib/db/schema";
// import type {
//   ChartPeriod,
//   DashboardStat,
//   LeadChartDataPoint,
//   OperationalAlert,
// } from "@/lib/types/admin/dashboard";

// // ─── Lead counts ──────────────────────────────────────────────────────────

// export interface RawLeadStats {
//   totalLeads: number;
//   brochureDownloads: number;
//   totalLeadsChangePercent: number;
//   brochureChangePercent: number;
//   activeProjects: number;
// }

// export async function getDashboardLeadStats(): Promise<RawLeadStats> {
//   const now = new Date();
//   const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//   const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

//   const [
//     totalResult,
//     brochureResult,
//     recentLeadsResult,
//     prevLeadsResult,
//     recentBrochureResult,
//     prevBrochureResult,
//     activeProjectsResult,
//   ] = await Promise.all([
//     db.select({ c: count() }).from(leads),
//     db.select({ c: count() }).from(leads).where(eq(leads.source, "brochure")),
//     db
//       .select({ c: count() })
//       .from(leads)
//       .where(gte(leads.createdAt, thirtyDaysAgo)),
//     db
//       .select({ c: count() })
//       .from(leads)
//       .where(
//         and(
//           gte(leads.createdAt, sixtyDaysAgo),
//           lt(leads.createdAt, thirtyDaysAgo),
//         ),
//       ),
//     db
//       .select({ c: count() })
//       .from(leads)
//       .where(
//         and(
//           eq(leads.source, "brochure"),
//           gte(leads.createdAt, thirtyDaysAgo),
//         ),
//       ),
//     db
//       .select({ c: count() })
//       .from(leads)
//       .where(
//         and(
//           eq(leads.source, "brochure"),
//           gte(leads.createdAt, sixtyDaysAgo),
//           lt(leads.createdAt, thirtyDaysAgo),
//         ),
//       ),
//     db
//       .select({ c: count() })
//       .from(projects)
//       .where(eq(projects.publishStatus, "published")),
//   ]);

//   function calcChange(current: number, previous: number): number {
//     if (previous === 0) return current > 0 ? 100 : 0;
//     return Math.round(((current - previous) / previous) * 100);
//   }

//   const recentLeads = recentLeadsResult[0]?.c ?? 0;
//   const prevLeads = prevLeadsResult[0]?.c ?? 0;
//   const recentBrochure = recentBrochureResult[0]?.c ?? 0;
//   const prevBrochure = prevBrochureResult[0]?.c ?? 0;

//   return {
//     totalLeads: totalResult[0]?.c ?? 0,
//     brochureDownloads: brochureResult[0]?.c ?? 0,
//     totalLeadsChangePercent: calcChange(recentLeads, prevLeads),
//     brochureChangePercent: calcChange(recentBrochure, prevBrochure),
//     activeProjects: activeProjectsResult[0]?.c ?? 0,
//   };
// }

// // Build the typed DashboardStat array from real counts.
// // Icons are imported here (server-side only) — they're valid prop values
// // for server components and never serialized across the client boundary.
// export function buildDashboardStats(raw: RawLeadStats): DashboardStat[] {
//   return [
//     {
//       id: "total-leads",
//       label: "Total Leads",
//       value: raw.totalLeads,
//       changePercent: raw.totalLeadsChangePercent,
//       icon: Users,
//       iconBgClass: "bg-blue-50",
//       iconColorClass: "text-blue-600",
//     },
//     {
//       id: "brochure-downloads",
//       label: "Brochure Downloads",
//       value: raw.brochureDownloads,
//       changePercent: raw.brochureChangePercent,
//       icon: Download,
//       iconBgClass: "bg-emerald-50",
//       iconColorClass: "text-emerald-600",
//     },
//     {
//       id: "whatsapp-clicks",
//       label: "WhatsApp Clicks",
//       value: 0,
//       changeNote: "Tracking not yet wired",
//       icon: MessageCircle,
//       iconBgClass: "bg-violet-50",
//       iconColorClass: "text-violet-600",
//     },
//     {
//       id: "phone-clicks",
//       label: "Phone Clicks",
//       value: 0,
//       changeNote: "Tracking not yet wired",
//       icon: Phone,
//       iconBgClass: "bg-orange-50",
//       iconColorClass: "text-orange-600",
//     },
//     {
//       id: "active-projects",
//       label: "Active Projects",
//       value: raw.activeProjects,
//       changeNote: "Published to website",
//       icon: Building2,
//       iconBgClass: "bg-sky-50",
//       iconColorClass: "text-sky-600",
//     },
//   ];
// }

// // ─── Chart data ───────────────────────────────────────────────────────────

// export async function getDashboardChartData(): Promise<Record<ChartPeriod, LeadChartDataPoint[]>> {
//   const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

//   // Group by calendar date (UTC). For a Lagos-based product, UTC+1 means
//   // late-night leads (11pm–midnight Lagos) count on the next UTC day.
//   // This is acceptable precision for a trend chart.
//   const rawRows = await db
//     .select({
//       date: sql<string>`DATE(${leads.createdAt})::text`,
//       leadCount: count(),
//     })
//     .from(leads)
//     .where(gte(leads.createdAt, ninetyDaysAgo))
//     .groupBy(sql`DATE(${leads.createdAt})`)
//     .orderBy(sql`DATE(${leads.createdAt})`);

//   // Map "YYYY-MM-DD" → count
//   const countByDate = new Map<string, number>(
//     rawRows.map((r) => [r.date, r.leadCount]),
//   );

//   // Build full 90-day array, filling days with no leads as 0
//   const allDays: LeadChartDataPoint[] = [];

//   for (let i = 89; i >= 0; i--) {
//     const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
//     const isoDate = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
//     const displayLabel = d.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//     }); // "4 Apr"

//     allDays.push({
//       date: displayLabel,
//       leads: countByDate.get(isoDate) ?? 0,
//     });
//   }

//   return {
//     "7": allDays.slice(-7),
//     "30": allDays.slice(-30),
//     "90": allDays,
//   };
// }

// // ─── Operational alerts ───────────────────────────────────────────────────

// export async function getDashboardOperationalAlerts(): Promise<OperationalAlert[]> {
//   const alerts: OperationalAlert[] = [];

//   const [openSeoResult, publishedProjectRows, brochureProjectIds] =
//     await Promise.all([
//       // Count open SEO issues
//       db
//         .select({ c: count() })
//         .from(seoIssues)
//         .where(eq(seoIssues.status, "open")),
//       // Published projects
//       db
//         .select({ id: projects.id, name: projects.name })
//         .from(projects)
//         .where(eq(projects.publishStatus, "published")),
//       // Projects with at least one active brochure
//       db
//         .select({ projectId: brochures.projectId })
//         .from(brochures)
//         .where(eq(brochures.status, "active")),
//     ]);

//   const openSeoCount = openSeoResult[0]?.c ?? 0;
//   const brochureProjectSet = new Set(
//     brochureProjectIds.map((r) => r.projectId),
//   );
//   const projectsMissingBrochure = publishedProjectRows.filter(
//     (p) => !brochureProjectSet.has(p.id),
//   );

//   // ── SEO alert ─────────────────────────────────────────────────────────
//   if (openSeoCount > 0) {
//     alerts.push({
//       id: "seo-issues",
//       message: `${openSeoCount} page${openSeoCount !== 1 ? "s" : ""} with open SEO issues`,
//       detail: "Fix issues to improve search performance",
//       severity: "needs-attention",
//       actionLabel: "Open SEO Centre",
//       actionHref: "/admin/seo-centre",
//     });
//   } else {
//     alerts.push({
//       id: "seo-issues",
//       message: "No open SEO issues",
//       detail: "All tracked pages are SEO-compliant",
//       severity: "healthy",
//     });
//   }

//   // ── Brochure alert ────────────────────────────────────────────────────
//   if (projectsMissingBrochure.length > 0) {
//     alerts.push({
//       id: "missing-brochure",
//       message: `${projectsMissingBrochure.length} published project${projectsMissingBrochure.length !== 1 ? "s" : ""} without a brochure`,
//       detail:
//         projectsMissingBrochure.map((p) => p.name).join(", "),
//       severity: "review",
//       actionLabel: "Upload Brochures",
//       actionHref: "/admin/brochures",
//     });
//   } else if (publishedProjectRows.length === 0) {
//     alerts.push({
//       id: "missing-brochure",
//       message: "No published projects yet",
//       detail: "Publish a project to start capturing leads",
//       severity: "review",
//       actionLabel: "Go to Projects",
//       actionHref: "/admin/projects",
//     });
//   } else {
//     alerts.push({
//       id: "missing-brochure",
//       message: "All published projects have brochures",
//       detail: "Brochure download lead capture is active",
//       severity: "healthy",
//     });
//   }

//   // ── CRM alert — hardcoded until HubSpot integration ───────────────────
//   alerts.push({
//     id: "crm-sync",
//     message: "CRM not connected",
//     detail: "Connect HubSpot in Settings to sync leads automatically",
//     severity: "review",
//     actionLabel: "Go to Settings",
//     actionHref: "/admin/settings",
//   });

//   return alerts;
// }


// lib/db/queries/dashboard.ts
import { and, asc, count, desc, eq, gte, inArray, lt, ne } from "drizzle-orm";
import { Building2, Download, Megaphone, MessageCircle, Users } from "lucide-react";
import { db } from "@/lib/db";
import { leads, projects, landingPages, trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import { getAdminProjectSummaryStats } from "@/lib/db/queries/projects";
import type {
	ChartPeriod,
	DashboardStat,
	LeadChartDataPoint,
	LeadStatus,
	OperationalAlert,
	ProjectStatRow,
	RecentEnquiry,
} from "@/lib/types/admin/dashboard";
import type { AdminDisplayStatus } from "@/lib/types/admin/project";

const DB_TIMEOUT_MS = 8000;

function pctChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

/**
 * ASSUMPTION — I don't have visibility into how getAdminProjectListRows
 * (used on /admin/projects) currently derives AdminDisplayStatus for its
 * own status badge. This mirrors the most defensible reading of the
 * three-way type: a completed project always shows "completed"; anything
 * published and not yet completed shows "active" (actively marketed);
 * anything still in draft shows "under-development". If /admin/projects
 * computes this differently, tell me and I'll unify both into one shared
 * helper so the badge never disagrees between the two pages.
 */
function deriveDisplayStatus(
	status: "completed" | "under-development",
	publishStatus: "draft" | "published",
): AdminDisplayStatus {
	if (status === "completed") return "completed";
	if (publishStatus === "published") return "active";
	return "under-development";
}

// ── Stat cards ───────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStat[]> {
	const now = Date.now();
	const periodStart = new Date(now - 30 * 24 * 60 * 60 * 1000);
	const previousStart = new Date(now - 60 * 24 * 60 * 60 * 1000);

	const [
		currentLeads,
		previousLeads,
		currentBrochure,
		previousBrochure,
		currentWhatsapp,
		previousWhatsapp,
		activeProjectsRow,
		draftProjectsRow,
		activeCampaignsRow,
		draftCampaignsRow,
	] = await Promise.all([
		withTimeout(
			db.select({ c: count() }).from(leads).where(gte(leads.createdAt, periodStart)),
			DB_TIMEOUT_MS,
			"dashboardStats:currentLeads",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(leads)
				.where(and(gte(leads.createdAt, previousStart), lt(leads.createdAt, periodStart))),
			DB_TIMEOUT_MS,
			"dashboardStats:previousLeads",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(trackingEventLogs)
				.where(
					and(
						eq(trackingEventLogs.eventName, "brochure_form_submit"),
						gte(trackingEventLogs.createdAt, periodStart),
					),
				),
			DB_TIMEOUT_MS,
			"dashboardStats:currentBrochure",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(trackingEventLogs)
				.where(
					and(
						eq(trackingEventLogs.eventName, "brochure_form_submit"),
						gte(trackingEventLogs.createdAt, previousStart),
						lt(trackingEventLogs.createdAt, periodStart),
					),
				),
			DB_TIMEOUT_MS,
			"dashboardStats:previousBrochure",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(trackingEventLogs)
				.where(
					and(
						eq(trackingEventLogs.eventName, "whatsapp_click"),
						gte(trackingEventLogs.createdAt, periodStart),
					),
				),
			DB_TIMEOUT_MS,
			"dashboardStats:currentWhatsapp",
		),
		withTimeout(
			db
				.select({ c: count() })
				.from(trackingEventLogs)
				.where(
					and(
						eq(trackingEventLogs.eventName, "whatsapp_click"),
						gte(trackingEventLogs.createdAt, previousStart),
						lt(trackingEventLogs.createdAt, periodStart),
					),
				),
			DB_TIMEOUT_MS,
			"dashboardStats:previousWhatsapp",
		),
		withTimeout(
			db.select({ c: count() }).from(projects).where(eq(projects.publishStatus, "published")),
			DB_TIMEOUT_MS,
			"dashboardStats:activeProjects",
		),
		withTimeout(
			db.select({ c: count() }).from(projects).where(eq(projects.publishStatus, "draft")),
			DB_TIMEOUT_MS,
			"dashboardStats:draftProjects",
		),
		withTimeout(
			db.select({ c: count() }).from(landingPages).where(eq(landingPages.publishStatus, "published")),
			DB_TIMEOUT_MS,
			"dashboardStats:activeCampaigns",
		),
		withTimeout(
			db.select({ c: count() }).from(landingPages).where(eq(landingPages.publishStatus, "draft")),
			DB_TIMEOUT_MS,
			"dashboardStats:draftCampaigns",
		),
	]);

	const leadsCurrent = currentLeads[0]?.c ?? 0;
	const leadsPrevious = previousLeads[0]?.c ?? 0;
	const brochureCurrent = currentBrochure[0]?.c ?? 0;
	const brochurePrevious = previousBrochure[0]?.c ?? 0;
	const whatsappCurrent = currentWhatsapp[0]?.c ?? 0;
	const whatsappPrevious = previousWhatsapp[0]?.c ?? 0;
	const activeProjects = activeProjectsRow[0]?.c ?? 0;
	const draftProjects = draftProjectsRow[0]?.c ?? 0;
	const activeCampaigns = activeCampaignsRow[0]?.c ?? 0;
	const draftCampaigns = draftCampaignsRow[0]?.c ?? 0;

	return [
		{
			id: "total-leads",
			label: "Total Leads",
			value: leadsCurrent,
			changePercent: pctChange(leadsCurrent, leadsPrevious),
			icon: Users,
			iconBgClass: "bg-blue-50",
			iconColorClass: "text-blue-600",
		},
		{
			id: "brochure-downloads",
			label: "Brochure Downloads",
			value: brochureCurrent,
			changePercent: pctChange(brochureCurrent, brochurePrevious),
			icon: Download,
			iconBgClass: "bg-emerald-50",
			iconColorClass: "text-emerald-600",
		},
		{
			id: "whatsapp-clicks",
			label: "WhatsApp Clicks",
			value: whatsappCurrent,
			changePercent: pctChange(whatsappCurrent, whatsappPrevious),
			icon: MessageCircle,
			iconBgClass: "bg-green-50",
			iconColorClass: "text-green-600",
		},
		{
			id: "active-projects",
			label: "Active Projects",
			value: activeProjects,
			changeNote: draftProjects > 0 ? `${draftProjects} in draft` : "All published",
			icon: Building2,
			iconBgClass: "bg-violet-50",
			iconColorClass: "text-violet-600",
		},
		{
			id: "active-campaigns",
			label: "Active Campaigns",
			value: activeCampaigns,
			changeNote: draftCampaigns > 0 ? `${draftCampaigns} need review` : "All published",
			icon: Megaphone,
			iconBgClass: "bg-orange-50",
			iconColorClass: "text-orange-600",
		},
	];
}

// ── Lead chart ───────────────────────────────────────────────────────────────

function toDayKey(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function formatDayLabel(dayKey: string): string {
	const d = new Date(`${dayKey}T00:00:00Z`);
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/**
 * Builds one point per calendar day, but only across the range of days
 * that could actually have real data: from `firstLeadDayKey` (the
 * earliest lead ever recorded) up to today, capped at `days` back. This
 * is deliberate — a 90-day chart on a site that has only had leads for
 * 10 days shows 10 real points, not 90 points where 80 of them are
 * fabricated zeros implying "we were tracking and got nothing." Days
 * within the real range that genuinely had no leads still show 0, since
 * that's a true data point, not a fabricated one.
 */
function buildDailySeries(
	days: number,
	leadDayKeys: string[],
	firstLeadDayKey: string,
): LeadChartDataPoint[] {
	const today = new Date();
	const todayKey = toDayKey(today);

	const nominalStart = new Date(today);
	nominalStart.setUTCDate(nominalStart.getUTCDate() - (days - 1));
	const nominalStartKey = toDayKey(nominalStart);

	const rangeStartKey = nominalStartKey > firstLeadDayKey ? nominalStartKey : firstLeadDayKey;

	const counts = new Map<string, number>();
	for (const key of leadDayKeys) {
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	const series: LeadChartDataPoint[] = [];
	const cursor = new Date(`${rangeStartKey}T00:00:00Z`);
	const end = new Date(`${todayKey}T00:00:00Z`);

	while (cursor <= end) {
		const key = toDayKey(cursor);
		series.push({ date: formatDayLabel(key), leads: counts.get(key) ?? 0 });
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}

	return series;
}

export async function getLeadChartData(): Promise<Record<ChartPeriod, LeadChartDataPoint[]>> {
	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setUTCDate(ninetyDaysAgo.getUTCDate() - 89);

	const [earliestRows, recentRows] = await Promise.all([
		withTimeout(
			db.select({ createdAt: leads.createdAt }).from(leads).orderBy(asc(leads.createdAt)).limit(1),
			DB_TIMEOUT_MS,
			"leadChartData:earliest",
		),
		withTimeout(
			db.select({ createdAt: leads.createdAt }).from(leads).where(gte(leads.createdAt, ninetyDaysAgo)),
			DB_TIMEOUT_MS,
			"leadChartData:recent",
		),
	]);

	const firstLead = earliestRows[0];
	if (!firstLead) {
		// No leads have ever been recorded — nothing honest to chart yet.
		return { "7": [], "30": [], "90": [] };
	}

	const firstLeadDayKey = toDayKey(firstLead.createdAt);
	const dayKeys = recentRows.map((r) => toDayKey(r.createdAt));

	return {
		"7": buildDailySeries(7, dayKeys, firstLeadDayKey),
		"30": buildDailySeries(30, dayKeys, firstLeadDayKey),
		"90": buildDailySeries(90, dayKeys, firstLeadDayKey),
	};
}

// ── Recent enquiries ─────────────────────────────────────────────────────────

export async function getRecentEnquiries(limit = 6): Promise<RecentEnquiry[]> {
	const rows = await withTimeout(
		db
			.select({
				id: leads.id,
				fullName: leads.fullName,
				budgetRange: leads.budgetRange,
				status: leads.status,
				projectSlug: leads.projectSlug,
				landingPageSlug: leads.landingPageSlug,
				projectName: projects.name,
			})
			.from(leads)
			.leftJoin(projects, eq(leads.projectId, projects.id))
			// Recent Enquiries is a "needs attention" pipeline view — a lead
			// already marked won or lost is closed, not something an admin
			// needs to see on the dashboard's quick-glance panel. This
			// exclusion is also required for type correctness: LeadStatus
			// only has 5 values, deliberately not including won/lost.
			.where(and(ne(leads.status, "won"), ne(leads.status, "lost")))
			.orderBy(desc(leads.createdAt))
			.limit(limit),
		DB_TIMEOUT_MS,
		"getRecentEnquiries",
	);

	return rows.map((row) => {
		const projectLabel =
			row.projectName ??
			row.projectSlug ??
			(row.landingPageSlug ? `Landing Page: ${row.landingPageSlug}` : "General Enquiry");
		const budgetLabel = row.budgetRange ? ` • ${row.budgetRange}` : "";

		return {
			id: row.id,
			name: row.fullName,
			projectAndBudget: `${projectLabel}${budgetLabel}`,
			// Safe: the WHERE clause above guarantees this is never "won" or
			// "lost" at runtime, even though the DB enum allows those values.
			status: row.status as LeadStatus,
		};
	});
}

// ── Operational alerts ───────────────────────────────────────────────────────

export async function getOperationalAlerts(): Promise<OperationalAlert[]> {
	const [summaryStats, newLeadsRow] = await Promise.all([
		// Reused directly from the Projects page's own query — guarantees
		// this count never disagrees with what /admin/projects shows.
		getAdminProjectSummaryStats(),
		withTimeout(
			db.select({ c: count() }).from(leads).where(eq(leads.status, "new")),
			DB_TIMEOUT_MS,
			"operationalAlerts:newLeads",
		),
	]);

	const newLeadsCount = newLeadsRow[0]?.c ?? 0;

	return [
		{
			id: "new-leads",
			message:
				newLeadsCount > 0
					? `${newLeadsCount} new lead${newLeadsCount === 1 ? "" : "s"} need follow-up`
					: "No leads waiting on follow-up",
			detail:
				newLeadsCount > 0
					? "New leads have not been contacted yet."
					: "All new leads have been contacted.",
			severity: newLeadsCount > 0 ? "needs-attention" : "healthy",
			actionLabel: newLeadsCount > 0 ? "View Leads" : undefined,
			actionHref: newLeadsCount > 0 ? "/admin/leads" : undefined,
		},
		{
			id: "missing-brochure",
			message:
				summaryStats.missingBrochure > 0
					? `${summaryStats.missingBrochure} project${summaryStats.missingBrochure === 1 ? "" : "s"} missing a brochure`
					: "Every published project has a brochure",
			detail: summaryStats.missingBrochureNote,
			severity: summaryStats.missingBrochure > 0 ? "needs-attention" : "healthy",
			actionLabel: summaryStats.missingBrochure > 0 ? "Upload Brochure" : undefined,
			actionHref: summaryStats.missingBrochure > 0 ? "/admin/brochures" : undefined,
		},
		{
			id: "draft-projects",
			message:
				summaryStats.draftProjects > 0
					? `${summaryStats.draftProjects} project${summaryStats.draftProjects === 1 ? "" : "s"} still in draft`
					: "No projects waiting in draft",
			detail: summaryStats.draftProjectsNote,
			severity: summaryStats.draftProjects > 0 ? "review" : "healthy",
			actionLabel: summaryStats.draftProjects > 0 ? "Review Drafts" : undefined,
			actionHref: summaryStats.draftProjects > 0 ? "/admin/projects" : undefined,
		},
	];
}

// ── Per-project stat rows ────────────────────────────────────────────────────

export async function getProjectStatRows(limitCount = 8): Promise<ProjectStatRow[]> {
	const now = Date.now();
	const periodStart = new Date(now - 30 * 24 * 60 * 60 * 1000);
	const previousStart = new Date(now - 60 * 24 * 60 * 60 * 1000);

	const projectRows = await withTimeout(
		db
			.select({
				id: projects.id,
				slug: projects.slug,
				name: projects.name,
				status: projects.status,
				publishStatus: projects.publishStatus,
			})
			.from(projects)
			.orderBy(desc(projects.updatedAt))
			.limit(limitCount),
		DB_TIMEOUT_MS,
		"projectStatRows:projects",
	);

	if (projectRows.length === 0) return [];

	const projectIds = projectRows.map((p) => p.id);
	const projectSlugs = projectRows.map((p) => p.slug);

	const [allLeadRows, recentLeadRows, previousLeadRows, brochureRows, whatsappRows] =
		await Promise.all([
			withTimeout(
				db
					.select({ projectId: leads.projectId, c: count() })
					.from(leads)
					.where(inArray(leads.projectId, projectIds))
					.groupBy(leads.projectId),
				DB_TIMEOUT_MS,
				"projectStatRows:allLeads",
			),
			withTimeout(
				db
					.select({ projectId: leads.projectId, c: count() })
					.from(leads)
					.where(and(inArray(leads.projectId, projectIds), gte(leads.createdAt, periodStart)))
					.groupBy(leads.projectId),
				DB_TIMEOUT_MS,
				"projectStatRows:recentLeads",
			),
			withTimeout(
				db
					.select({ projectId: leads.projectId, c: count() })
					.from(leads)
					.where(
						and(
							inArray(leads.projectId, projectIds),
							gte(leads.createdAt, previousStart),
							lt(leads.createdAt, periodStart),
						),
					)
					.groupBy(leads.projectId),
				DB_TIMEOUT_MS,
				"projectStatRows:previousLeads",
			),
			withTimeout(
				db
					.select({ projectSlug: trackingEventLogs.projectSlug, c: count() })
					.from(trackingEventLogs)
					.where(
						and(
							eq(trackingEventLogs.eventName, "brochure_form_submit"),
							inArray(trackingEventLogs.projectSlug, projectSlugs),
						),
					)
					.groupBy(trackingEventLogs.projectSlug),
				DB_TIMEOUT_MS,
				"projectStatRows:brochures",
			),
			withTimeout(
				db
					.select({ projectSlug: trackingEventLogs.projectSlug, c: count() })
					.from(trackingEventLogs)
					.where(
						and(
							eq(trackingEventLogs.eventName, "whatsapp_click"),
							inArray(trackingEventLogs.projectSlug, projectSlugs),
						),
					)
					.groupBy(trackingEventLogs.projectSlug),
				DB_TIMEOUT_MS,
				"projectStatRows:whatsapp",
			),
		]);

	function lookupById(rows: { projectId: string | null; c: number }[], id: string): number {
		return rows.find((r) => r.projectId === id)?.c ?? 0;
	}
	function lookupBySlug(rows: { projectSlug: string | null; c: number }[], slug: string): number {
		return rows.find((r) => r.projectSlug === slug)?.c ?? 0;
	}

	return projectRows
		.map((p) => {
			const recentLeads = lookupById(recentLeadRows, p.id);
			const previousLeads = lookupById(previousLeadRows, p.id);
			return {
				id: p.id,
				name: p.name,
				leads: lookupById(allLeadRows, p.id),
				leadChangePercent: pctChange(recentLeads, previousLeads),
				brochures: lookupBySlug(brochureRows, p.slug),
				whatsapp: lookupBySlug(whatsappRows, p.slug),
				status: deriveDisplayStatus(p.status, p.publishStatus),
			};
		})
		.sort((a, b) => b.leads - a.leads);
}