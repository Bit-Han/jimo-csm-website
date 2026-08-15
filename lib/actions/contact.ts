
//actions/contact.ts
"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads, projects } from "@/lib/db/schema";
import type { ContactFormState } from "@/lib/types/contact";
import { trackingEventLogs } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENQUIRY_TYPES = [
	"buyer",
	"investor",
	"partner",
	"diaspora-buyer",
	"realtor",
	"general",
];

export async function submitContactEnquiry(
	_previousState: ContactFormState,
	formData: FormData,
): Promise<ContactFormState> {
	const fullName = String(formData.get("fullName") ?? "").trim();
	const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const enquiryType = String(formData.get("enquiryType") ?? "").trim();

	// Safely reads the hidden value even if the dropdown was locked/disabled in UI
	const projectOfInterest = String(
		formData.get("projectOfInterest") ?? "",
	).trim();
	const message = String(formData.get("message") ?? "").trim();

	const fieldErrors: ContactFormState["fieldErrors"] = {};

	if (fullName.length < 2) {
		fieldErrors.fullName = "Enter your full name.";
	}
	if (phoneNumber.length < 7) {
		fieldErrors.phoneNumber = "Enter a valid phone number.";
	}
	if (!emailPattern.test(email)) {
		fieldErrors.email = "Enter a valid email address.";
	}
	if (!ENQUIRY_TYPES.includes(enquiryType)) {
		fieldErrors.enquiryType = "Select an enquiry type.";
	}
	if (!projectOfInterest) {
		fieldErrors.projectOfInterest = "Select a project or general enquiry.";
	}
	if (message.length < 5) {
		fieldErrors.message =
			"Tell us a little more about what you would like to discuss.";
	}

	if (Object.keys(fieldErrors).length > 0) {
		return {
			status: "error",
			message: "Please fix the highlighted fields and try again.",
			fieldErrors,
		};
	}

	// Declare query tracking variables outside try scope
	let projectId: string | null = null;
	let dynamicProjectSlug: string | null = null;

	try {
		// Look up the project by slug (nullable — general enquiries have no project)
		if (projectOfInterest !== "general") {
			const projectRow = await db.query.projects.findFirst({
				where: eq(projects.slug, projectOfInterest),
			});

			if (projectRow) {
				projectId = projectRow.id;
				dynamicProjectSlug = projectRow.slug;
			} else {
				// Fallback safety guard if the locked URL slug was corrupted/modified manually
				dynamicProjectSlug = null;
			}
		}

		// Write lead to DB
		await db.insert(leads).values({
			fullName,
			email,
			phoneNumber,
			projectId,
			projectSlug: dynamicProjectSlug,
			source: "website",
			status: "new",
			enquiryType,
			message,
		});

		// TODO (email integration): send auto-response email via Resend
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Something went wrong saving your enquiry.";
		console.error("[submitContactEnquiry] DB error:", errorMessage);

		return {
			status: "error",
			message:
				"We could not save your enquiry right now. Please try again or contact us directly via WhatsApp.",
			fieldErrors: {},
		};
	}

	try {
		// Non-blocking telemetry tracking analytics capture execution block
		await withTimeout(
			db.insert(trackingEventLogs).values({
				eventName: "form_submit",
				pagePath: "/contact",
				projectSlug: dynamicProjectSlug,
				metadata: { enquiryType },
			}),
			5000,
			"submitContactEnquiry:trackEvent",
		);
	} catch (err) {
		console.error(
			"[submitContactEnquiry] tracking log failed (non-blocking):",
			err,
		);
	}

	// redirect() is called OUTSIDE the try/catch blocks so it isn't caught as an internal routing execution error
	redirect("/contact/thank-you");
}
