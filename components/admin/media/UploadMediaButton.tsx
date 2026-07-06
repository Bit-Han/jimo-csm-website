"use client";

import { useState, useTransition } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadMediaAsset } from "@/lib/actions/admin/media";

export function UploadMediaButton() {
	const [open, setOpen] = useState(false);
	const [fileName, setFileName] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState<string | null>(null);

	function handleUpload() {
		const fd = new FormData();
		startTransition(async () => {
			const result = await uploadMediaAsset(fd);
			setMessage(result.message);
		});
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
			>
				<Upload className="h-4 w-4" />
				Upload Media
			</button>

			{open ? (
				<>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Close"
						className="fixed inset-0 z-40 bg-black/50"
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
					>
						<div className="flex items-center justify-between">
							<p className="text-base font-bold text-ink-950">Upload Media</p>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="text-stone-400 hover:text-ink-950"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-stone-300 p-8 text-center transition-colors hover:border-red-300 hover:bg-red-50">
							<Upload className="h-7 w-7 text-stone-400" />
							<span className="text-sm font-medium text-stone-600">
								{fileName ?? "Click to select file"}
							</span>
							<span className="text-xs text-stone-400">
								Images, videos, PDFs, documents
							</span>
							<input
								type="file"
								className="sr-only"
								onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
							/>
						</label>

						<div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
							<p className="text-xs text-amber-600">
								File upload via Cloudinary will be wired in the integration
								stage.
							</p>
						</div>

						{message ? (
							<p className="mt-3 text-xs font-medium text-emerald-600">
								{message}
							</p>
						) : null}

						<div className="mt-5 flex justify-end gap-3">
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleUpload}
								disabled={isPending || !fileName}
								className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
							>
								{isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Upload className="h-4 w-4" />
								)}
								Upload
							</button>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}
