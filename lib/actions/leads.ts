
//@lib/actions/leads.ts
"use server";

export interface LeadActionResult {
	success: boolean;
	message: string;
}

export async function assignLeads(
	leadIds: string[],
	assignTo: string,
): Promise<LeadActionResult> {
	// TODO (integration stage):
	// db.update(leads).set({ assignedToUserId: userId }).where(inArray(leads.id, leadIds))
	console.log("[assignLeads]", leadIds, "→", assignTo);
	await new Promise((res) => setTimeout(res, 400));
	return {
		success: true,
		message: `${leadIds.length} lead(s) assigned to ${assignTo}.`,
	};
}

export async function updateLeadStatus(
	leadId: string,
	status: string,
): Promise<LeadActionResult> {
	// TODO (integration stage):
	// db.update(leads).set({ status }).where(eq(leads.id, leadId))
	// revalidatePath(`/admin/leads/${leadId}`)
	console.log("[updateLeadStatus]", leadId, "→", status);
	return { success: true, message: "Status updated." };
}

export async function saveLeadNote(
	leadId: string,
	note: string,
): Promise<LeadActionResult> {
	// TODO (integration stage):
	// db.update(leads).set({ notes: note }).where(eq(leads.id, leadId))
	console.log("[saveLeadNote]", leadId, note.slice(0, 30));
	return { success: true, message: "Note saved." };
}

export async function syncCrm(): Promise<LeadActionResult> {
	// TODO (integration stage): call HubSpot Contacts API, upsert each lead
	console.log("[syncCrm]");
	await new Promise((res) => setTimeout(res, 600));
	return {
		success: false,
		message: "HubSpot not connected. Configure in Settings.",
	};
}
