import { db } from "@/lib/db";
import { leads, leadActivities, leadNotes, projects } from "@/lib/db/schema";
import { eq, and, ilike, sql, desc, gte, lte } from "drizzle-orm";
import { buildPaginationMeta, formatNaira } from "@/lib/utils/helpers";
import { syncLeadToHubSpot, addHubSpotNote } from "@/lib/integrations/hubspot";
import { sendLeadAutoResponse, sendSalesAlert } from "@/lib/integrations/resend";
import type { Lead, LeadListItem, LeadDetail, PaginationMeta, PaginationParams } from "@/lib/types";
import type { SubmitLeadInput, UpdateLeadInput } from "@/lib/validations/leads";

export type LeadFilters = {
  projectId?: string;
  landingPageId?: string;
  status?: string;
  source?: string;
  assignedTo?: string;
  budgetMin?: number; // in Kobo
  budgetMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
};

/**
 * List leads with filters, search, and pagination.
 */
export async function getLeads(
  filters: LeadFilters = {},
  pagination: PaginationParams = {}
) : Promise<{ data: LeadListItem[]; meta: PaginationMeta }> {
  const { page = 1, pageSize = 25, } = pagination;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.projectId)
    conditions.push(eq(leads.projectId, filters.projectId));
  if (filters.status)
    conditions.push(eq(leads.status, filters.status as Lead["status"]));
  if (filters.assignedTo)
    conditions.push(eq(leads.assignedTo, filters.assignedTo));
  if (filters.dateFrom)
    conditions.push(gte(leads.createdAt, filters.dateFrom));
  if (filters.dateTo)
    conditions.push(lte(leads.createdAt, filters.dateTo));
  if (filters.search)
    conditions.push(
      ilike(leads.name, `%${filters.search}%`)
    );

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(leads)
    .where(where);

  const rows = await db.query.leads.findMany({
    where,
    with: {
      project: { columns: { name: true, slug: true } },
      assignedTo: { columns: { name: true } },
    },
    orderBy: [desc(leads.createdAt)],
    limit: pageSize,
    offset,
  });

  return {
    data: rows,
    meta: buildPaginationMeta(total, page, pageSize),
  };
}

/**
 * Get a single lead with full detail (activities + notes + project + assignee).
 */
export async function getLeadById(id: string): Promise<LeadDetail | null>  {
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      project: { columns: { id: true, name: true, slug: true } },
      assignedTo: { columns: { id: true, name: true, email: true } },
      form: { columns: { id: true, title: true } },
      landingPage: { columns: { id: true, title: true, slug: true } },
      activities: {
        orderBy: [desc(leadActivities.createdAt)],
        with: {
          actor: { columns: { name: true } },
        },
      },
      notes: {
        orderBy: [desc(leadNotes.createdAt)],
        with: {
          author: { columns: { id: true, name: true } },
        },
      },
    },
  });

  return lead ?? null;
}

/**
 * Create a new lead from a form submission.
 * Triggers:
 *   1. Save lead to DB
 *   2. Log "form_submitted" activity
 *   3. Send auto-response email (if email provided)
 *   4. Notify sales team
 *   5. Sync to HubSpot (async — non-blocking)
 */
export async function createLead(input: SubmitLeadInput): Promise<Lead> {
  // 1. Save lead
  const [lead] = await db.insert(leads).values(input).returning();

  // 2. Log form_submitted activity
  await logActivity(lead.id, "form_submitted", "Form submitted from website", null);
  if (lead.brochureId && lead.email) {
		const { getBrochureById, incrementBrochureLeadCount } =
			await import("./brochures.service");
		getBrochureById(lead.brochureId).then((brochure) => {
			if (!brochure) return;
			sendBrochureEmail({
				to: lead.email!,
				leadName: lead.name,
				projectName: projectName ?? brochure.title,
				brochureUrl: brochure.fileUrl,
			})
				.then(() =>
					logActivity(lead.id, "brochure_sent", "Brochure email sent", null),
				)
				.catch(console.error);
			incrementBrochureLeadCount(lead.brochureId!).catch(console.error);
		});
	}

  // 3. Get project name for emails (if linked)
  let projectName: string | null = null;
  if (input.projectId) {
    const [proj] = await db
      .select({ name: projects.name })
      .from(projects)
      .where(eq(projects.id, input.projectId))
      .limit(1);
    projectName = proj?.name ?? null;
  }

  const budgetRange =
    input.budgetMinKobo && input.budgetMaxKobo
      ? `${formatNaira(input.budgetMinKobo)} – ${formatNaira(input.budgetMaxKobo)}`
      : null;

  // 4. Send emails (non-blocking — failures don't break the lead save)
  if (lead.email) {
    sendLeadAutoResponse({
      to: lead.email,
      leadName: lead.name,
      projectName: projectName ?? undefined,
    })
      .then(() => logActivity(lead.id, "auto_response_sent", "Auto-response email sent", null))
      .catch(console.error);
  }

  sendSalesAlert({
    leadName: lead.name,
    leadPhone: lead.phone,
    leadEmail: lead.email,
    projectName,
    budgetRange,
    source: lead.source,
  })
    .then(() => logActivity(lead.id, "sales_notified", "Sales team notified", null))
    .catch(console.error);

  // 5. Sync to HubSpot (fully async)
  syncLeadToHubSpot({
    name: lead.name,
    email: lead.email ?? undefined,
    phone: lead.phone,
    projectName,
    unitInterest: lead.unitInterest,
    budgetRange,
    buyingPurpose: lead.buyingPurpose,
    source: lead.source,
    utmCampaign: lead.utmCampaign,
  })
    .then(async ({ hubspotContactId, hubspotDealId }) => {
      await db
        .update(leads)
        .set({ hubspotContactId, hubspotDealId, updatedAt: new Date() })
        .where(eq(leads.id, lead.id));
      await logActivity(lead.id, "hubspot_synced", "Synced to HubSpot CRM", null);
    })
    .catch(console.error);

  return lead;
}

