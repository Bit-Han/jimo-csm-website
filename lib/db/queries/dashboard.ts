import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm";
import {
  Building2,
  Download,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import { brochures, leads, projects, seoIssues } from "@/lib/db/schema";
import type {
  ChartPeriod,
  DashboardStat,
  LeadChartDataPoint,
  OperationalAlert,
} from "@/lib/types/admin/dashboard";

// ─── Lead counts ──────────────────────────────────────────────────────────

export interface RawLeadStats {
  totalLeads: number;
  brochureDownloads: number;
  totalLeadsChangePercent: number;
  brochureChangePercent: number;
  activeProjects: number;
}

export async function getDashboardLeadStats(): Promise<RawLeadStats> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalResult,
    brochureResult,
    recentLeadsResult,
    prevLeadsResult,
    recentBrochureResult,
    prevBrochureResult,
    activeProjectsResult,
  ] = await Promise.all([
    db.select({ c: count() }).from(leads),
    db.select({ c: count() }).from(leads).where(eq(leads.source, "brochure")),
    db
      .select({ c: count() })
      .from(leads)
      .where(gte(leads.createdAt, thirtyDaysAgo)),
    db
      .select({ c: count() })
      .from(leads)
      .where(
        and(
          gte(leads.createdAt, sixtyDaysAgo),
          lt(leads.createdAt, thirtyDaysAgo),
        ),
      ),
    db
      .select({ c: count() })
      .from(leads)
      .where(
        and(
          eq(leads.source, "brochure"),
          gte(leads.createdAt, thirtyDaysAgo),
        ),
      ),
    db
      .select({ c: count() })
      .from(leads)
      .where(
        and(
          eq(leads.source, "brochure"),
          gte(leads.createdAt, sixtyDaysAgo),
          lt(leads.createdAt, thirtyDaysAgo),
        ),
      ),
    db
      .select({ c: count() })
      .from(projects)
      .where(eq(projects.publishStatus, "published")),
  ]);

  function calcChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const recentLeads = recentLeadsResult[0]?.c ?? 0;
  const prevLeads = prevLeadsResult[0]?.c ?? 0;
  const recentBrochure = recentBrochureResult[0]?.c ?? 0;
  const prevBrochure = prevBrochureResult[0]?.c ?? 0;

  return {
    totalLeads: totalResult[0]?.c ?? 0,
    brochureDownloads: brochureResult[0]?.c ?? 0,
    totalLeadsChangePercent: calcChange(recentLeads, prevLeads),
    brochureChangePercent: calcChange(recentBrochure, prevBrochure),
    activeProjects: activeProjectsResult[0]?.c ?? 0,
  };
}

// Build the typed DashboardStat array from real counts.
// Icons are imported here (server-side only) — they're valid prop values
// for server components and never serialized across the client boundary.
export function buildDashboardStats(raw: RawLeadStats): DashboardStat[] {
  return [
    {
      id: "total-leads",
      label: "Total Leads",
      value: raw.totalLeads,
      changePercent: raw.totalLeadsChangePercent,
      icon: Users,
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
    },
    {
      id: "brochure-downloads",
      label: "Brochure Downloads",
      value: raw.brochureDownloads,
      changePercent: raw.brochureChangePercent,
      icon: Download,
      iconBgClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
    },
    {
      id: "whatsapp-clicks",
      label: "WhatsApp Clicks",
      value: 0,
      changeNote: "Tracking not yet wired",
      icon: MessageCircle,
      iconBgClass: "bg-violet-50",
      iconColorClass: "text-violet-600",
    },
    {
      id: "phone-clicks",
      label: "Phone Clicks",
      value: 0,
      changeNote: "Tracking not yet wired",
      icon: Phone,
      iconBgClass: "bg-orange-50",
      iconColorClass: "text-orange-600",
    },
    {
      id: "active-projects",
      label: "Active Projects",
      value: raw.activeProjects,
      changeNote: "Published to website",
      icon: Building2,
      iconBgClass: "bg-sky-50",
      iconColorClass: "text-sky-600",
    },
  ];
}

// ─── Chart data ───────────────────────────────────────────────────────────

