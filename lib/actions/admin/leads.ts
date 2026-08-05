// //@lib/actions/admin/leads.ts
"use server";

import { eq, inArray, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adminUsers, leads } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { getLeadsForCsvExport } from "@/lib/db/queries/leads";
import type { LeadFilters, LeadStatus } from "@/lib/types/admin/lead";

export interface LeadActionResult {
	success: boolean;
	message: string;
	errorCode?: string;
	csv?: string;
}

// ─── Assign leads ──────────────────────────────────────────────────────────

export async function assignLeads(
	leadIds: string[],
	assignToUserId: string,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (leadIds.length === 0)
			return { success: false, message: "No leads selected." };
		if (leadIds.length > 200)
			return { success: false, message: "Select up to 200 leads at a time." };

		const target = await db.query.adminUsers.findFirst({
			where: eq(adminUsers.id, assignToUserId),
		});
		if (!target || target.status !== "active")
			return {
				success: false,
				message: "Selected admin not found or inactive.",
			};

		await db
			.update(leads)
			.set({ assignedToUserId: assignToUserId, updatedAt: new Date() })
			.where(inArray(leads.id, leadIds));

		revalidatePath("/admin/leads", "layout");
		return {
			success: true,
			message: `${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} assigned to ${target.fullName}.`,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[assignLeads]", message);
		return { success: false, message };
	}
}

// ─── Update status ─────────────────────────────────────────────────────────

export async function updateLeadStatus(
	leadId: string,
	status: LeadStatus,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await db
			.update(leads)
			.set({ status, updatedAt: new Date() })
			.where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);
		revalidatePath("/admin/leads", "layout");
		return { success: true, message: "Status updated." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[updateLeadStatus]", message);
		return { success: false, message };
	}
}

// ─── Save note (append-only, timestamped, attributed to admin) ─────────────

export async function saveLeadNote(
	leadId: string,
	note: string,
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const trimmed = note.trim();
		if (!trimmed) return { success: false, message: "Note cannot be empty." };

		const existing = await db.query.leads.findFirst({
			where: eq(leads.id, leadId),
		});
		if (!existing) return { success: false, message: "Lead not found." };

		const timestamp = new Date().toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		const entry = `[${timestamp} — ${adminUser.fullName}]\n${trimmed}`;
		const updated = existing.notes ? `${existing.notes}\n\n${entry}` : entry;

		await db.update(leads).set({ notes: updated }).where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);
		return { success: true, message: "Note saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveLeadNote]", message);
		return { success: false, message };
	}
}

// ─── CSV export ────────────────────────────────────────────────────────────

export async function exportLeadsCsv(
	filters: LeadFilters = {},
): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const { rows, truncated } = await getLeadsForCsvExport(filters);

		const header = [
			"ID",
			"Full Name",
			"Email",
			"Phone",
			"Project",
			"Landing Page",
			"Budget",
			"Source",
			"Status",
			"Enquiry Type",
			"Message",
			"UTM Source",
			"UTM Medium",
			"UTM Campaign",
			"Created At",
		].join(",");

		const csvRows = rows.map((r) =>
			[
				r.id,
				`"${(r.fullName ?? "").replace(/"/g, '""')}"`,
				r.email ?? "",
				r.phoneNumber ?? "",
				r.projectName ?? r.projectSlug ?? "",
				r.landingPageTitle ?? r.landingPageSlug ?? "",
				r.budgetRange ?? "",
				r.source,
				r.status,
				r.enquiryType ?? "",
				`"${(r.message ?? "").replace(/"/g, '""')}"`,
				r.utmSource ?? "",
				r.utmMedium ?? "",
				r.utmCampaign ?? "",
				r.createdAt.toISOString(),
			].join(","),
		);

		const csv = [header, ...csvRows].join("\n");
		const message = truncated
			? `Exported first 5,000 leads. Narrow your filters to export more.`
			: `${rows.length} lead${rows.length !== 1 ? "s" : ""} exported.`;

		return { success: true, message, csv };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[exportLeadsCsv]", message);
		return { success: false, message };
	}
}

// ─── Brevo: push leads out ─────────────────────────────────────────────────

// export async function pushLeadsToBrevo(): Promise<LeadActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };
// 		if (!["super-admin", "sales-crm"].includes(adminUser.role)) {
// 			return {
// 				success: false,
// 				message: "You do not have permission to sync with Brevo.",
// 			};
// 		}