/**
 * Update lead status, assignment, or other CMS-managed fields.
 */
export async function updateLead(
  id: string,
  input: UpdateLeadInput,
  updatedBy: string
): Promise<Lead | null> {
  const existing = await getLeadById(id);
  if (!existing) return null;

  const [updated] = await db
    .update(leads)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();

  // Log status change
  if (input.status && input.status !== existing.status) {
    await logActivity(
      id,
      "status_changed",
      `Status changed: ${existing.status} → ${input.status}`,
      updatedBy
    );

    // Mirror status to HubSpot deal if connected
    if (existing.hubspotDealId) {
      const stageMap: Record<string, string> = {
        contacted: "qualifiedtobuy",
        qualified: "presentationscheduled",
        inspection: "decisionmakerboughtin",
        negotiation: "contractsent",
        closed_won: "closedwon",
        closed_lost: "closedlost",
      };
      const stage = stageMap[input.status];
      if (stage) {
        const { updateHubSpotDeal } = await import("@/lib/integrations/hubspot");
        updateHubSpotDeal(existing.hubspotDealId, { dealstage: stage }).catch(
          console.error
        );
      }
    }
  }

  // Log assignment
  if (input.assignedTo !== undefined && input.assignedTo !== existing.assignedTo) {
    await logActivity(
      id,
      "assigned",
      `Lead assigned`,
      updatedBy
    );
  }

  return updated ?? null;
}

/**
 * Add a sales note to a lead and optionally mirror it to HubSpot.
 */
export async function addLeadNote(
  leadId: string,
  content: string,
  createdBy: string,
  mentionedUsers: string[] = []
): Promise<void> {
  await db.insert(leadNotes).values({
    leadId,
    content,
    createdBy,
    mentionedUsers,
  });

  await logActivity(leadId, "note_added", content.slice(0, 100), createdBy);

  // Mirror to HubSpot if the lead has a HubSpot contact
  const [lead] = await db
    .select({ hubspotContactId: leads.hubspotContactId })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

  if (lead?.hubspotContactId) {
    addHubSpotNote(lead.hubspotContactId, content).catch(console.error);
  }
}

/**
 * Bulk sync all unsynced leads to HubSpot.
 * Called from POST /api/leads/sync-crm
 */
export async function bulkSyncToHubSpot(): Promise<{
  synced: number;
  failed: number;
}> {
  const unsyncedLeads = await db
    .select()
    .from(leads)
    .where(sql`hubspot_contact_id IS NULL`)
    .limit(100);

  let synced = 0;
  let failed = 0;

  for (const lead of unsyncedLeads) {
    try {
      const { hubspotContactId, hubspotDealId } = await syncLeadToHubSpot({
        name: lead.name,
        email: lead.email ?? undefined,
        phone: lead.phone,
        source: lead.source,
      });
      await db
        .update(leads)
        .set({ hubspotContactId, hubspotDealId })
        .where(eq(leads.id, lead.id));
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function logActivity(
  leadId: string,
  type: (typeof leadActivities.$inferInsert)["type"],
  description: string,
  createdBy: string | null
) {
  await db.insert(leadActivities).values({
    leadId,
    type,
    description,
    createdBy,
  });
}

/**
 * Get dashboard summary counts for leads.
 */
export async function getLeadSummary() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      newCount: sql<number>`count(*) FILTER (WHERE status = 'new')::int`,
      qualifiedCount: sql<number>`count(*) FILTER (WHERE status = 'qualified')::int`,
      last30Days: sql<number>`count(*) FILTER (WHERE created_at >= ${thirtyDaysAgo})::int`,
    })
    .from(leads);

  return stats;
}


// lib/services/leads.service.ts — inside createLead(), after the project name resolution
// block and before the "Send emails" section, add brochure delivery:

