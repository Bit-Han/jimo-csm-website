"use server";

import { redirect } from "next/navigation";
import { enquiryTypeOptions, isKnownProjectSlug } from "@/lib/data/contact";
import type { ContactFormState } from "@/lib/types/contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

	if (!enquiryTypeOptions.some((option) => option.value === enquiryType)) {
		fieldErrors.enquiryType = "Select an enquiry type.";
	}

	if (!isKnownProjectSlug(projectOfInterest)) {
		fieldErrors.projectOfInterest = "Select a project.";
	}

	if (message.length < 10) {
		fieldErrors.message =
			"Tell us a little more about what you'd like to discuss.";
	}

	if (Object.keys(fieldErrors).length > 0) {
		return {
			status: "error",
			message: "Please fix the highlighted fields and try again.",
			fieldErrors,
		};
	}

	// TODO (integration stage): persist this enquiry to Supabase, sync it to
	// HubSpot as a lead, and trigger the auto-response email/brochure sequence.
	// Intentionally a no-op for now so Stage 4 can ship ahead of the backend.

	redirect("/contact/thank-you");
}
