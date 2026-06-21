// components/public/home/contact-form-section.tsx
"use client";
import { LeadForm } from "./LeadForm";
import type { Form } from "@/lib/types";
import type { ContactCtaContent } from "@/lib/types/public-content";

export function ContactFormSection({
	content,
	form,
}: {
	content: ContactCtaContent;
	form: Form | null;
}) {
	return (
		<section
			id="contact"
			className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10"
		>
			<div>
				<h2 className="text-3xl font-extrabold text-brand-red leading-tight">
					{content.heading}
				</h2>
				<p className="text-gray-500 mt-4 max-w-md whitespace-pre-line">
					{content.body}
				</p>
			</div>
			<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
				{form ? (
					<LeadForm
						form={form}
						context={{ source: "website", sourcePage: "/" }}
						submitLabel="Send enquiry"
					/>
				) : (
					<p className="text-sm text-gray-400">
						Contact form is not configured yet — create a form with type
						&quot;General Contact&quot; in the CMS Forms module.
					</p>
				)}
			</div>
		</section>
	);
}
