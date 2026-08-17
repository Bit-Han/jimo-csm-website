// // // lib/actions/landing-page-lead.ts
// "use server";

// import { eq } from "drizzle-orm";
// import { after } from "next/server";
// import { db } from "@/lib/db";
// import { formFields, landingPages, leads, trackingEventLogs } from "@/lib/db/schema";
// import { withTimeout } from "@/lib/utils/timeout";
// import type { UtmParams } from "@/lib/types/landing-page";

// const DB_TIMEOUT_MS = 8000;

// export interface LandingPageLeadResult {
// 	success: boolean;
// 	message: string;
// }

// export async function submitLandingPageLead(input: {
// 	formId: string;
// 	landingPageSlug: string;
// 	values: Record<string, string>;
// 	utm?: UtmParams;
// }): Promise<LandingPageLeadResult> {
// 	try {
// 		const fields = await withTimeout(
// 			db.query.formFields.findMany({ where: eq(formFields.formId, input.formId) }),
// 			DB_TIMEOUT_MS,
// 			"submitLandingPageLead:fields",
// 		);

// 		for (const f of fields) {
// 			if (f.required && f.type !== "hidden" && !input.values[f.id]?.trim()) {
// 				return { success: false, message: `${f.label} is required.` };
// 			}
// 		}

// 		const mapped: Record<string, string> = {};
// 		for (const f of fields) {
// 			const raw = input.values[f.id];
// 			if (f.crmMapping && raw) mapped[f.crmMapping] = raw;
// 		}

// 		if (!mapped.fullName?.trim()) {
// 			return { success: false, message: "Please enter your name." };
// 		}

// 		const landingPage = await withTimeout(
// 			db.query.landingPages.findFirst({ where: eq(landingPages.slug, input.landingPageSlug) }),
// 			DB_TIMEOUT_MS,
// 			"submitLandingPageLead:page",
// 		);

// 		await withTimeout(
// 			db.insert(leads).values({
// 				fullName: mapped.fullName,
// 				email: mapped.email || null,
// 				phoneNumber: mapped.phoneNumber || null,
// 				projectId: landingPage?.linkedProjectId ?? null,
// 				projectSlug: landingPage?.linkedProjectSlug ?? null,
// 				landingPageId: landingPage?.id ?? null,
// 				landingPageSlug: input.landingPageSlug,
// 				source: "landing_page",
// 				status: "new",
// 				budgetRange: mapped.budgetRange || null,
// 				enquiryType: mapped.enquiryType || null,
// 				message: mapped.message || null,
// 				utmSource: input.utm?.utmSource || null,
// 				utmMedium: input.utm?.utmMedium || null,
// 				utmCampaign: input.utm?.utmCampaign || null,
// 			}),
// 			DB_TIMEOUT_MS,
// 			"submitLandingPageLead:insert",
// 		);

// 		// Defer non-critical tracking metrics so the response returns immediately
// 		after(async () => {
// 			try {
// 				await withTimeout(
// 					db.insert(trackingEventLogs).values({
// 						eventName: "form_submit",
// 						pagePath: `/lp/${input.landingPageSlug}`,
// 						landingPageSlug: input.landingPageSlug,
// 						metadata: {},
// 					}),
// 					5000,
// 					"submitLandingPageLead:trackEvent",
// 				);
// 			} catch (err) {
// 				console.error("[submitLandingPageLead] tracking log failed (non-blocking):", err);
// 			}
// 		});

// 		return { success: true, message: "Thank you — we'll be in touch shortly." };
// 	} catch (error) {
// 		const message = error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[submitLandingPageLead]", message);
// 		return {
// 			success: false,
// 			message: "We couldn't save your details right now. Please try again or contact us directly.",
// 		};
// 	}
// }


