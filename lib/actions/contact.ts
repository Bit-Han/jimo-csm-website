"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads, projects } from "@/lib/db/schema";
import type { ContactFormState } from "@/lib/types/contact";

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

	try {
		// Look up the project by slug (nullable — general enquiries have no project)
		let projectId: string | null = null;

		if (projectOfInterest !== "general") {
			const projectRow = await db.query.projects.findFirst({
				where: eq(projects.slug, projectOfInterest),
			});
			projectId = projectRow?.id ?? null;
		}

		// Write lead to DB
		await db.insert(leads).values({
			fullName,
			email,
			phoneNumber,
			projectId,
			projectSlug: projectOfInterest === "general" ? null : projectOfInterest,
			source: "website",
			status: "new",
			enquiryType,
			message,
		});

		// TODO (email integration): send auto-response email via Resend
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Something went wrong saving your enquiry.";
		console.error("[submitContactEnquiry] DB error:", message);

		return {
			status: "error",
			message:
				"We could not save your enquiry right now. Please try again or contact us directly via WhatsApp.",
			fieldErrors: {},
		};
	}

	// redirect() is called OUTSIDE the try/catch so it isn't caught as an error
	redirect("/contact/thank-you");
}