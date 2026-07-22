// //@components/admin/projects/editor/tabs/BrochureTab.tsx
// import { FileText, Upload } from "lucide-react";
// import { EditorField, inputCls } from "@/components/admin/ui/EditorField";

// export function BrochureTab() {
// 	return (
// 		<div className="space-y-6">
// 			<div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 p-10 text-center">
// 				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
// 					<FileText className="h-6 w-6 text-stone-400" />
// 				</span>
// 				<div>
// 					<p className="text-sm font-semibold text-ink-950">
// 						Upload Project Brochure
// 					</p>
// 					<p className="mt-1 text-xs text-stone-500">
// 						PDF file, max 50MB. Stored in Cloudinary and gated behind the lead
// 						capture form.
// 					</p>
// 				</div>
// 				<button
// 					type="button"
// 					className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
// 				>
// 					<Upload className="h-4 w-4" />
// 					Upload PDF
// 					<span className="rounded bg-red-800 px-1.5 py-0.5 text-[10px] font-semibold text-red-200">
// 						TODO
// 					</span>
// 				</button>
// 			</div>

// 			<EditorField
// 				label="Brochure Title"
// 				hint="Shown to users before they download"
// 			>
// 				<input
// 					type="text"
// 					placeholder="e.g. Vatican Court Brochure"
// 					className={inputCls}
// 				/>
// 			</EditorField>

// 			<div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
// 				<p className="text-xs font-semibold text-amber-700">
// 					Integration Stage Note
// 				</p>
// 				<p className="mt-1 text-xs text-amber-600">
// 					PDF upload will use Cloudinary once the integration stage is complete.
// 					The file URL will be stored in the brochures table and auto-emailed
// 					via Resend/SendGrid when a visitor submits the brochure request form.
// 				</p>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
	Check,
	ExternalLink,
	FileText,
	Loader2,
	RefreshCw,
	Trash2,
	Upload,
} from "lucide-react";
import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import {
	requestBrochureUploadSignature,
	recordBrochureUpload,
	requestBrochureReplaceSignature,
	recordBrochureReplace,
	publishBrochure,
	unpublishBrochure,
	deleteBrochure,
} from "@/lib/actions/admin/brochure";
import { uploadDirectToCloudinary } from "@/lib/utils/cloudinary-client-upload";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

const MAX_BROCHURE_SIZE = 10 * 1024 * 1024;

interface BrochureTabProps {
	projectSlug: string ;
	projectName: string;
	initialBrochure: AdminBrochureListRow | null;
}

