// src/app/api/brochures/[id]/download/route.ts
// This is called by the PUBLIC website form, not the CMS
// Flow: Lead fills form → POST here → lead created → brochure URL returned + email sent
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brochures, leads, leadActivities } from "@/lib/db/schema";
import { sendBrochureEmail, sendSalesNotification } from "@/lib/types";
import { syncLeadToHubSpot } from "@/lib/integrations/hubspot";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const brochureLeadSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Valid email required"),
	phone: z.string().optional(),
	projectInterest: z.string().optional(),
	consentGiven: z.boolean().default(true),
	utmSource: z.string().optional(),
	utmMedium: z.string().optional(),
	utmCampaign: z.string().optional(),
});

// POST /api/brochures/[id]/download
export async function POST(req: NextRequest, { params }: Params) {
	try {
		const { id } = await params;
		const body = await req.json();

		// Validate lead data
		const parsed = brochureLeadSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					issues: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		// Fetch brochure
		const [brochure] = await db
			.select()
			.from(brochures)
			.where(eq(brochures.id, id))
			.limit(1);

		if (!brochure || brochure.status !== "published") {
			return NextResponse.json(
				{ error: "Brochure not available" },
				{ status: 404 },
			);
		}

		// Create lead record
		const [newLead] = await db
			.insert(leads)
			.values({
				name: parsed.data.name,
				email: parsed.data.email,
				phone: parsed.data.phone,
				projectInterest: parsed.data.projectInterest,
				source: "brochure",
				brochureDownloaded: true,
				consentGiven: parsed.data.consentGiven,
				utmSource: parsed.data.utmSource,
				utmMedium: parsed.data.utmMedium,
				utmCampaign: parsed.data.utmCampaign,
				ipAddress:
					req.headers.get("x-forwarded-for") ||
					req.headers.get("x-real-ip") ||
					null,
			})
			.returning();

		// Log activity
		await db.insert(leadActivities).values({
			leadId: newLead.id,
			type: "brochure_downloaded",
			description: `Downloaded brochure: ${brochure.title}`,
		});

		// Increment brochure lead count
		await db
			.update(brochures)
			.set({ leadsCapured: sql`${brochures.leadsCapured} + 1` })
			.where(eq(brochures.id, id));

		// Background: send brochure email + sales notification + HubSpot sync
		const tasks: Promise<any>[] = [];

		if (brochure.sendViaEmail && parsed.data.email) {
			tasks.push(
				sendBrochureEmail({
					to: parsed.data.email,
					name: parsed.data.name,
					projectName: parsed.data.projectInterest,
					brochureUrl: brochure.fileUrl,
					brochureTitle: brochure.title,
				}).then(async (sent) => {
					if (sent) {
						await db
							.update(leads)
							.set({ brochureSentAt: new Date() })
							.where(eq(leads.id, newLead.id));
						await db.insert(leadActivities).values({
							leadId: newLead.id,
							type: "brochure_email_sent",
							description: "Brochure sent via email",
						});
					}
				}),
			);
		}

		tasks.push(
			sendSalesNotification({
				leadId: newLead.id,
				leadName: parsed.data.name,
				leadEmail: parsed.data.email,
				leadPhone: parsed.data.phone,
				projectName: parsed.data.projectInterest,
				source: "brochure",
			}),
		);

		tasks.push(
			syncLeadToHubSpot({
				id: newLead.id,
				name: parsed.data.name,
				email: parsed.data.email,
				phone: parsed.data.phone,
				projectInterest: parsed.data.projectInterest,
				source: "brochure",
				utmSource: parsed.data.utmSource,
				utmCampaign: parsed.data.utmCampaign,
			}).then(async ({ contactId, dealId }) => {
				if (contactId || dealId) {
					await db
						.update(leads)
						.set({
							hubspotContactId: contactId,
							hubspotDealId: dealId,
							hubspotSyncedAt: new Date(),
						})
						.where(eq(leads.id, newLead.id));
				}
			}),
		);

		await Promise.allSettled(tasks);

		return NextResponse.json({
			data: {
				leadId: newLead.id,
				// Return URL only if direct download is allowed
				downloadUrl: brochure.allowDirectDownload ? brochure.fileUrl : null,
				emailSent: brochure.sendViaEmail,
			},
		});
	} catch (error) {
		console.error("POST /api/brochures/[id]/download error:", error);
		return NextResponse.json(
			{ error: "Failed to process download request" },
			{ status: 500 },
		);
	}
}