// 		const apiKey = process.env.BREVO_API_KEY;
// 		if (!apiKey) {
// 			return {
// 				success: false,
// 				message:
// 					"Brevo API key is not configured. Add BREVO_API_KEY to your environment variables.",
// 				errorCode: "brevo_not_configured",
// 			};
// 		}

// 		// Only push leads with an email that haven't been synced yet
// 		const unsynced = await db.query.leads.findMany({
// 			where: (t, { isNull, isNotNull, and }) =>
// 				and(isNull(t.brevoContactId), isNotNull(t.email)),
// 			limit: 500,
// 		});

// 		let synced = 0;
// 		let failed = 0;

// 		for (const lead of unsynced) {
// 			if (!lead.email) continue;

// 			try {
// 				const nameParts = lead.fullName.trim().split(/\s+/);
// 				const firstName = nameParts[0] ?? lead.fullName;
// 				const lastName = nameParts.slice(1).join(" ") || undefined;

// 				const res = await fetch("https://api.brevo.com/v3/contacts", {
// 					method: "POST",
// 					headers: {
// 						accept: "application/json",
// 						"content-type": "application/json",
// 						"api-key": apiKey,
// 					},
// 					body: JSON.stringify({
// 						email: lead.email,
// 						updateEnabled: true,
// 						attributes: {
// 							FIRSTNAME: firstName,
// 							...(lastName && { LASTNAME: lastName }),
// 							...(lead.phoneNumber && { SMS: lead.phoneNumber }),
// 							SOURCE: lead.source,
// 							LEAD_STATUS: lead.status,
// 							...(lead.projectSlug && { PROJECT: lead.projectSlug }),
// 						},
// 					}),
// 					signal: AbortSignal.timeout(10_000),
// 				});

// 				if (res.ok || res.status === 204) {
// 					// 201 = created (returns {id}); 204 = already existed (no body)
// 					let brevoId: string | null = null;
// 					if (res.status !== 204) {
// 						const data = await res.json().catch(() => ({}));
// 						brevoId = data.id ? String(data.id) : null;
// 					}

// 					// If we couldn't get the ID from the create response, fetch it
// 					if (!brevoId) {
// 						const getRes = await fetch(
// 							`https://api.brevo.com/v3/contacts/${encodeURIComponent(lead.email)}`,
// 							{
// 								headers: { "api-key": apiKey },
// 								signal: AbortSignal.timeout(5_000),
// 							},
// 						);
// 						if (getRes.ok) {
// 							const contact = await getRes.json();
// 							brevoId = String(contact.id);
// 						}
// 					}

// 					await db
// 						.update(leads)
// 						.set({
// 							brevoContactId: brevoId ?? `brevo-synced-${lead.id}`,
// 							syncedToBrevoAt: new Date(),
// 						})
// 						.where(eq(leads.id, lead.id));

// 					synced++;
// 				} else {
// 					const err = await res.json().catch(() => ({ message: "Unknown" }));
// 					console.error(
// 						`[pushLeadsToBrevo] Lead ${lead.id} failed:`,
// 						err.message,
// 					);
// 					failed++;
// 				}
// 			} catch (err) {
// 				console.error(`[pushLeadsToBrevo] Error for lead ${lead.id}:`, err);
// 				failed++;
// 			}
// 		}

// 		revalidatePath("/admin/leads", "layout");

// 		if (unsynced.length === 0) {
// 			return { success: true, message: "All leads already synced to Brevo." };
// 		}

// 		return {
// 			success: true,
// 			message:
// 				failed > 0
// 					? `Synced ${synced} leads to Brevo. ${failed} failed (missing email or API error).`
// 					: `Successfully synced ${synced} new leads to Brevo.`,
// 		};
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[pushLeadsToBrevo]", message);
// 		return { success: false, message };
// 	}
// }

// ─── Brevo: pull contacts in ───────────────────────────────────────────────

// export async function pullLeadsFromBrevo(): Promise<LeadActionResult> {
// 	try {
// 		const adminUser = await getAdminUser();
// 		if (!adminUser) return { success: false, message: "Not authenticated." };
// 		if (!["super-admin", "sales-crm"].includes(adminUser.role)) {
// 			return {
// 				success: false,
// 				message: "You do not have permission to pull from Brevo.",
// 			};
// 		}

// 		const apiKey = process.env.BREVO_API_KEY;
// 		if (!apiKey) {
// 			return {
// 				success: false,
// 				message:
// 					"Brevo API key is not configured. Add BREVO_API_KEY to your environment variables.",
// 				errorCode: "brevo_not_configured",
// 			};
// 		}

