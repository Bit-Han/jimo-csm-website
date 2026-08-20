//@/lib/actions/landing-page-lead.ts

// "use server";

// import { eq } from "drizzle-orm";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers";
// import { after } from "next/server";
// import { db } from "@/lib/db";
// import {
// 	forms,
// 	formFields,
// 	landingPages,
// 	leads,
// 	projects,
// 	trackingEventLogs,
// } from "@/lib/db/schema";
// import { withTimeout } from "@/lib/utils/timeout";
// import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
// import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
// import {
// 	sendBrochureEmail,
// 	sendLeadAutoResponse,
// 	sendSalesAlert,
// } from "@/lib/email/resend";
// import { hasRecentBrochureRequest } from "@/lib/db/queries/leads-dedupe";
// import { validateAndFormatPhone } from "@/lib/utils/phonenumber-validation";
// import { looksLikeBot } from "@/lib/utils/bot-heuristics";
// import { checkIpRateLimit } from "@/lib/utils/rate-limit";
// import { CRM_MAPPING_VALUES } from "@/lib/constants/crm-mapping";
// import type { UtmParams } from "@/lib/types/landing-page";

// const DB_TIMEOUT_MS = 8000;
// const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export interface LandingPageLeadResult {
// 	success: boolean;
// 	message: string;
// }

// function isBrochureForm(formType: string): boolean {
// 	return formType
// 		.toLowerCase()
// 		.replace(/[\s-]+/g, "_")
// 		.includes("brochure");
// }

// export async function submitLandingPageLead(input: {
// 	formId: string;
// 	landingPageSlug: string;
// 	values: Record<string, string>;
// 	utm?: UtmParams;
// }): Promise<LandingPageLeadResult> {
// 	// __hp / __ts come from DynamicFormRenderer — present on every landing
// 	// page form regardless of what the admin built.
// 	if (
// 		looksLikeBot({ honeypot: input.values.__hp, renderedAt: input.values.__ts })
// 	) {
// 		console.warn(
// 			"[submitLandingPageLead] Bot heuristic triggered, silently dropping.",
// 			{
// 				formId: input.formId,
// 				landingPageSlug: input.landingPageSlug,
// 			},
// 		);
// 		return { success: true, message: "Thank you — we'll be in touch shortly." };
// 	}

// 	const headerList = await headers();
// 	const ip =
// 		headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
// 	const rateLimit = checkIpRateLimit(ip, { limit: 8, windowInSeconds: 60 });
// 	if (!rateLimit.success) {
// 		return {
// 			success: false,
// 			message: "Too many requests. Please wait a moment and try again.",
// 		};
// 	}

// 	let redirectTo: string | null = null;

// 	try {
// 		const [form, fields] = await Promise.all([
// 			withTimeout(
// 				db.query.forms.findFirst({ where: eq(forms.id, input.formId) }),
// 				DB_TIMEOUT_MS,
// 				"submitLandingPageLead:form",
// 			),
// 			withTimeout(
// 				db.query.formFields.findMany({
// 					where: eq(formFields.formId, input.formId),
// 				}),
// 				DB_TIMEOUT_MS,
// 				"submitLandingPageLead:fields",
// 			),
// 		]);

// 		if (!form)
// 			return { success: false, message: "This form is no longer available." };

// 		for (const f of fields) {
// 			if (f.required && f.type !== "hidden" && !input.values[f.id]?.trim()) {
// 				return { success: false, message: `${f.label} is required.` };
// 			}
// 		}

// 		const mapped: Record<string, string> = {};
// 		for (const f of fields) {
// 			const raw = input.values[f.id]?.trim();
// 			if (raw && f.crmMapping && CRM_MAPPING_VALUES.has(f.crmMapping)) {
// 				mapped[f.crmMapping] = raw;
// 			}
// 		}

// 		if (!mapped.fullName) {
// 			const nameField = fields.find(
// 				(f) =>
// 					f.type === "text" && /full ?name|your ?name|^name$/i.test(f.label),
// 			);
// 			const raw = nameField ? input.values[nameField.id]?.trim() : undefined;
// 			if (raw) {
// 				mapped.fullName = raw;
// 			} else {
// 				console.error(
// 					`[submitLandingPageLead] No field mapped to "fullName" on form ${input.formId}.`,
// 				);
// 				return {
// 					success: false,
// 					message:
// 						"We couldn't process your submission right now. Please try again shortly.",
// 				};
// 			}
// 		}

