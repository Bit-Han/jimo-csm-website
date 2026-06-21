// components/public/lead-form.tsx
// The one piece of interactivity all public CTAs share: renders whatever
// fields the Form Builder configured, maps them via crmMapping, posts to
// the existing public /api/leads route.
"use client";

import { useState } from "react";
import { FormFieldInput } from "./FormFieldInput";
import { buildLeadPayloadFromFields } from "@/lib/utils/form-field-mapping";
import type { Form } from "@/lib/types";

type LeadFormContext = {
	source: "website" | "landing_page" | "brochure";
	sourcePage: string;
	projectId?: string;
	landingPageId?: string;
	brochureId?: string;
	ctaSource?: string;
};

type LeadFormProps = {
	form: Form;
	context: LeadFormContext;
	submitLabel?: string;
	onSuccess?: () => void;
};

export function LeadForm({
	form,
	context,
	submitLabel = "Submit",
	onSuccess,
}: LeadFormProps) {
	const [values, setValues] = useState<Record<string, string>>({});
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const visibleFields = [...form.fields]
		.filter((f) => f.type !== "hidden")
		.sort((a, b) => a.orderIndex - b.orderIndex);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus("submitting");
		setErrorMsg(null);

		const fieldPayload = buildLeadPayloadFromFields(form.fields, values);
		const existingExtra =
			(fieldPayload.extraData as Record<string, string>) ?? {};

		const res = await fetch("/api/leads", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				formId: form.id,
				source: context.source,
				sourcePage: context.sourcePage,
				projectId: context.projectId,
				landingPageId: context.landingPageId,
				brochureId: context.brochureId,
				...fieldPayload,
				extraData: context.ctaSource
					? { cta_source: context.ctaSource, ...existingExtra }
					: existingExtra,
			}),
		});
		const json = await res.json();

		if (json.success) {
			setStatus("success");
			onSuccess?.();
		} else {
			setStatus("error");
			setErrorMsg(json.error ?? "Something went wrong. Please try again.");
		}
	}

	if (status === "success") {
		return (
			<p className="text-center text-green-700 font-medium py-6">
				{form.successMessage ?? "Thank you! We'll be in touch shortly."}
			</p>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{visibleFields.map((field) => (
				<FormFieldInput
					key={field.id}
					field={field}
					value={values[field.id] ?? ""}
					onChange={(v) => setValues((p) => ({ ...p, [field.id]: v }))}
				/>
			))}
			{errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
			<button
				type="submit"
				disabled={status === "submitting"}
				className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
			>
				{status === "submitting" ? "Sending…" : submitLabel}
			</button>
		</form>
	);
}
