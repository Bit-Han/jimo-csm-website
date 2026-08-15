"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads, projects } from "@/lib/db/schema";
import { sendBrochureEmail } from "@/lib/email/resend";
import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
// import { siteConfig } from "@/lib/data/site";
import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
import type { BrochureLeadFormState } from "@/lib/types/brochure";
import { trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitBrochureRequest(
	_previousState: BrochureLeadFormState,
	formData: FormData,
): Promise<BrochureLeadFormState> {
	const projectSlug = String(formData.get("projectSlug") ?? "").trim();
	const fullName = String(formData.get("fullName") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();

	const fieldErrors: BrochureLeadFormState["fieldErrors"] = {};
	if (fullName.length < 2) fieldErrors.fullName = "Enter your full name.";
	if (!emailPattern.test(email))
		fieldErrors.email = "Enter a valid email address.";
	if (phoneNumber.length < 11)
		fieldErrors.phoneNumber = "Enter a valid phone number.";

	if (Object.keys(fieldErrors).length > 0) {
		return {
			status: "error",
			message: "Please fix the highlighted fields and try again.",
			fieldErrors,
		};
	}

	try {
		const brochure = await getBrochureByProjectSlug(projectSlug);

		if (!brochure) {
			return {
				status: "error",
				message:
					"The brochure for this project is not yet available. Please contact us directly.",
				fieldErrors: {},
			};
		}

		const project = await db.query.projects.findFirst({
			where: eq(projects.slug, projectSlug),
		});

		await db.insert(leads).values({
			fullName,
			email,
			phoneNumber,
			projectId: project?.id ?? null,
			projectSlug,
			source: "brochure",
			status: "new",
			enquiryType: "brochure-download",
		});

		const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
		const downloadUrl = brochure.fileUrl.startsWith("http")
			? brochure.fileUrl
			: `${appUrl}${brochure.fileUrl}`;

       // Pulled from the DB-backed settings singleton (with its own
		// built-in fallback) instead of the static siteConfig constant, so
		// changing the WhatsApp number in the admin Settings page actually
		// reaches this email without a code deploy.

		const settings = await getPublicSiteSettings();

		const emailResult = await sendBrochureEmail({
			to: email,
			recipientName: fullName,
			projectName: project?.name ?? projectSlug,
			brochureDownloadUrl: downloadUrl,
			whatsappHref: settings.whatsappHref,
		});

		if (!emailResult.success) {
			console.error(
				"[submitBrochureRequest] brochure email failed:",
				emailResult.message,
			);
			return {
				status: "error",
				message:
					"Your request was received, but we could not send the brochure email right now. Please try again or contact us directly.",
				fieldErrors: {},
			};
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[submitBrochureRequest] error:", message);
		return {
			status: "error",
			message: "Could not process your request. Please try again.",
			fieldErrors: {},
		};
	}


try {
	await withTimeout(
		db.insert(trackingEventLogs).values({
			eventName: "brochure_form_submit",
			pagePath: `/brochures/${projectSlug}`,
			projectSlug,
			metadata: {},
		}),
		5000,
		"submitBrochureRequest:trackEvent",
	);
} catch (err) {
	console.error(
		"[submitBrochureRequest] tracking log failed (non-blocking):",
		err,
	);
}


	redirect(`/brochures/${projectSlug}/thank-you`);
}