// 		if (mapped.email) {
// 			const normalized = mapped.email.trim().toLowerCase();
// 			if (!emailPattern.test(normalized)) {
// 				return { success: false, message: "Enter a valid email address." };
// 			}
// 			mapped.email = normalized;
// 		}

// 		if (mapped.phoneNumber) {
// 			const phoneCheck = validateAndFormatPhone(mapped.phoneNumber);
// 			if (!phoneCheck.isValid) {
// 				return {
// 					success: false,
// 					message: "Enter a valid phone number, including the country code.",
// 				};
// 			}
// 			mapped.phoneNumber = phoneCheck.formatted!;
// 		}

// 		const landingPage = await withTimeout(
// 			db.query.landingPages.findFirst({
// 				where: eq(landingPages.slug, input.landingPageSlug),
// 			}),
// 			DB_TIMEOUT_MS,
// 			"submitLandingPageLead:page",
// 		);

// 		const wantsBrochure = isBrochureForm(form.type);
// 		const dedupeProjectSlug = landingPage?.linkedProjectSlug ?? null;

// 		let isDuplicate = false;
// 		if (
// 			wantsBrochure &&
// 			dedupeProjectSlug &&
// 			(mapped.email || mapped.phoneNumber)
// 		) {
// 			isDuplicate = await hasRecentBrochureRequest({
// 				projectSlug: dedupeProjectSlug,
// 				email: mapped.email,
// 				phoneNumber: mapped.phoneNumber,
// 			});
// 		}

// 		// Skip the insert entirely for a repeat brochure request — no new
// 		// lead row, no clutter.
// 		if (!isDuplicate) {
// 			await withTimeout(
// 				db.insert(leads).values({
// 					fullName: mapped.fullName,
// 					email: mapped.email || null,
// 					phoneNumber: mapped.phoneNumber || null,
// 					projectId: landingPage?.linkedProjectId ?? null,
// 					projectSlug: landingPage?.linkedProjectSlug ?? null,
// 					landingPageId: landingPage?.id ?? null,
// 					landingPageSlug: input.landingPageSlug,
// 					// Tagged "brochure" even when it came through a landing page
// 					// CTA rather than /brochures directly — keeps dedup and
// 					// reporting consistent across both entry points.
// 					// landingPageId/landingPageSlug above still show where it
// 					// came from.
// 					source: wantsBrochure ? "brochure" : "landing_page",
// 					status: "new",
// 					budgetRange: mapped.budgetRange || null,
// 					enquiryType:
// 						mapped.enquiryType || (wantsBrochure ? "brochure-download" : null),
// 					message: mapped.message || null,
// 					utmSource: input.utm?.utmSource || null,
// 					utmMedium: input.utm?.utmMedium || null,
// 					utmCampaign: input.utm?.utmCampaign || null,
// 				}),
// 				DB_TIMEOUT_MS,
// 				"submitLandingPageLead:insert",
// 			);
// 		}

// 		const projectName = landingPage?.title;
// 		let brochureSent = false;

// 		if (wantsBrochure && dedupeProjectSlug) {
// 			if (isDuplicate) {
// 				// Same redirect a fresh success gets — no email re-sent, no
// 				// new lead, but the visitor can't tell the difference, which
// 				// is what stops this being usable to probe which
// 				// emails/phones have already requested this brochure.
// 				redirectTo = `/brochures/${dedupeProjectSlug}/thank-you`;
// 				after(async () => {
// 					try {
// 						await withTimeout(
// 							db.insert(trackingEventLogs).values({
// 								eventName: "brochure_duplicate_blocked",
// 								pagePath: `/lp/${input.landingPageSlug}`,
// 								landingPageSlug: input.landingPageSlug,
// 								projectSlug: dedupeProjectSlug,
// 								metadata: {},
// 							}),
// 							5000,
// 							"submitLandingPageLead:duplicateLog",
// 						);
// 					} catch {
// 						/* non-blocking */
// 					}
// 				});
// 			} else if (mapped.email) {
// 				const brochure = await withTimeout(
// 					getBrochureByProjectSlug(dedupeProjectSlug),
// 					DB_TIMEOUT_MS,
// 					"submitLandingPageLead:brochure",
// 				);

