// components/public/landing/FormOverlay.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
import { submitLandingPageLead } from "@/lib/actions/landing-page-lead";
import { cn } from "@/lib/utils/helpers";
import type { PublicFormForOverlay, UtmParams } from "@/lib/types/landing-page";
import { trackEvent } from "@/lib/tracking/dispatch";

export function FormOverlay({
	form,
	landingPageSlug,
	utm,
	presentation = "center",
	onClose,
}: {
	form: PublicFormForOverlay;
	landingPageSlug: string;
	utm?: UtmParams;
	presentation?: "center" | "side";
	onClose: () => void;
}) {
	const [isPending, startTransition] = useTransition();
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const [visible, setVisible] = useState(presentation !== "side");

	// Side drawer starts off-screen, then animates in on the next frame —
	// standard slide-in pattern.
	useEffect(() => {
		if (presentation !== "side") return;
		const frame = requestAnimationFrame(() => setVisible(true));
		return () => cancelAnimationFrame(frame);
	}, [presentation]);

	// Locks background scroll while open — the hero itself never scrolls,
	// this keeps that true while the form is up too.
	useEffect(() => {
		const original = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = original;
		};
	}, []);

	function handleSubmit(values: Record<string, string>) {
		startTransition(async () => {
			const result = await submitLandingPageLead({ formId: form.id, landingPageSlug, values, utm });
			if (result.success) {
				setStatus("success");
				trackEvent("landing_page_form_submit", {
					landingPageSlug,
					formId: form.id,
				});
			} else {
				setStatus("error");
				setErrorMessage(result.message);
			}
		});
	}

	const body = (
		<>
			<button
				type="button"
				onClick={onClose}
				aria-label="Close"
				className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
			>
				<X className="h-5 w-5" />
			</button>

			{status === "success" ? (
				<div className="flex flex-col items-center gap-3 py-8 text-center">
					<CheckCircle2 className="h-10 w-10 text-emerald-500" />
					<p className="text-base font-bold text-ink-950">Thank you!</p>
					<p className="text-sm text-stone-500">
						We&apos;ve received your details and will be in touch shortly.
					</p>
				</div>
			) : (
				<>
					<p className="pr-8 text-lg font-bold text-ink-950">{form.title}</p>
					<div className="mt-4">
						<DynamicFormRenderer
							fields={form.fields}
							onSubmit={handleSubmit}
							submitLabel="Submit Enquiry"
							submitting={isPending}
						/>
					</div>
					{status === "error" ? (
						<p className="mt-2 text-xs font-medium text-red-500">{errorMessage}</p>
					) : null}
				</>
			)}
		</>
	);

	if (presentation === "side") {
		return (
			<div className="fixed inset-0 z-50">
				<button
					type="button"
					aria-label="Close"
					onClick={onClose}
					className={cn(
						"absolute inset-0 bg-black/50 transition-opacity duration-300",
						visible ? "opacity-100" : "opacity-0",
					)}
				/>
				<div
					className={cn(
						"absolute right-0 top-0 h-dvh w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-out sm:p-8",
						visible ? "translate-x-0" : "translate-x-full",
					)}
				>
					{body}
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<div className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
				{body}
			</div>
		</div>
	);
}