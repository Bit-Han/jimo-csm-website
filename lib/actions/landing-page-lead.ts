// lib/actions/landing-page-lead.ts
"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { formFields, landingPages, leads, trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import type { UtmParams } from "@/lib/types/landing-page";

const DB_TIMEOUT_MS = 8000;

export interface LandingPageLeadResult {
	success: boolean;
	message: string;
}

export async function submitLandingPageLead(input: {
	formId: string;
	landingPageSlug: string;
	values: Record<string, string>;
	utm?: UtmParams;
}): Promise<LandingPageLeadResult> {
	try {
		const fields = await withTimeout(
			db.query.formFields.findMany({ where: eq(formFields.formId, input.formId) }),
			DB_TIMEOUT_MS,
			"submitLandingPageLead:fields",
		);

		for (const f of fields) {
			if (f.required && f.type !== "hidden" && !input.values[f.id]?.trim()) {
				return { success: false, message: `${f.label} is required.` };
			}
		}

		const mapped: Record<string, string> = {};
		for (const f of fields) {
			const raw = input.values[f.id];
			if (f.crmMapping && raw) mapped[f.crmMapping] = raw;
		}

		if (!mapped.fullName?.trim()) {
			return { success: false, message: "Please enter your name." };
		}

		const landingPage = await withTimeout(
			db.query.landingPages.findFirst({ where: eq(landingPages.slug, input.landingPageSlug) }),
			DB_TIMEOUT_MS,
			"submitLandingPageLead:page",
		);

		await withTimeout(
			db.insert(leads).values({
				fullName: mapped.fullName,
				email: mapped.email || null,
				phoneNumber: mapped.phoneNumber || null,
				projectId: landingPage?.linkedProjectId ?? null,
				projectSlug: landingPage?.linkedProjectSlug ?? null,
				landingPageId: landingPage?.id ?? null,
				landingPageSlug: input.landingPageSlug,
				source: "landing_page",
				status: "new",
				budgetRange: mapped.budgetRange || null,
				enquiryType: mapped.enquiryType || null,
				message: mapped.message || null,
				utmSource: input.utm?.utmSource || null,
				utmMedium: input.utm?.utmMedium || null,
				utmCampaign: input.utm?.utmCampaign || null,
			}),
			DB_TIMEOUT_MS,
			"submitLandingPageLead:insert",
		);

		// FIX: this used to sit after both the try and catch blocks' return
		// statements — meaning it was unreachable and never actually ran on
		// any code path. Moved inside the success path, before the return.
		try {
			await withTimeout(
				db.insert(trackingEventLogs).values({
					eventName: "form_submit",
					pagePath: `/lp/${input.landingPageSlug}`,
					landingPageSlug: input.landingPageSlug,
					metadata: {},
				}),
				5000,
				"submitLandingPageLead:trackEvent",
			);
		} catch (err) {
			console.error("[submitLandingPageLead] tracking log failed (non-blocking):", err);
		}

		return { success: true, message: "Thank you — we'll be in touch shortly." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[submitLandingPageLead]", message);
		return {
			success: false,
			message: "We couldn't save your details right now. Please try again or contact us directly.",
		};
	}
}