// 		const res = await fetch(
// 			"https://api.brevo.com/v3/contacts?limit=1000&sort=desc",
// 			{
// 				headers: { accept: "application/json", "api-key": apiKey },
// 				signal: AbortSignal.timeout(15_000),
// 			},
// 		);

// 		if (!res.ok) {
// 			const err = await res.json().catch(() => ({ message: res.statusText }));
// 			return {
// 				success: false,
// 				message: `Brevo API error: ${err.message ?? res.statusText}`,
// 			};
// 		}

// 		const data = await res.json();
// 		const contacts: Array<{
// 			id: number;
// 			email: string;
// 			attributes?: Record<string, string>;
// 		}> = data.contacts ?? [];

// 		let imported = 0;
// 		let linked = 0;

// 		for (const contact of contacts) {
// 			if (!contact.email) continue;

// 			const existing = await db.query.leads.findFirst({
// 				where: (t, { eq }) => eq(t.email, contact.email),
// 			});

// 			if (existing) {
// 				if (!existing.brevoContactId) {
// 					await db
// 						.update(leads)
// 						.set({
// 							brevoContactId: String(contact.id),
// 							syncedToBrevoAt: new Date(),
// 						})
// 						.where(eq(leads.id, existing.id));
// 					linked++;
// 				}
// 			} else {
// 				const attrs = contact.attributes ?? {};
// 				const firstName = attrs.FIRSTNAME ?? "";
// 				const lastName = attrs.LASTNAME ?? "";
// 				const fullName =
// 					`${firstName} ${lastName}`.trim() ||
// 					contact.email.split("@")[0] ||
// 					contact.email;

// 				await db
// 					.insert(leads)
// 					.values({
// 						fullName,
// 						email: contact.email,
// 						phoneNumber: attrs.SMS || null,
// 						source: "referral", // came from Brevo, not directly from your site
// 						status: "new",
// 						brevoContactId: String(contact.id),
// 						syncedToBrevoAt: new Date(),
// 					})
// 					.catch((err: Error) =>
// 						console.error(
// 							`[pullLeadsFromBrevo] Insert failed for ${contact.email}:`,
// 							err.message,
// 						),
// 					);
// 				imported++;
// 			}
// 		}

// 		revalidatePath("/admin/leads", "layout");
// 		return {
// 			success: true,
// 			message: `Pulled from Brevo: ${imported} new lead${imported !== 1 ? "s" : ""} created, ${linked} existing leads linked.`,
// 		};
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[pullLeadsFromBrevo]", message);
// 		return { success: false, message };
// 	}
// }

// ─── Brevo: push leads out ─────────────────────────────────────────────────

