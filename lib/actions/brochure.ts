// "use server";

// import { redirect } from "next/navigation";
// import { eq } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { leads, projects } from "@/lib/db/schema";
// import { sendBrochureEmail } from "@/lib/email/resend";
// import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
// import { siteConfig } from "@/lib/data/site";
// import type { BrochureLeadFormState } from "@/lib/types/brochure";

// const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export async function submitBrochureRequest(
// 	_previousState: BrochureLeadFormState,
// 	formData: FormData,
// ): Promise<BrochureLeadFormState> {
// 	const projectSlug = String(formData.get("projectSlug") ?? "").trim();
// 	const fullName = String(formData.get("fullName") ?? "").trim();
// 	const email = String(formData.get("email") ?? "").trim();
// 	const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();

// 	const fieldErrors: BrochureLeadFormState["fieldErrors"] = {};
// 	if (fullName.length < 2) fieldErrors.fullName = "Enter your full name.";
// 	if (!emailPattern.test(email))
// 		fieldErrors.email = "Enter a valid email address.";
// 	if (phoneNumber.length < 7)
// 		fieldErrors.phoneNumber = "Enter a valid phone number.";

// 	if (Object.keys(fieldErrors).length > 0) {
// 		return {
// 			status: "error",
// 			message: "Please fix the highlighted fields and try again.",
// 			fieldErrors,
// 		};
// 	}

// 	// Pull brochure from DB (not static file)
// 	const brochure = await getBrochureByProjectSlug(projectSlug);

// 	if (!brochure) {
// 		return {
// 			status: "error",
// 			message:
// 				"The brochure for this project is not yet available. Please contact us directly.",
// 			fieldErrors: {},
// 		};
// 	}

// 	// Look up project for the lead FK
// 	const project = await db.query.projects.findFirst({
// 		where: eq(projects.slug, projectSlug),
// 	});

// 	// Save lead to DB
// 	await db.insert(leads).values({
// 		fullName,
// 		email,
// 		phoneNumber,
// 		projectId: project?.id ?? null,
// 		projectSlug,
// 		source: "brochure",
// 		status: "new",
// 		enquiryType: "brochure-download",
// 	});

// 	// Build a full URL if the fileUrl is a relative path
// 	const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
// 	const downloadUrl = brochure.fileUrl.startsWith("http")
// 		? brochure.fileUrl
// 		: `${appUrl}${brochure.fileUrl}`;

// 	// Send brochure via Resend
// 	await sendBrochureEmail({
// 		to: email,
// 		recipientName: fullName,
// 		projectName: project?.name ?? projectSlug,
// 		brochureDownloadUrl: downloadUrl,
// 		whatsappHref: siteConfig.whatsappHref,
// 	});

// 	redirect(`/brochures/${projectSlug}/thank-you`);
// }

"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads, projects } from "@/lib/db/schema";
import { sendBrochureEmail } from "@/lib/email/resend";
import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";
import { siteConfig } from "@/lib/data/site";
import type { BrochureLeadFormState } from "@/lib/types/brochure";

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
	if (phoneNumber.length < 7)
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

		await sendBrochureEmail({
			to: email,
			recipientName: fullName,
			projectName: project?.name ?? projectSlug,
			brochureDownloadUrl: downloadUrl,
			whatsappHref: siteConfig.whatsappHref,
		});
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

	redirect(`/brochures/${projectSlug}/thank-you`);
}