// 				if (brochure) {
// 					const project = landingPage?.linkedProjectId
// 						? await db.query.projects.findFirst({
// 								where: eq(projects.id, landingPage.linkedProjectId),
// 							})
// 						: null;
// 					const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
// 					const downloadUrl = brochure.fileUrl.startsWith("http")
// 						? brochure.fileUrl
// 						: `${appUrl}${brochure.fileUrl}`;
// 					const settings = await getPublicSiteSettings();

// 					const emailResult = await withTimeout(
// 						sendBrochureEmail({
// 							to: mapped.email,
// 							recipientName: mapped.fullName,
// 							projectName: project?.name ?? projectName ?? dedupeProjectSlug,
// 							brochureDownloadUrl: downloadUrl,
// 							whatsappHref: settings.whatsappHref,
// 						}),
// 						DB_TIMEOUT_MS,
// 						"submitLandingPageLead:brochureEmail",
// 					);

// 					if (emailResult.success) {
// 						brochureSent = true;
// 						redirectTo = `/brochures/${dedupeProjectSlug}/thank-you`;
// 					} else {
// 						console.error(
// 							"[submitLandingPageLead] brochure email failed:",
// 							emailResult.message,
// 						);
// 					}
// 				} else {
// 					console.error(
// 						`[submitLandingPageLead] Form ${input.formId} is a brochure form but project ` +
// 							`"${dedupeProjectSlug}" has no brochure uploaded yet.`,
// 					);
// 				}
// 			}
// 		}

// 		after(async () => {
// 			try {
// 				if (mapped.email && !brochureSent && !isDuplicate) {
// 					await sendLeadAutoResponse({
// 						to: mapped.email,
// 						leadName: mapped.fullName,
// 						projectName,
// 					});
// 				}
// 			} catch (err) {
// 				console.error("[submitLandingPageLead] auto-response failed:", err);
// 			}

// 			try {
// 				if (!isDuplicate) {
// 					await sendSalesAlert({
// 						leadName: mapped.fullName,
// 						leadPhone: mapped.phoneNumber ?? "—",
// 						leadEmail: mapped.email,
// 						projectName,
// 						budgetRange: mapped.budgetRange,
// 						source: "Landing Page",
// 					});
// 				}
// 			} catch (err) {
// 				console.error("[submitLandingPageLead] sales alert failed:", err);
// 			}

// 			try {
// 				await withTimeout(
// 					db.insert(trackingEventLogs).values({
// 						eventName: "form_submit",
// 						pagePath: `/lp/${input.landingPageSlug}`,
// 						landingPageSlug: input.landingPageSlug,
// 						metadata: {	},
// 					}),
// 					5000,
// 					"submitLandingPageLead:trackEvent",
// 				);
// 			} catch (err) {
// 				console.error(
// 					"[submitLandingPageLead] tracking log failed (non-blocking):",
// 					err,
// 				);
// 			}
// 		});
// 	} catch (error) {
// 		const message =
// 			error instanceof Error ? error.message : "Unexpected error.";
// 		console.error("[submitLandingPageLead]", message);
// 		return {
// 			success: false,
// 			message:
// 				"We couldn't save your details right now. Please try again or contact us directly.",
// 		};
// 	}

// 	if (redirectTo) {
// 		redirect(redirectTo);
// 	}

// 	return { success: true, message: "Thank you — we'll be in touch shortly." };
// }

