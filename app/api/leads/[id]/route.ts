// // src/app/api/leads/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { leads, users, leadNotes, leadActivities } from "@/lib/db/schema";
// import { requirePermission } from "@/lib/auth";
// import {
// 	updateLeadStatusSchema,
// 	assignLeadSchema,
// 	leadNoteSchema,
// } from "@/lib/validations";
// import {
// 	updateHubSpotDealStage,
// 	LEAD_STATUS_TO_HUBSPOT_STAGE,
// } from "@/lib/integrations/hubspot";
// import { eq } from "drizzle-orm";

// type Params = { params: Promise<{ id: string }> };

// // GET /api/leads/[id]
// export async function GET(_req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("leads.view");
// 		const { id } = await params;

// 		const [lead] = await db
// 			.select()
// 			.from(leads)
// 			.where(eq(leads.id, id))
// 			.limit(1);

// 		if (!lead) {
// 			return NextResponse.json({ error: "Lead not found" }, { status: 404 });
// 		}

// 		// Get assigned user info
// 		let assignedUser = null;
// 		if (lead.assignedTo) {
// 			const [user] = await db
// 				.select({ id: users.id, name: users.name, email: users.email })
// 				.from(users)
// 				.where(eq(users.id, lead.assignedTo))
// 				.limit(1);
// 			assignedUser = user;
// 		}

// 		// Get notes
// 		const notes = await db
// 			.select({
// 				id: leadNotes.id,
// 				content: leadNotes.content,
// 				createdAt: leadNotes.createdAt,
// 				userName: users.name,
// 			})
// 			.from(leadNotes)
// 			.leftJoin(users, eq(leadNotes.userId, users.id))
// 			.where(eq(leadNotes.leadId, id))
// 			.orderBy(leadNotes.createdAt);

// 		// Get activities
// 		const activities = await db
// 			.select()
// 			.from(leadActivities)
// 			.where(eq(leadActivities.leadId, id))
// 			.orderBy(leadActivities.createdAt);

// 		return NextResponse.json({
// 			data: { ...lead, assignedUser, notes, activities },
// 		});
// 	} catch (error) {
// 		console.error("GET /api/leads/[id] error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to fetch lead" },
// 			{ status: 500 },
// 		);
// 	}
// }

// // PATCH /api/leads/[id] — update status, assign, add note
// export async function PATCH(req: NextRequest, { params }: Params) {
// 	try {
// 		const user = await requirePermission("leads.edit_status");
// 		const { id } = await params;
// 		const body = await req.json();

// 		const [existing] = await db
// 			.select()
// 			.from(leads)
// 			.where(eq(leads.id, id))
// 			.limit(1);

// 		if (!existing) {
// 			return NextResponse.json({ error: "Lead not found" }, { status: 404 });
// 		}

// 		// Handle status update
// 		if (body.status) {
// 			const parsed = updateLeadStatusSchema.safeParse({ status: body.status });
// 			if (!parsed.success) {
// 				return NextResponse.json({ error: "Invalid status" }, { status: 400 });
// 			}

// 			await db
// 				.update(leads)
// 				.set({ status: parsed.data.status, updatedAt: new Date() })
// 				.where(eq(leads.id, id));

// 			await db.insert(leadActivities).values({
// 				leadId: id,
// 				type: "status_changed",
// 				description: `Status updated from ${existing.status} to ${parsed.data.status}`,
// 			});

// 			// Sync to HubSpot if deal exists
// 			if (existing.hubspotDealId) {
// 				const hubspotStage = LEAD_STATUS_TO_HUBSPOT_STAGE[parsed.data.status];
// 				if (hubspotStage) {
// 					await updateHubSpotDealStage(existing.hubspotDealId, hubspotStage);
// 				}
// 			}
// 		}

// 		// Handle assignment
// 		if (body.assignedTo !== undefined) {
// 			const parsed = assignLeadSchema.safeParse({
// 				assignedTo: body.assignedTo,
// 			});
// 			if (!parsed.success) {
// 				return NextResponse.json(
// 					{ error: "Invalid assignee" },
// 					{ status: 400 },
// 				);
// 			}

// 			await db
// 				.update(leads)
// 				.set({ assignedTo: parsed.data.assignedTo, updatedAt: new Date() })
// 				.where(eq(leads.id, id));

// 			const [assignedUser] = await db
// 				.select({ name: users.name })
// 				.from(users)
// 				.where(eq(users.id, parsed.data.assignedTo))
// 				.limit(1);

// 			await db.insert(leadActivities).values({
// 				leadId: id,
// 				type: "assigned",
// 				description: `Lead assigned to ${assignedUser?.name || "user"}`,
// 			});
// 		}

// 		// Handle note addition
// 		if (body.note) {
// 			const parsed = leadNoteSchema.safeParse({ content: body.note });
// 			if (!parsed.success) {
// 				return NextResponse.json({ error: "Invalid note" }, { status: 400 });
// 			}

// 			await db.insert(leadNotes).values({
// 				leadId: id,
// 				userId: user.id,
// 				content: parsed.data.content,
// 			});

// 			await db.insert(leadActivities).values({
// 				leadId: id,
// 				type: "note_added",
// 				description: "Sales note added",
// 			});
// 		}

// 		const [updated] = await db
// 			.select()
// 			.from(leads)
// 			.where(eq(leads.id, id))
// 			.limit(1);

// 		return NextResponse.json({ data: updated });
// 	} catch (error) {
// 		console.error("PATCH /api/leads/[id] error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to update lead" },
// 			{ status: 500 },
// 		);
// 	}
// }

// // DELETE /api/leads/[id]
// export async function DELETE(_req: NextRequest, { params }: Params) {
// 	try {
// 		await requirePermission("leads.delete");
// 		const { id } = await params;

// 		await db.delete(leads).where(eq(leads.id, id));

// 		return NextResponse.json({ success: true });
// 	} catch (error) {
// 		console.error("DELETE /api/leads/[id] error:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to delete lead" },
// 			{ status: 500 },
// 		);
// 	}
// }


// app/api/leads/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { ok, notFound, unauthorized, forbidden, badRequest, noContent, serverError } from "@/lib/utils/api-response";
import { getLeadById, updateLead } from "@/lib/services/leads.service";
import { updateLeadSchema } from "@/lib/validations/leads";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "view_leads")) return forbidden();
    const { id } = await params;

    // sales_crm can only view their assigned leads
    const lead = await getLeadById(id);
    if (!lead) return notFound("Lead not found.");
    if (auth.profile.role === "sales_crm" && lead.assignedTo !== auth.profile.id) {
      return forbidden("You are not assigned to this lead.");
    }
    return ok(lead);
  } catch (err) {
    return serverError("Failed to load lead.", err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_leads")) return forbidden();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
    const updated = await updateLead(id, parsed.data, auth.profile.id);
    if (!updated) return notFound("Lead not found.");
    return ok(updated);
  } catch (err) {
    return serverError("Failed to update lead.", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "edit_leads")) return forbidden();
    const { id } = await params;
    await db.delete(leads).where(eq(leads.id, id));
    return noContent();
  } catch (err) {
    return serverError("Failed to delete lead.", err);
  }
}