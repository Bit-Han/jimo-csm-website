// components/public/enquiry-modal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import type { Form } from "@/lib/types";

type EnquiryModalProps = {
	triggerLabel: string;
	triggerClassName: string;
	modalTitle: string;
	form: Form;
	context: Parameters<typeof LeadForm>[0]["context"];
};

export function EnquiryModal({
	triggerLabel,
	triggerClassName,
	modalTitle,
	form,
	context,
}: EnquiryModalProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button onClick={() => setOpen(true)} className={triggerClassName}>
				{triggerLabel}
			</button>

			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
						<button
							onClick={() => setOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
							aria-label="Close"
						>
							<X size={20} />
						</button>
						<h3 className="text-xl font-bold text-gray-900 mb-1">
							{modalTitle}
						</h3>
						<p className="text-sm text-gray-500 mb-5">
							Fill in your details and our team will reach out shortly.
						</p>
						<LeadForm form={form} context={context} />
					</div>
				</div>
			)}
		</>
	);
}
