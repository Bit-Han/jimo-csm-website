"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { requestImageUploadSignature } from "@/lib/actions/admin/media";
import { uploadDirectToCloudinary } from "@/lib/utils/cloudinary-client-upload";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
];

export interface ImageUploadFieldProps {
	label: string;
	value: string;
	altValue?: string;
	/**
	 * previousUrlToDelete fires when the user confirms replacing or removing
	 * an existing image. The parent must hold onto it and only delete it
	 * from Cloudinary after a successful save — never eagerly — so closing
	 * an accordion or navigating away mid-edit can never destroy a live asset.
	 */
	onChange: (url: string, alt: string, previousUrlToDelete?: string) => void;
	folder: string;
	aspectClass?: string;
	hint?: string;
	required?: boolean;
}

export function ImageUploadField({
	label,
	value,
	altValue = "",
	onChange,
	folder,
	aspectClass = "aspect-[16/9]",
	hint,
	required,
}: ImageUploadFieldProps) {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [confirmAction, setConfirmAction] = useState<
		"replace" | "remove" | null
	>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const xhrRef = useRef<XMLHttpRequest | null>(null);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			xhrRef.current?.abort();
		};
	}, []);

	async function handleFile(file: File) {
		setError(null);

		if (!ACCEPTED_TYPES.includes(file.type)) {
			setError("Please choose a JPG, PNG, WebP, GIF, or SVG image.");
			return;
		}
		if (file.size > MAX_IMAGE_SIZE) {
			setError(
				`Image is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
			);
			return;
		}

		const previousValue = value;
		setUploading(true);
		setProgress(0);

		try {
			const signed = await requestImageUploadSignature(folder);
			const uploaded = await uploadDirectToCloudinary(
				signed,
				file,
				setProgress,
				xhrRef,
				"image",
			);

			if (!mountedRef.current) return;
			onChange(uploaded.secureUrl, altValue, previousValue || undefined);
		} catch (err) {
			if (!mountedRef.current) return;
			setError(
				err instanceof Error ? err.message : "Upload failed. Please try again.",
			);
		} finally {
			if (mountedRef.current) {
				setUploading(false);
				setProgress(0);
			}
		}
	}

	function handleChooseFileClick() {
		if (value) {
			setConfirmAction("replace"); // existing image — confirm before replacing it
		} else {
			fileInputRef.current?.click();
		}
	}

	function handleConfirm() {
		const action = confirmAction;
		setConfirmAction(null);
		if (action === "replace") {
			fileInputRef.current?.click();
		} else if (action === "remove") {
			onChange("", altValue, value || undefined);
		}
	}

	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-ink-950">
				{label}
				{required ? <span className="ml-1 text-red-500">*</span> : null}
			</label>

			<input
				ref={fileInputRef}
				type="file"
				accept={ACCEPTED_TYPES.join(",")}
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
					e.target.value = "";
				}}
				className="sr-only"
			/>

			{uploading ? (
				<div
					className={cn(
						"flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-red-300 bg-red-50",
						aspectClass,
					)}
				>
					<Loader2 className="h-7 w-7 animate-spin text-red-600" />
					<div className="w-2/3 text-center">
						<p className="text-xs font-medium text-stone-600">
							Uploading… {progress}%
						</p>
						<div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
							<div
								className="h-full rounded-full bg-red-600 transition-all duration-200"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={() => xhrRef.current?.abort()}
						className="text-xs font-medium text-stone-500 hover:text-red-600"
					>
						Cancel
					</button>
				</div>
			) : value ? (
				<div
					className={cn(
						"relative overflow-hidden rounded-2xl border border-stone-200",
						aspectClass,
					)}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={value}
						alt={altValue || label}
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100">
						<button
							type="button"
							onClick={handleChooseFileClick}
							className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-white"
						>
							Replace Image
						</button>
						<button
							type="button"
							onClick={() => setConfirmAction("remove")}
							aria-label="Remove image"
							className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={handleChooseFileClick}
					className={cn(
						"flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 transition-colors hover:border-red-300 hover:bg-red-50",
						aspectClass,
					)}
				>
					<ImageIcon className="h-7 w-7 text-stone-300" />
					<div className="text-center">
						<p className="text-xs font-medium text-stone-500">
							Click to upload image
						</p>
						<p className="mt-0.5 text-[10px] text-stone-400">
							JPG, PNG, WebP, SVG · max {MAX_IMAGE_SIZE / 1024 / 1024} MB
						</p>
					</div>
					<span className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950">
						<UploadCloud className="h-3.5 w-3.5" />
						Choose File
					</span>
				</button>
			)}

			<div className="mt-2">
				<label className="mb-1 block text-xs font-medium text-stone-500">
					Image alt text
					{required ? <span className="ml-1 text-red-500">*</span> : null}
				</label>
				<input
					type="text"
					value={altValue}
					onChange={(e) => onChange(value, e.target.value)}
					placeholder="Describe the image for accessibility and SEO"
					className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
				/>
			</div>

			{hint ? <p className="mt-1.5 text-xs text-stone-400">{hint}</p> : null}
			{required && !value && !uploading ? (
				<p className="mt-1.5 text-xs font-medium text-amber-600">
					This image is required.
				</p>
			) : null}
			{error ? (
				<p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
			) : null}

			<ConfirmDialog
				open={confirmAction !== null}
				title={
					confirmAction === "replace"
						? "Replace this image?"
						: "Remove this image?"
				}
				description="The current image will be permanently deleted from Cloudinary when you save this form. This can't be undone."
				confirmLabel={confirmAction === "replace" ? "Continue" : "Remove"}
				variant="danger"
				onConfirm={handleConfirm}
				onCancel={() => setConfirmAction(null)}
			/>
		</div>
	);
}