// lib/actions/landing-page-lead.ts
"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/lib/db";
import { forms, formFields, landingPages, leads, projects, trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
import { sendBrochureEmail, sendLeadAutoResponse, sendSalesAlert } from "@/lib/email/resend";
import { CRM_MAPPING_VALUES } from "@/lib/constants/crm-mapping";
import type { UtmParams } from "@/lib/types/landing-page";

const DB_TIMEOUT_MS = 8000;

export interface LandingPageLeadResult {
	success: boolean;
	message: string;
}

// Brochure detection is string-based on purpose — old forms may have typed
// "Brochure", "brochure-request" etc. before the type picker was locked
// down (see form-types.ts). New forms always save the canonical slug.
function isBrochureForm(formType: string): boolean {
	return formType.toLowerCase().replace(/[\s-]+/g, "_").includes("brochure");
}

export async function submitLandingPageLead(input: {
	formId: string;
	landingPageSlug: string;
	values: Record<string, string>;
	utm?: UtmParams;
}): Promise<LandingPageLeadResult> {
	let redirectTo: string | null = null;

	try {
		const [form, fields] = await Promise.all([
			withTimeout(
				db.query.forms.findFirst({ where: eq(forms.id, input.formId) }),
				DB_TIMEOUT_MS,
				"submitLandingPageLead:form",
			),
			withTimeout(
				db.query.formFields.findMany({ where: eq(formFields.formId, input.formId) }),
				DB_TIMEOUT_MS,
				"submitLandingPageLead:fields",
			),
		]);

		if (!form) {
			return { success: false, message: "This form is no longer available." };
		}

		for (const f of fields) {
			if (f.required && f.type !== "hidden" && !input.values[f.id]?.trim()) {
				return { success: false, message: `${f.label} is required.` };
			}
		}

		const mapped: Record<string, string> = {};
		for (const f of fields) {
			const raw = input.values[f.id]?.trim();
			if (raw && f.crmMapping && CRM_MAPPING_VALUES.has(f.crmMapping)) {
				mapped[f.crmMapping] = raw;
			}
		}

		// Safety net for forms saved before CRM Mapping was locked down —
		// this is the exact bug that was breaking submissions before.
		if (!mapped.fullName) {
			const nameField = fields.find(
				(f) => f.type === "text" && /full ?name|your ?name|^name$/i.test(f.label),
			);
			const raw = nameField ? input.values[nameField.id]?.trim() : undefined;
			if (raw) {
				mapped.fullName = raw;
			} else {
				console.error(
					`[submitLandingPageLead] No field mapped to "fullName" on form ${input.formId}. ` +
						`Open it in the builder and set a field's CRM Mapping to "Full Name".`,
				);
				return {
					success: false,
					message: "We couldn't process your submission right now. Please try again shortly.",
				};
			}
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

		const projectName = landingPage?.title;
		const wantsBrochure = isBrochureForm(form.type);
		let brochureSent = false;

		// ── Brochure request → send the brochure, redirect to the existing
		// thank-you page. Anything else → stays inline, no redirect. ────────
		if (wantsBrochure && mapped.email && landingPage?.linkedProjectSlug) {
			const brochure = await getBrochureByProjectSlug(landingPage.linkedProjectSlug);

			if (brochure) {
				const project = landingPage.linkedProjectId
					? await db.query.projects.findFirst({ where: eq(projects.id, landingPage.linkedProjectId) })
					: null;
				const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
				const downloadUrl = brochure.fileUrl.startsWith("http")
					? brochure.fileUrl
					: `${appUrl}${brochure.fileUrl}`;
				const settings = await getPublicSiteSettings();

				const emailResult = await sendBrochureEmail({
					to: mapped.email,
					recipientName: mapped.fullName,
					projectName: project?.name ?? projectName ?? landingPage.linkedProjectSlug,
					brochureDownloadUrl: downloadUrl,
					whatsappHref: settings.whatsappHref,
				});

				if (emailResult.success) {
					brochureSent = true;
					redirectTo = `/brochures/${landingPage.linkedProjectSlug}/thank-you`;
				} else {
					console.error("[submitLandingPageLead] brochure email failed:", emailResult.message);
					// Lead is already saved — don't block the visitor over a
					// delivery failure, just fall through to the inline state.
				}
			} else {
				console.error(
					`[submitLandingPageLead] Form ${input.formId} is a brochure form but project ` +
						`"${landingPage.linkedProjectSlug}" has no brochure uploaded yet.`,
				);
			}
		}

		// Non-blocking follow-ups, deferred so the response returns fast.
		after(async () => {
			try {
				if (mapped.email && !brochureSent) {
					await sendLeadAutoResponse({
						to: mapped.email,
						leadName: mapped.fullName,
						projectName,
					});
				}
			} catch (err) {
				console.error("[submitLandingPageLead] auto-response failed:", err);
			}

			try {
				await sendSalesAlert({
					leadName: mapped.fullName,
					leadPhone: mapped.phoneNumber ?? "—",
					leadEmail: mapped.email,
					projectName,
					budgetRange: mapped.budgetRange,
					source: "Landing Page",
				});
			} catch (err) {
				console.error("[submitLandingPageLead] sales alert failed:", err);
			}

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
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[submitLandingPageLead]", message);
		return {
			success: false,
			message: "We couldn't save your details right now. Please try again or contact us directly.",
		};
	}

	// Deliberately outside the try/catch — see comment at top of file.
	if (redirectTo) {
		redirect(redirectTo);
	}

	return { success: true, message: "Thank you — we'll be in touch shortly." };
}