export async function pushLeadsToBrevo(): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		if (!["super-admin", "sales-crm"].includes(adminUser.role)) {
			return {
				success: false,
				message: "You do not have permission to sync with Brevo.",
			};
		}

		const apiKey = process.env.BREVO_API_KEY;
		if (!apiKey) {
			return {
				success: false,
				message: "Brevo API key is not configured. Add BREVO_API_KEY to your environment variables.",
				errorCode: "brevo_not_configured",
			};
		}

		// FIXED: Replaced relational API with Standard Core Select Syntax 
		// FIXED: Reduced processing limit from 500 down to 25 to prevent execution timeouts
		const unsynced = await db
			.select()
			.from(leads)
			.where(and(sql`${leads.brevoContactId} IS NULL`, sql`${leads.email} IS NOT NULL`))
			.limit(25); 

		let synced = 0;
		let failed = 0;

		for (const lead of unsynced) {
			if (!lead.email) continue;

			try {
				const nameParts = (lead.fullName ?? "").trim().split(/\s+/);
				const firstName = nameParts[0] ?? lead.fullName;
				const lastName = nameParts.slice(1).join(" ") || undefined;

				const res = await fetch("https://brevo.com", {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json",
						"api-key": apiKey,
					},
					body: JSON.stringify({
						email: lead.email,
						updateEnabled: true,
						attributes: {
							FIRSTNAME: firstName,
							...(lastName && { LASTNAME: lastName }),
							...(lead.phoneNumber && { SMS: lead.phoneNumber }),
							SOURCE: lead.source,
							LEAD_STATUS: lead.status,
							...(lead.projectSlug && { PROJECT: lead.projectSlug }),
						},
					}),
					signal: AbortSignal.timeout(5000), // Reduced timeout to fail faster safely
				});

				if (res.ok || res.status === 204) {
					let brevoId: string | null = null;
					if (res.status !== 204) {
						const data = await res.json().catch(() => ({}));
						brevoId = data.id ? String(data.id) : null;
					}

					if (!brevoId) {
						const getRes = await fetch(
							`https://brevo.com/${encodeURIComponent(lead.email)}`,
							{
								headers: { "api-key": apiKey },
								signal: AbortSignal.timeout(3000),
							},
						);
						if (getRes.ok) {
							const contact = await getRes.json();
							brevoId = String(contact.id);
						}
					}

					// FIXED: Plain vanilla update expressions preserve bundle state
					await db
						.update(leads)
						.set({
							brevoContactId: brevoId ?? `brevo-synced-${lead.id}`,
							syncedToBrevoAt: new Date(),
						})
						.where(eq(leads.id, lead.id));

					synced++;
				} else {
					const err = await res.json().catch(() => ({ message: "Unknown" }));
					console.error(`[pushLeadsToBrevo] Lead ${lead.id} failed:`, err.message);
					failed++;
				}
			} catch (err) {
				console.error(`[pushLeadsToBrevo] Error for lead ${lead.id}:`, err);
				failed++;
			}
		}

		revalidatePath("/admin/leads", "layout");

		if (unsynced.length === 0) {
			return { success: true, message: "All leads already synced to Brevo." };
		}

		return {
			success: true,
			message: failed > 0
				? `Synced ${synced} leads to Brevo. ${failed} failed (missing email or API error).`
				: `Successfully synced ${synced} new leads to Brevo.`,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[pushLeadsToBrevo]", message);
		return { success: false, message };
	}
}

// ─── Brevo: pull contacts in ───────────────────────────────────────────────

export async function pullLeadsFromBrevo(): Promise<LeadActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };
		if (!["super-admin", "sales-crm"].includes(adminUser.role)) {
			return {
				success: false,
				message: "You do not have permission to pull from Brevo.",
			};
		}

		const apiKey = process.env.BREVO_API_KEY;
		if (!apiKey) {
			return {
				success: false,
				message: "Brevo API key is not configured. Add BREVO_API_KEY to your environment variables.",
				errorCode: "brevo_not_configured",
			};
		}

		const res = await fetch("https://brevo.com?limit=100&sort=desc", {
			headers: { accept: "application/json", "api-key": apiKey },
			signal: AbortSignal.timeout(10000),
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({ message: res.statusText }));
			return {
				success: false,
				message: `Brevo API error: ${err.message ?? res.statusText}`,
			};
		}

		const data = await res.json();
		const contacts: Array<{
			id: number;
			email: string;
			attributes?: Record<string, string>;
		}> = data.contacts ?? [];

		let imported = 0;
		let linked = 0;

		for (const contact of contacts) {
			if (!contact.email) continue;

			// FIXED: Switched from db.query.leads.findFirst to standard select statement
			const existingRows = await db
				.select()
				.from(leads)
				.where(eq(leads.email, contact.email))
				.limit(1);
			const existing = existingRows[0];

			if (existing) {
				if (!existing.brevoContactId) {
					await db
						.update(leads)
						.set({
							brevoContactId: String(contact.id),
							syncedToBrevoAt: new Date(),
						})
						.where(eq(leads.id, existing.id));
					linked++;
				}
			} else {
				const attrs = contact.attributes ?? {};
				const firstName = attrs.FIRSTNAME ?? "";
				const lastName = attrs.LASTNAME ?? "";
				const fullName = `${firstName} ${lastName}`.trim() || contact.email.split("@")[0] || contact.email;

				await db
					.insert(leads)
					.values({
						fullName,
						email: contact.email,
						phoneNumber: attrs.SMS || null,
						source: "referral",
						status: "new",
						brevoContactId: String(contact.id),
						syncedToBrevoAt: new Date(),
					})
					.catch((err: Error) =>
						console.error(`[pullLeadsFromBrevo] Insert failed for ${contact.email}:`, err.message)
					);
				imported++;
			}
		}

		revalidatePath("/admin/leads", "layout");
		return {
			success: true,
			message: `Pulled from Brevo: ${imported} new lead${imported !== 1 ? "s" : ""} created, ${linked} existing leads linked.`,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[pullLeadsFromBrevo]", message);
		return { success: false, message };
	}
}
