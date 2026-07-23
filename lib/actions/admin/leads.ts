
//@lib/actions/admin/leads.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { LeadStatus } from "@/lib/types/admin/lead";

export interface LeadActionResult {
	success: boolean;
	message: string;
}

// ─── Assign leads to an admin user ────────────────────────────────────────

export async function assignLeads(
	leadIds: string[],
	assignToUserId: string,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (leadIds.length === 0) {
			return { success: false, message: "No leads selected." };
		}

		// Update each lead individually — Drizzle doesn't support
		// `WHERE id IN (...)` with dynamic arrays cleanly without raw SQL,
		// so we batch the updates sequentially. At typical lead volumes
		// (< 1000 selected at once) this is fast enough.
		await Promise.all(
			leadIds.map((id) =>
				db
					.update(leads)
					.set({ assignedToUserId: assignToUserId })
					.where(eq(leads.id, id)),
			),
		);

		revalidatePath("/admin/leads", "layout");

		return {
			success: true,
			message: `${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} assigned.`,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[assignLeads]", message);
		return { success: false, message };
	}
}

// ─── Update lead status ───────────────────────────────────────────────────

export async function updateLeadStatus(
	leadId: string,
	status: LeadStatus,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const existing = await db.query.leads.findFirst({
			where: eq(leads.id, leadId),
		});

		if (!existing) {
			return { success: false, message: "Lead not found." };
		}

		await db.update(leads).set({ status }).where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);
		revalidatePath("/admin/leads", "layout");

		return { success: true, message: `Status updated to "${status}".` };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[updateLeadStatus]", message);
		return { success: false, message };
	}
}

// ─── Save sales note ──────────────────────────────────────────────────────
// Notes are appended with a timestamp so the history is preserved.

export async function saveLeadNote(
	leadId: string,
	note: string,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (!note.trim()) {
			return { success: false, message: "Note cannot be empty." };
		}

		const existing = await db.query.leads.findFirst({
			where: eq(leads.id, leadId),
		});

		if (!existing) {
			return { success: false, message: "Lead not found." };
		}

		const timestamp = new Date().toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});

		// Format: "[14 Jul, 10:32 — Tolu Adebayo]\nNote text here"
		const newEntry = `[${timestamp} — ${adminUser.fullName}]\n${note.trim()}`;
		const updatedNotes = existing.notes
			? `${existing.notes}\n\n${newEntry}`
			: newEntry;

		await db
			.update(leads)
			.set({ notes: updatedNotes })
			.where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);

		return { success: true, message: "Note saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveLeadNote]", message);
		return { success: false, message };
	}
}

// ─── CRM sync ─────────────────────────────────────────────────────────────

export async function syncCrm(): Promise<LeadActionResult> {
	// TODO (HubSpot integration stage): call HubSpot Contacts API, upsert each lead
	return {
		success: false,
		message: "HubSpot not connected yet. Configure in Settings.",
	};
}

// ─── Export leads CSV ─────────────────────────────────────────────────────

export async function exportLeadsCsv(): Promise<{
	success: boolean;
	csv?: string;
	message: string;
}> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const rows = await db.query.leads.findMany({
			orderBy: (leads, { desc }) => [desc(leads.createdAt)],
		});

		const header = [
			"ID",
			"Full Name",
			"Email",
			"Phone",
			"Project Slug",
			"Budget Range",
			"Source",
			"Status",
			"Enquiry Type",
			"Message",
			"UTM Source",
			"UTM Medium",
			"UTM Campaign",
			"Created At",
		].join(",");

		const csvRows = rows.map((row) =>
			[
				row.id,
				`"${(row.fullName ?? "").replace(/"/g, '""')}"`,
				row.email ?? "",
				row.phoneNumber ?? "",
				row.projectSlug ?? "",
				row.budgetRange ?? "",
				row.source,
				row.status,
				row.enquiryType ?? "",
				`"${(row.message ?? "").replace(/"/g, '""')}"`,
				row.utmSource ?? "",
				row.utmMedium ?? "",
				row.utmCampaign ?? "",
				row.createdAt.toISOString(),
			].join(","),
		);

		return {
			success: true,
			csv: [header, ...csvRows].join("\n"),
			message: `${rows.length} leads exported.`,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}