export function BrochureTab({
	projectSlug,
	projectName,
	initialBrochure,
}: BrochureTabProps) {
	const [brochure, setBrochure] = useState<AdminBrochureListRow | null>(
		initialBrochure,
	);
	const [title, setTitle] = useState(
		initialBrochure?.title ?? `${projectName} Brochure`,
	);
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const replaceInputRef = useRef<HTMLInputElement>(null);
	const xhrRef = useRef<XMLHttpRequest | null>(null);

	if (!projectSlug) {
		return (
			<div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
				<FileText className="mx-auto h-8 w-8 text-stone-300" />
				<p className="mt-3 text-sm font-medium text-stone-600">
					Save this project first
				</p>
				<p className="mt-1 text-xs text-stone-400">
					A brochure has to belong to a saved project. Click &quot;Save
					Draft&quot; above, then come back to this tab to upload one.
				</p>
			</div>
		);
	}

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const selected = e.target.files?.[0] ?? null;
		setError(null);
		if (selected && selected.type !== "application/pdf") {
			setError("Only PDF files are accepted.");
			e.target.value = "";
			return;
		}
		if (selected && selected.size > MAX_BROCHURE_SIZE) {
			setError(
				`File too large. Maximum size is ${MAX_BROCHURE_SIZE / 1024 / 1024} MB.`,
			);
			e.target.value = "";
			return;
		}
		setFile(selected);
		e.target.value = "";
	}

	async function handleUpload() {
		if (!file) return setError("Select a PDF file first.");
		if (!title.trim()) return setError("Enter a brochure title.");

		setUploading(true);
		setProgress(0);
		setError(null);

		try {
			const signed = await requestBrochureUploadSignature(projectSlug);
			const uploaded = await uploadDirectToCloudinary(
				signed,
				file,
				setProgress,
				xhrRef,
				"raw",
			);
			const result = await recordBrochureUpload({
				title: title.trim(),
				projectSlug,
				cloudinaryPublicId: uploaded.publicId,
				fileUrl: uploaded.secureUrl,
			});

			if (result.success && result.id) {
				setBrochure({
					id: result.id,
					title: title.trim(),
					fileType: "pdf",
					relatedProject: projectName,
					relatedProjectSlug: projectSlug,
					status: "draft",
					leadsCount: null,
					statusNote: "Needs approval",
					fileUrl: uploaded.secureUrl,
					cloudinaryPublicId: uploaded.publicId,
					uploadedAt: new Date().toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric",
					}),
				});
				setFile(null);
			} else {
				setError(
					result.success
						? "Uploaded, but couldn't load its details — refresh this page."
						: result.message,
				);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed.");
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}

	async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
		const selected = e.target.files?.[0];
		e.target.value = "";
		if (!selected || !brochure) return;

		if (selected.type !== "application/pdf") {
			setError("Only PDF files are accepted.");
			return;
		}

		setUploading(true);
		setProgress(0);
		setError(null);

		try {
			const signed = await requestBrochureReplaceSignature(brochure.id);
			const uploaded = await uploadDirectToCloudinary(
				signed,
				selected,
				setProgress,
				xhrRef,
				"raw",
			);
			const result = await recordBrochureReplace({
				id: brochure.id,
				cloudinaryPublicId: uploaded.publicId,
				fileUrl: uploaded.secureUrl,
			});

			if (result.success) {
				setBrochure((prev) =>
					prev
						? {
								...prev,
								fileUrl: uploaded.secureUrl,
								cloudinaryPublicId: uploaded.publicId,
							}
						: prev,
				);
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Replace failed.");
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}

	async function handleTogglePublish() {
		if (!brochure) return;
		setBusy(true);
		const result =
			brochure.status === "draft"
				? await publishBrochure(brochure.id)
				: await unpublishBrochure(brochure.id);
		if (result.success) {
			setBrochure((prev) =>
				prev
					? {
							...prev,
							status: prev.status === "draft" ? "active" : "draft",
							statusNote:
								prev.status === "draft" ? "Published" : "Needs approval",
						}
					: prev,
			);
		} else {
			setError(result.message);
		}
		setBusy(false);
	}

	async function handleDelete() {
		if (!brochure) return;
		setBusy(true);
		const result = await deleteBrochure(brochure.id);
		setConfirmDelete(false);
		if (result.success) {
			setBrochure(null);
			setTitle(`${projectName} Brochure`);
		} else {
			setError(result.message);
		}
		setBusy(false);
	}

	return (
		<div className="space-y-6">
			{!brochure ? (
				<>
					<div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 p-10 text-center">
						<span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
							<FileText className="h-6 w-6 text-stone-400" />
						</span>
						<div>
							<p className="text-sm font-semibold text-ink-950">
								Upload Project Brochure
							</p>
							<p className="mt-1 text-xs text-stone-500">
								PDF file, max {MAX_BROCHURE_SIZE / 1024 / 1024} MB. Uploads
								straight to Cloudinary — this same brochure also appears in
								Admin → Brochures.
							</p>
						</div>

						{file ? (
							<div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
								<FileText className="h-4 w-4 text-red-600" />
								{file.name}
							</div>
						) : null}

						<input
							ref={fileInputRef}
							type="file"
							accept="application/pdf"
							onChange={handleFileSelect}
							className="sr-only"
						/>

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
							className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
						>
							<Upload className="h-4 w-4" />
							{file ? "Choose a different file" : "Choose PDF"}
						</button>
					</div>

					<EditorField
						label="Brochure Title"
						hint="Shown to users before they download"
					>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Vatican Court Brochure"
							disabled={uploading}
							className={inputCls}
						/>
					</EditorField>

					{uploading ? (
						<div>
							<div className="mb-1 flex items-center justify-between text-xs text-stone-500">
								<span>Uploading to Cloudinary...</span>
								<span>{progress}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
								<div
									className="h-full rounded-full bg-red-600 transition-all duration-200"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					) : null}

					{error ? (
						<p className="text-sm font-medium text-red-500">{error}</p>
					) : null}

					<button
						type="button"
						onClick={handleUpload}
						disabled={uploading || !file}
						className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
					>
						{uploading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Upload className="h-4 w-4" />
						)}
						Upload Brochure
					</button>
				</>
			) : (
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-start gap-3">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
								<FileText className="h-5 w-5 text-red-600" />
							</span>
							<div>
								<p className="text-sm font-semibold text-ink-950">
									{brochure.title}
								</p>
								<div className="mt-1 flex items-center gap-2">
									<AdminBadge
										variant={brochure.status === "active" ? "active" : "draft"}
									/>
									<span className="text-xs text-stone-400">
										{brochure.statusNote}
									</span>
								</div>
								<p className="mt-1 text-xs text-stone-400">
									Uploaded {brochure.uploadedAt}
								</p>
							</div>
						</div>

						<Link
							href={brochure.fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex shrink-0 items-center gap-1 text-xs font-medium text-stone-500 hover:text-ink-950"
						>
							View
							<ExternalLink className="h-3.5 w-3.5" />
						</Link>
					</div>

					{uploading ? (
						<div className="mt-4">
							<div className="mb-1 flex items-center justify-between text-xs text-stone-500">
								<span>Replacing file...</span>
								<span>{progress}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
								<div
									className="h-full rounded-full bg-red-600 transition-all duration-200"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					) : (
						<div className="mt-4 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
							<button
								type="button"
								onClick={handleTogglePublish}
								disabled={busy}
								className={`flex items-center gap-1 text-xs font-semibold disabled:opacity-50 ${
									brochure.status === "draft"
										? "text-emerald-600 hover:text-emerald-700"
										: "text-amber-600 hover:text-amber-700"
								}`}
							>
								{busy ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<Check className="h-3.5 w-3.5" />
								)}
								{brochure.status === "draft" ? "Publish" : "Unpublish"}
							</button>

							<input
								ref={replaceInputRef}
								type="file"
								accept="application/pdf"
								onChange={handleReplaceFile}
								className="sr-only"
							/>
							<button
								type="button"
								onClick={() => replaceInputRef.current?.click()}
								disabled={busy}
								className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
							>
								<RefreshCw className="h-3.5 w-3.5" />
								Replace
							</button>

							<button
								type="button"
								onClick={() => setConfirmDelete(true)}
								disabled={busy}
								className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Delete
							</button>
						</div>
					)}

					{error ? (
						<p className="mt-3 text-xs font-medium text-red-500">{error}</p>
					) : null}
				</div>
			)}

			<div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
				<p className="text-xs font-semibold text-blue-700">
					One brochure, everywhere
				</p>
				<p className="mt-1 text-xs text-blue-600">
					This is the same brochure record shown in Admin → Brochures —
					publishing, replacing, or deleting it here updates it there too, and
					vice versa.
				</p>
			</div>

			<ConfirmDialog
				open={confirmDelete}
				title="Delete this brochure?"
				description="This removes the file from Cloudinary and the database permanently, including from the public brochure download page and the Brochures list. This can't be undone."
				confirmLabel="Delete permanently"
				variant="danger"
				isLoading={busy}
				onConfirm={handleDelete}
				onCancel={() => setConfirmDelete(false)}
			/>
		</div>
	);
}