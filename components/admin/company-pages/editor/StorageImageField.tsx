//components/admin/company-pages/editor/StorageImageField.tsx

"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

export interface StorageImageFieldProps {
	label: string;
	value: string; // current image URL (may be empty)
	altValue?: string; // alt text value
	onChange: (url: string, alt: string) => void;
	folder?: string; // Supabase Storage subfolder, e.g. "team-photos"
	aspectClass?: string; // Tailwind aspect ratio class, e.g. "aspect-[16/9]"
	hint?: string;
	required?: boolean;
}

export function StorageImageField({
	label,
	value,
	altValue = "",
	onChange,
	folder = "general",
	aspectClass = "aspect-[16/9]",
	hint,
	required,
}: StorageImageFieldProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleFile(file: File) {
		setUploading(true);
		setError(null);

		const fd = new FormData();
		fd.append("file", file);
		fd.append("folder", folder);

		try {
			const res = await fetch("/api/admin/storage/upload", {
				method: "POST",
				body: fd,
			});

			const data: { success?: boolean; url?: string; error?: string } =
				await res.json();

			if (!res.ok || !data.success || !data.url) {
				setError(data.error ?? "Upload failed.");
				return;
			}

			// Pass the new URL up — keep the existing alt text
			onChange(data.url, altValue);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload error.");
		} finally {
			setUploading(false);
		}
	}

	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-ink-950">
				{label}
				{required ? <span className="ml-1 text-red-500">*</span> : null}
			</label>

			{value ? (
				/* ── Preview ── */
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
					{/* Hover controls */}
					<div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
							className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-white disabled:opacity-60"
						>
							{uploading ? "Uploading..." : "Replace Image"}
						</button>
						<button
							type="button"
							onClick={() => onChange("", altValue)}
							aria-label="Remove image"
							className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			) : (
				/* ── Empty state ── */
				<label
					className={cn(
						"flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors",
						uploading
							? "border-red-300 bg-red-50 cursor-not-allowed"
							: "border-stone-300 bg-stone-50 hover:border-red-300 hover:bg-red-50",
						aspectClass,
					)}
				>
					{uploading ? (
						<Loader2 className="h-7 w-7 animate-spin text-red-600" />
					) : (
						<ImageIcon className="h-7 w-7 text-stone-300" />
					)}
					<div className="text-center">
						<p className="text-xs font-medium text-stone-500">
							{uploading ? "Uploading to Supabase..." : "Click to upload image"}
						</p>
						<p className="mt-0.5 text-[10px] text-stone-400">
							JPG, PNG, WebP, SVG · max 10 MB
						</p>
					</div>
					{!uploading ? (
						<span className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950">
							<UploadCloud className="h-3.5 w-3.5" />
							Choose File
						</span>
					) : null}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
						disabled={uploading}
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleFile(file);
							e.target.value = "";
						}}
						className="sr-only"
					/>
				</label>
			)}

			{/* Hidden file input for "Replace" button */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
				disabled={uploading}
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
					e.target.value = "";
				}}
				className="sr-only"
			/>

			{/* Alt text */}
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

			{error ? (
				<p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
			) : null}
		</div>
	);
}
