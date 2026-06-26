"use server";

import { redirect } from "next/navigation";
import { getProjectBrochure } from "@/lib/data/brochures";
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

	if (fullName.length < 2) {
		fieldErrors.fullName = "Enter your full name.";
	}

	if (!emailPattern.test(email)) {
		fieldErrors.email = "Enter a valid email address.";
	}

	if (phoneNumber.length < 7) {
		fieldErrors.phoneNumber = "Enter a valid phone number.";
	}

	const brochure = getProjectBrochure(projectSlug);

	if (!brochure) {
		fieldErrors.fullName =
			fieldErrors.fullName ?? "This project's brochure isn't available yet.";
	}

	if (Object.keys(fieldErrors).length > 0) {
		return {
			status: "error",
			message: "Please fix the highlighted fields and try again.",
			fieldErrors,
		};
	}

	// TODO (integration stage): create/update a contact profile in Supabase,
	// sync the lead to HubSpot, and trigger a transactional email (e.g. via
	// Resend or a Supabase Edge Function) that sends `brochure.fileUrl` to
	// `email`. None of that exists yet — intentionally a no-op for now.

	redirect(`/brochures/${projectSlug}/thank-you`);
}