export async function getDashboardChartData(): Promise<Record<ChartPeriod, LeadChartDataPoint[]>> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Group by calendar date (UTC). For a Lagos-based product, UTC+1 means
  // late-night leads (11pm–midnight Lagos) count on the next UTC day.
  // This is acceptable precision for a trend chart.
  const rawRows = await db
    .select({
      date: sql<string>`DATE(${leads.createdAt})::text`,
      leadCount: count(),
    })
    .from(leads)
    .where(gte(leads.createdAt, ninetyDaysAgo))
    .groupBy(sql`DATE(${leads.createdAt})`)
    .orderBy(sql`DATE(${leads.createdAt})`);

  // Map "YYYY-MM-DD" → count
  const countByDate = new Map<string, number>(
    rawRows.map((r) => [r.date, r.leadCount]),
  );

  // Build full 90-day array, filling days with no leads as 0
  const allDays: LeadChartDataPoint[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const isoDate = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const displayLabel = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }); // "4 Apr"

    allDays.push({
      date: displayLabel,
      leads: countByDate.get(isoDate) ?? 0,
    });
  }

  return {
    "7": allDays.slice(-7),
    "30": allDays.slice(-30),
    "90": allDays,
  };
}

// ─── Operational alerts ───────────────────────────────────────────────────

export async function getDashboardOperationalAlerts(): Promise<OperationalAlert[]> {
  const alerts: OperationalAlert[] = [];

  const [openSeoResult, publishedProjectRows, brochureProjectIds] =
    await Promise.all([
      // Count open SEO issues
      db
        .select({ c: count() })
        .from(seoIssues)
        .where(eq(seoIssues.status, "open")),
      // Published projects
      db
        .select({ id: projects.id, name: projects.name })
        .from(projects)
        .where(eq(projects.publishStatus, "published")),
      // Projects with at least one active brochure
      db
        .select({ projectId: brochures.projectId })
        .from(brochures)
        .where(eq(brochures.status, "active")),
    ]);

  const openSeoCount = openSeoResult[0]?.c ?? 0;
  const brochureProjectSet = new Set(
    brochureProjectIds.map((r) => r.projectId),
  );
  const projectsMissingBrochure = publishedProjectRows.filter(
    (p) => !brochureProjectSet.has(p.id),
  );

  // ── SEO alert ─────────────────────────────────────────────────────────
  if (openSeoCount > 0) {
    alerts.push({
      id: "seo-issues",
      message: `${openSeoCount} page${openSeoCount !== 1 ? "s" : ""} with open SEO issues`,
      detail: "Fix issues to improve search performance",
      severity: "needs-attention",
      actionLabel: "Open SEO Centre",
      actionHref: "/admin/seo-centre",
    });
  } else {
    alerts.push({
      id: "seo-issues",
      message: "No open SEO issues",
      detail: "All tracked pages are SEO-compliant",
      severity: "healthy",
    });
  }

  // ── Brochure alert ────────────────────────────────────────────────────
  if (projectsMissingBrochure.length > 0) {
    alerts.push({
      id: "missing-brochure",
      message: `${projectsMissingBrochure.length} published project${projectsMissingBrochure.length !== 1 ? "s" : ""} without a brochure`,
      detail:
        projectsMissingBrochure.map((p) => p.name).join(", "),
      severity: "review",
      actionLabel: "Upload Brochures",
      actionHref: "/admin/brochures",
    });
  } else if (publishedProjectRows.length === 0) {
    alerts.push({
      id: "missing-brochure",
      message: "No published projects yet",
      detail: "Publish a project to start capturing leads",
      severity: "review",
      actionLabel: "Go to Projects",
      actionHref: "/admin/projects",
    });
  } else {
    alerts.push({
      id: "missing-brochure",
      message: "All published projects have brochures",
      detail: "Brochure download lead capture is active",
      severity: "healthy",
    });
  }

  // ── CRM alert — hardcoded until HubSpot integration ───────────────────
  alerts.push({
    id: "crm-sync",
    message: "CRM not connected",
    detail: "Connect HubSpot in Settings to sync leads automatically",
    severity: "review",
    actionLabel: "Go to Settings",
    actionHref: "/admin/settings",
  });

  return alerts;
}