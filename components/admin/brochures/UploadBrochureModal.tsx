"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { uploadBrochure } from "@/lib/actions/admin/brochure";
import { featuredProjects } from "@/lib/data/projects";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";

export interface UploadBrochureModalProps {
	mode: "upload" | "replace";
	replacingId?: string;
	replacingTitle?: string;
	onClose: () => void;
}

export function UploadBrochureModal({
	mode,
	replacingTitle,
	onClose,
}: UploadBrochureModalProps) {
	const [title, setTitle] = useState(replacingTitle ?? "");
	const [projectSlug, setProjectSlug] = useState("");
	const [fileName, setFileName] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState<string | null>(null);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		setFileName(file?.name ?? null);
	}

	function handleSubmit() {
		const fd = new FormData();
		fd.append("title", title);
		fd.append("projectSlug", projectSlug);

		startTransition(async () => {
			const res = await uploadBrochure(fd);
			setResult(res.message);
		});
	}

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				onClick={onClose}
				aria-label="Close modal"
				className="fixed inset-0 z-40 bg-black/50"
			/>

			{/* Modal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={mode === "upload" ? "Upload Brochure" : "Replace Brochure"}
				className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
			>
				<div className="flex items-center justify-between">
					<h2 className="text-base font-bold text-ink-950">
						{mode === "upload"
							? "Upload Brochure"
							: `Replace: ${replacingTitle}`}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-stone-400 hover:text-ink-950"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="mt-5 space-y-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Brochure Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Vatican Court Brochure"
							className={inputCls}
						/>
					</div>

					{mode === "upload" ? (
						<div>
							<label className="mb-1.5 block text-sm font-medium text-ink-950">
								Linked Project
							</label>
							<select
								value={projectSlug}
								onChange={(e) => setProjectSlug(e.target.value)}
								className={selectCls}
							>
								<option value="">Select a project...</option>
								{featuredProjects.map((p) => (
									<option key={p.slug} value={p.slug}>
										{p.name}
									</option>
								))}
							</select>
						</div>
					) : null}

					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							PDF File <span className="text-red-500">*</span>
						</label>
						<label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-stone-300 p-6 transition-colors hover:border-red-300 hover:bg-red-50">
							<FileText className="h-7 w-7 text-stone-400" />
							<span className="text-sm font-medium text-stone-600">
								{fileName ?? "Click to select PDF"}
							</span>
							<span className="text-xs text-stone-400">
								Max 50MB · PDF only
							</span>
							<input
								type="file"
								accept=".pdf"
								onChange={handleFileChange}
								className="sr-only"
							/>
						</label>
					</div>

					<div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
						<p className="text-xs font-semibold text-amber-700">
							Integration Stage Note
						</p>
						<p className="mt-0.5 text-xs text-amber-600">
							File upload via Cloudinary will be wired in the integration stage.
							The lead capture gate (name + email required before download) is
							already live on the public brochure pages.
						</p>
					</div>

					{result ? (
						<p className="text-sm font-medium text-emerald-600">{result}</p>
					) : null}
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !title.trim() || !fileName}
						className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Upload className="h-4 w-4" />
						)}
						{mode === "upload" ? "Upload Brochure" : "Replace File"}
					</button>
				</div>
			</div>
		</>
	);
}
