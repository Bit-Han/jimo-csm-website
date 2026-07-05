"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { UploadBrochureModal } from "./UploadBrochureModal";

export function UploadBrochureButton() {
	const [open, setOpen] = useState(false);

	return (
		<>
			{open ? (
				<UploadBrochureModal mode="upload" onClose={() => setOpen(false)} />
			) : null}
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
			>
				<Upload className="h-4 w-4" />
				Upload Brochure
			</button>
		</>
	);
}
