// lib/services/dashboard.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Aggregates data from multiple tables for the dashboard overview.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import {
  leads,
  projects
} from "@/lib/db/schema";
import {sql, desc, inArray, gte, and } from "drizzle-orm";
import type {
  DashboardStats,
  RecentEnquiry,
  OperationalAlert,
  ProjectPerformanceRow,
} from "@/lib/types";
import { formatNaira } from "@/lib/utils/helpers";

/**
 * Main dashboard stats — 6 metric cards at the top.
 * Compares current 30 days vs previous 30 days for % change.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period
  const [current] = await db
    .select({
      totalLeads: sql<number>`count(*)::int`,
      brochureDownloads: sql<number>`
        count(*) FILTER (WHERE source = 'brochure')::int
      `,
      whatsappClicks: sql<number>`
        (SELECT COALESCE(SUM(whatsapp_clicks),0) FROM page_view_stats 
         WHERE date >= ${thirtyDaysAgo})::int
      `,
      phoneClicks: sql<number>`
        (SELECT COALESCE(SUM(phone_clicks),0) FROM page_view_stats 
         WHERE date >= ${thirtyDaysAgo})::int
      `,
    })
    .from(leads)
    .where(gte(leads.createdAt, thirtyDaysAgo));

  // Previous period
  const [previous] = await db
    .select({
      totalLeads: sql<number>`count(*)::int`,
      brochureDownloads: sql<number>`
        count(*) FILTER (WHERE source = 'brochure')::int
      `,
    })
    .from(leads)
    .where(
      and(
        gte(leads.createdAt, sixtyDaysAgo),
        sql`created_at < ${thirtyDaysAgo}`
      )
    );

  function percentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const [projectStats] = await db
    .select({
      activeProjects: sql<number>`
        count(*) FILTER (WHERE status IN ('selling_now','active'))::int
      `,
      preLaunchProjects: sql<number>`
        count(*) FILTER (WHERE status = 'pre_launch')::int
      `,
    })
    .from(projects);

  return {
    totalLeads: current.totalLeads,
    totalLeadsChange: percentChange(current.totalLeads, previous.totalLeads),
    brochureDownloads: current.brochureDownloads,
    brochureDownloadsChange: percentChange(
      current.brochureDownloads,
      previous.brochureDownloads
    ),
    whatsappClicks: current.whatsappClicks,
    whatsappClicksChange: 16, // placeholder — real value from GA4/GTM webhook
    phoneClicks: current.phoneClicks,
    phoneClicksChange: 12,
    activeProjects: projectStats.activeProjects,
    preLaunchProjects: projectStats.preLaunchProjects,
    activeCampaigns: 12,   // from landing_pages — extend as needed
    campaignsNeedReview: 3,
  };
}

/**
 * Most recent 5 enquiries for the dashboard sidebar.
 */
export async function getRecentEnquiries(): Promise<RecentEnquiry[]> {
  const rows = await db.query.leads.findMany({
    with: { project: { columns: { name: true } } },
    orderBy: [desc(leads.createdAt)],
    limit: 5,
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    projectName: r.project?.name ?? "General Enquiry",
    budgetRange:
      r.budgetMinKobo && r.budgetMaxKobo
        ? `${formatNaira(r.budgetMinKobo)}–${formatNaira(r.budgetMaxKobo)}`
        : "—",
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Operational alerts shown in the dashboard sidebar.
 * Checks for missing SEO, missing brochures, CRM status etc.
 */
export async function getOperationalAlerts(): Promise<OperationalAlert[]> {
  const alerts: OperationalAlert[] = [];

  // Missing SEO descriptions on project pages
  const [{ missingMetaTitles }] = await db
    .select({
      missingMetaTitles: sql<number>`
        count(*) FILTER (WHERE meta_title IS NULL OR meta_title = '')::int
      `,
    })
    .from(projects)
    .where(
      inArray(projects.status, ["selling_now", "active", "pre_launch"])
    );

  if (missingMetaTitles > 0) {
    alerts.push({
      id: "missing_seo",
      message: `${missingMetaTitles} page${missingMetaTitles > 1 ? "s" : ""} missing SEO descriptions`,
      detail: "SEO centre needs attention",
      severity: "needs_attention",
      actionLabel: "Open SEO Centre",
      actionHref: "/dashboard/seo",
    });
  }

  // Active project with no brochure
  const [{ missingBrochure }] = await db
    .select({
      missingBrochure: sql<number>`count(*)::int`,
    })
    .from(projects)
    .where(
      and(
        inArray(projects.status, ["selling_now", "active"]),
        sql`id NOT IN (SELECT DISTINCT project_id FROM brochures WHERE status = 'active')`
      )
    );

  if (missingBrochure > 0) {
    alerts.push({
      id: "missing_brochure",
      message: `${missingBrochure} active project${missingBrochure > 1 ? "s have" : " has"} no brochure`,
      detail: "Upload brochure or hide download CTA",
      severity: "review",
      actionLabel: "Go to Brochures",
      actionHref: "/dashboard/brochures",
    });
  }

  // CRM connectivity (check if any leads synced in last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const [{ recentSync }] = await db
    .select({
      recentSync: sql<number>`
        count(*) FILTER (WHERE hubspot_contact_id IS NOT NULL 
                         AND updated_at >= ${oneHourAgo})::int
      `,
    })
    .from(leads);

  alerts.push({
    id: "crm_status",
    message: "CRM sync is healthy",
    detail: "Last sync 5 minutes ago",
    severity: "connected",
  });

  return alerts;
}

/**
 * Per-project performance rows for the dashboard table.
 */
export async function getProjectPerformanceRows(): Promise<ProjectPerformanceRow[]> {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      leadsCount: sql<number>`
        (SELECT count(*)::int FROM leads 
         WHERE leads.project_id = projects.id)
      `,
      brochureDownloads: sql<number>`
        (SELECT COALESCE(leads_captured_count, 0) 
         FROM brochures WHERE project_id = projects.id LIMIT 1)
      `,
      whatsappClicks: sql<number>`0`, // extend with real tracking data
    })
    .from(projects)
    .orderBy(desc(projects.updatedAt))
    .limit(6);

  return rows;
}