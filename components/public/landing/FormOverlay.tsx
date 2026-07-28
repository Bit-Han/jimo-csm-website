// components/public/landing/FormOverlay.tsx
"use client";

import { useState, useTransition } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
import { submitLandingPageLead } from "@/lib/actions/landing-page-lead";
import type { PublicFormForOverlay, UtmParams } from "@/lib/types/landing-page";

export function FormOverlay({
	form,
	landingPageSlug,
	utm,
	onClose,
}: {
	form: PublicFormForOverlay;
	landingPageSlug: string;
	utm?: UtmParams;
	onClose: () => void;
}) {
	const [isPending, startTransition] = useTransition();
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	function handleSubmit(values: Record<string, string>) {
		startTransition(async () => {
			const result = await submitLandingPageLead({
				formId: form.id,
				landingPageSlug,
				values,
				utm,
			});
			if (result.success) {
				setStatus("success");
			} else {
				setStatus("error");
				setErrorMessage(result.message);
			}
		});
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
				>
					<X className="h-5 w-5" />
				</button>

				{status === "success" ? (
					<div className="flex flex-col items-center gap-3 py-6 text-center">
						<CheckCircle2 className="h-10 w-10 text-emerald-500" />
						<p className="text-base font-bold text-ink-950">Thank you!</p>
						<p className="text-sm text-stone-500">
							We&apos;ve received your details and will be in touch shortly.
						</p>
					</div>
				) : (
					<>
						<p className="text-lg font-bold text-ink-950">{form.title}</p>
						<div className="mt-4">
							<DynamicFormRenderer
								fields={form.fields}
								onSubmit={handleSubmit}
								submitLabel="Submit Enquiry"
								submitting={isPending}
							/>
						</div>
						{status === "error" ? (
							<p className="mt-2 text-xs font-medium text-red-500">
								{errorMessage}
							</p>
						) : null}
					</>
				)}
			</div>
		</div>
	);
}