// lib/actions/landing-page-lead.ts
"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { db } from "@/lib/db";
import { forms, formFields, landingPages, leads, projects, trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
import { sendBrochureEmail, sendLeadAutoResponse, sendSalesAlert } from "@/lib/email/resend";
import { claimBrochureLead, markBrochureDelivered } from "@/lib/db/queries/leads-dedupe";
import { validateAndFormatPhone } from "@/lib/utils/phonenumber-validation";
import { looksLikeBot } from "@/lib/utils/bot-heuristics";
import { checkIpRateLimit } from "@/lib/utils/rate-limit";
import { CRM_MAPPING_VALUES } from "@/lib/constants/crm-mapping";
import type { UtmParams } from "@/lib/types/landing-page";

const DB_TIMEOUT_MS = 8000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LandingPageLeadResult {
	success: boolean;
	message: string;
}

function isBrochureForm(formType: string): boolean {
	return formType.toLowerCase().replace(/[\s-]+/g, "_").includes("brochure");
}

export async function submitLandingPageLead(input: {
	formId: string;
	landingPageSlug: string;
	values: Record<string, string>;
	utm?: UtmParams;
}): Promise<LandingPageLeadResult> {
	// __hp / __ts come from DynamicFormRenderer — present on every landing
	// page form regardless of what the admin built.
	if (looksLikeBot({ honeypot: input.values.__hp, renderedAt: input.values.__ts })) {
		console.warn("[submitLandingPageLead] Bot heuristic triggered, silently dropping.", {
			formId: input.formId,
			landingPageSlug: input.landingPageSlug,
		});
		return { success: true, message: "Thank you — we'll be in touch shortly." };
	}

	const headerList = await headers();
	const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	const rateLimit = checkIpRateLimit(ip, { limit: 8, windowInSeconds: 60 });
	if (!rateLimit.success) {
		return { success: false, message: "Too many requests. Please wait a moment and try again." };
	}

	// Set inside the try block, only ever read after it. redirect() throws
	// internally — calling it inside try/catch would let the catch below
	// swallow a *successful* navigation as if it were an error.
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

		// Safety net for forms saved before CRM Mapping was locked down.
		if (!mapped.fullName) {
			const nameField = fields.find(
				(f) => f.type === "text" && /full ?name|your ?name|^name$/i.test(f.label),
			);
			const raw = nameField ? input.values[nameField.id]?.trim() : undefined;
			if (raw) {
				mapped.fullName = raw;
			} else {
				console.error(`[submitLandingPageLead] No field mapped to "fullName" on form ${input.formId}.`);
				return {
					success: false,
					message: "We couldn't process your submission right now. Please try again shortly.",
				};
			}
		}

		if (mapped.email) {
			const normalized = mapped.email.trim().toLowerCase();
			if (!emailPattern.test(normalized)) {
				return { success: false, message: "Enter a valid email address." };
			}
			mapped.email = normalized;
		}

		if (mapped.phoneNumber) {
			const phoneCheck = validateAndFormatPhone(mapped.phoneNumber);
			if (!phoneCheck.isValid) {
				return { success: false, message: "Enter a valid phone number, including the country code." };
			}
			mapped.phoneNumber = phoneCheck.formatted!;
		}

		const landingPage = await withTimeout(
			db.query.landingPages.findFirst({ where: eq(landingPages.slug, input.landingPageSlug) }),
			DB_TIMEOUT_MS,
			"submitLandingPageLead:page",
		);

		const wantsBrochure = isBrochureForm(form.type);
		const dedupeProjectSlug = landingPage?.linkedProjectSlug ?? null;
		const projectName = landingPage?.title;
		const isBrochurePath = wantsBrochure && Boolean(dedupeProjectSlug) && Boolean(mapped.email);

		// ─── Brochure path — atomic claim, single row, single write ─────────
		if (isBrochurePath) {
			const claim = await claimBrochureLead({
				fullName: mapped.fullName,
				email: mapped.email,
				phoneNumber: mapped.phoneNumber || null,
				projectId: landingPage?.linkedProjectId ?? null,
				projectSlug: dedupeProjectSlug!,
				landingPageId: landingPage?.id ?? null,
				landingPageSlug: input.landingPageSlug,
				budgetRange: mapped.budgetRange || null,
				enquiryType: mapped.enquiryType || "brochure-download",
				message: mapped.message || null,
				utmSource: input.utm?.utmSource || null,
				utmMedium: input.utm?.utmMedium || null,
				utmCampaign: input.utm?.utmCampaign || null,
			});

			if (!claim.claimed) {
				// Already delivered within the cooldown, or a second request
				// is racing the first. Same redirect as a fresh success either
				// way — the visitor can't tell the difference, which is what
				// stops this being usable to probe which emails have already
				// requested a given project's brochure.
				redirectTo = `/brochures/${dedupeProjectSlug}/thank-you`;
				after(async () => {
					try {
						await withTimeout(
							db.insert(trackingEventLogs).values({
								eventName: "brochure_duplicate_blocked",
								pagePath: `/lp/${input.landingPageSlug}`,
								landingPageSlug: input.landingPageSlug,
								projectSlug: dedupeProjectSlug!,
								metadata: {},
							}),
							5000,
							"submitLandingPageLead:duplicateLog",
						);
					} catch {
						/* non-blocking */
					}
				});
			} else {
				const brochure = await withTimeout(
					getBrochureByProjectSlug(dedupeProjectSlug!),
					DB_TIMEOUT_MS,
					"submitLandingPageLead:brochure",
				);

				if (!brochure) {
					console.error(
						`[submitLandingPageLead] Form ${input.formId} is a brochure form but project ` +
							`"${dedupeProjectSlug}" has no brochure uploaded yet.`,
					);
					// The lead row is already saved by the claim above — tell
					// the truth instead of a fake "thank you," since nothing
					// is being emailed.
					return {
						success: false,
						message: "Your details were saved, but the brochure isn't available yet. We'll follow up directly.",
					};
				}

				const project = landingPage?.linkedProjectId
					? await db.query.projects.findFirst({ where: eq(projects.id, landingPage.linkedProjectId) })
					: null;
				const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
				const downloadUrl = brochure.fileUrl.startsWith("http") ? brochure.fileUrl : `${appUrl}${brochure.fileUrl}`;
				const settings = await getPublicSiteSettings();

				const emailResult = await withTimeout(
					sendBrochureEmail({
						to: mapped.email,
						recipientName: mapped.fullName,
						projectName: project?.name ?? projectName ?? dedupeProjectSlug!,
						brochureDownloadUrl: downloadUrl,
						whatsappHref: settings.whatsappHref,
					}),
					DB_TIMEOUT_MS,
					"submitLandingPageLead:brochureEmail",
				);

				if (!emailResult.success) {
					console.error("[submitLandingPageLead] brochure email failed:", emailResult.message);
					// Row stays undelivered — a retry after the short cooldown
					// (BROCHURE_RETRY_COOLDOWN_SECONDS) genuinely re-attempts
					// the send instead of being told "you already got this."
					return {
						success: false,
						message:
							"Your details were saved, but we couldn't send the brochure email right now. Please try again in a moment or contact us directly.",
					};
				}

				await markBrochureDelivered(claim.leadId!);
				redirectTo = `/brochures/${dedupeProjectSlug}/thank-you`;

				after(async () => {
					// Only alert sales on a genuinely new lead, not on every
					// retry — attemptCount === 1 means this claim's INSERT
					// (not an UPDATE) is what won.
					if (claim.attemptCount === 1) {
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
					}
					try {
						await withTimeout(
							db.insert(trackingEventLogs).values({
								eventName: "form_submit",
								pagePath: `/lp/${input.landingPageSlug}`,
								landingPageSlug: input.landingPageSlug,
								metadata: { formType: form.type, brochureSent: "true" },
							}),
							5000,
							"submitLandingPageLead:trackEvent",
						);
					} catch (err) {
						console.error("[submitLandingPageLead] tracking log failed (non-blocking):", err);
					}
				});
			}
		} else {
			// ─── Everything else — general enquiry, newsletter, investor
			// interest, etc. Unrelated to brochure dedupe entirely. ─────────
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

			after(async () => {
				try {
					if (mapped.email) {
						await sendLeadAutoResponse({ to: mapped.email, leadName: mapped.fullName, projectName });
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
							metadata: { formType: form.type },
						}),
						5000,
						"submitLandingPageLead:trackEvent",
					);
				} catch (err) {
					console.error("[submitLandingPageLead] tracking log failed (non-blocking):", err);
				}
			});
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[submitLandingPageLead]", message);
		return {
			success: false,
			message: "We couldn't save your details right now. Please try again or contact us directly.",
		};
	}

	if (redirectTo) {
		redirect(redirectTo);
	}

	return { success: true, message: "Thank you — we'll be in touch shortly." };
}