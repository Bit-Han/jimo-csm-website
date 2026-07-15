"use client";

import { useEffect, useRef, useState } from "react";
import { Film, Loader2, Search, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { CloudinaryFolder } from "@/lib/integrations/cloudinary";

interface MediaAssetResult {
	id: string;
	secureUrl: string;
	publicId: string;
	resourceType: string;
	format: string;
	altText: string;
	folder: string;
	sizeLabel: string;
}

export interface MediaPickerModalProps {
	// Called with the selected URL when user picks an asset
	onSelect: (url: string, altText: string) => void;
	onClose: () => void;
	// Context hint for auto-selecting the upload folder
	defaultFolder?: CloudinaryFolder;
	// Accept only images, or images + videos
	accept?: "image" | "image,video";
}

export function MediaPickerModal({
	onSelect,
	onClose,
	defaultFolder = "jimo-property/site-images",
	accept = "image",
}: MediaPickerModalProps) {
	const [assets, setAssets] = useState<MediaAssetResult[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const resourceTypeFilter = accept === "image" ? "image" : "all";

	async function fetchAssets(searchQuery = "") {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				search: searchQuery,
				resourceType: resourceTypeFilter,
				limit: "60",
			});
			const res = await fetch(`/api/admin/media/list?${params.toString()}`);
			if (!res.ok) throw new Error("Failed to load media.");
			const data = await res.json();
			setAssets(data.assets ?? []);
			setTotal(data.total ?? 0);
		} catch {
			setAssets([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchAssets();
	}, []);

	function handleSearchChange(value: string) {
		setSearch(value);
		clearTimeout(searchTimeout.current);
		searchTimeout.current = setTimeout(() => fetchAssets(value), 350);
	}

	async function handleUpload(file: File) {
		setUploading(true);
		setUploadError(null);

		const fd = new FormData();
		fd.append("file", file);
		fd.append("folder", defaultFolder);
		fd.append("altText", "");

		try {
			const res = await fetch("/api/admin/media/upload", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();

			if (!res.ok || !data.success) {
				setUploadError(data.error ?? "Upload failed.");
				return;
			}

			// Auto-select the newly uploaded asset and switch to library
			onSelect(data.asset.secureUrl, data.asset.altText);
			onClose();
		} catch (err) {
			setUploadError(
				err instanceof Error ? err.message : "Unexpected upload error.",
			);
		} finally {
			setUploading(false);
		}
	}

	const selectedAsset = assets.find((a) => a.id === selectedId);

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				onClick={onClose}
				aria-label="Close picker"
				className="fixed inset-0 z-50 bg-black/60"
			/>

			{/* Modal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Media Library"
				className="fixed inset-x-4 bottom-4 top-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:inset-x-8 sm:inset-y-8 lg:inset-x-[10%] lg:inset-y-[5%]"
			>
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-6 py-4">
					<div>
						<h2 className="text-base font-bold text-ink-950">Media Library</h2>
						{total > 0 ? (
							<p className="mt-0.5 text-xs text-stone-400">
								{total} asset{total !== 1 ? "s" : ""} · click to select, then
								confirm
							</p>
						) : null}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-stone-400 hover:text-ink-950"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Tabs */}
				<div className="flex shrink-0 border-b border-stone-200">
					<button
						type="button"
						onClick={() => setActiveTab("library")}
						className={cn(
							"border-b-2 px-6 py-3 text-sm font-medium transition-colors",
							activeTab === "library"
								? "border-red-600 text-red-600"
								: "border-transparent text-stone-500 hover:text-ink-950",
						)}
					>
						Browse Library
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("upload")}
						className={cn(
							"border-b-2 px-6 py-3 text-sm font-medium transition-colors",
							activeTab === "upload"
								? "border-red-600 text-red-600"
								: "border-transparent text-stone-500 hover:text-ink-950",
						)}
					>
						Upload New
					</button>
				</div>

				{/* Body */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{activeTab === "upload" ? (
						<div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
							<label
								className={cn(
									"flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
									uploading
										? "border-stone-200 bg-stone-50 cursor-not-allowed"
										: "border-stone-300 hover:border-red-300 hover:bg-red-50",
								)}
							>
								{uploading ? (
									<Loader2 className="h-8 w-8 animate-spin text-red-600" />
								) : (
									<Upload className="h-8 w-8 text-stone-400" />
								)}
								<div>
									<p className="text-sm font-semibold text-ink-950">
										{uploading
											? "Uploading to Cloudinary..."
											: "Click to select a file"}
									</p>
									<p className="mt-1 text-xs text-stone-400">
										{accept === "image" ? "Images" : "Images and videos"} up to
										50 MB
									</p>
								</div>
								<input
									ref={fileInputRef}
									type="file"
									accept={
										accept === "image"
											? "image/jpeg,image/png,image/webp,image/gif"
											: "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
									}
									disabled={uploading}
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) handleUpload(file);
									}}
									className="sr-only"
								/>
							</label>

							{uploadError ? (
								<p className="text-sm font-medium text-red-500">
									{uploadError}
								</p>
							) : null}
						</div>
					) : (
						<>
							{/* Search */}
							<div className="shrink-0 border-b border-stone-100 px-6 py-3">
								<div className="relative">
									<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
									<input
										type="text"
										value={search}
										onChange={(e) => handleSearchChange(e.target.value)}
										placeholder="Search media..."
										className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
									/>
								</div>
							</div>

							{/* Grid */}
							<div className="flex-1 overflow-y-auto p-5">
								{loading ? (
									<div className="flex h-full items-center justify-center">
										<Loader2 className="h-6 w-6 animate-spin text-stone-400" />
									</div>
								) : assets.length === 0 ? (
									<div className="flex h-full flex-col items-center justify-center gap-3 text-center">
										<Upload className="h-8 w-8 text-stone-300" />
										<p className="text-sm font-medium text-stone-500">
											No media found
										</p>
										<p className="text-xs text-stone-400">
											Upload files using the &quot;Upload New&quot; tab
										</p>
										<button
											type="button"
											onClick={() => setActiveTab("upload")}
											className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
										>
											Upload First File
										</button>
									</div>
								) : (
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
										{assets.map((asset) => {
											const isSelected = asset.id === selectedId;
											return (
												<button
													key={asset.id}
													type="button"
													onClick={() =>
														setSelectedId(isSelected ? null : asset.id)
													}
													className={cn(
														"group relative aspect-square overflow-hidden rounded-xl border-2 bg-stone-100 transition-all",
														isSelected
															? "border-red-600 ring-2 ring-red-600/30"
															: "border-transparent hover:border-stone-300",
													)}
												>
													{asset.resourceType === "video" ? (
														<div className="flex h-full items-center justify-center">
															<Film className="h-8 w-8 text-stone-400" />
														</div>
													) : (
														// eslint-disable-next-line @next/next/no-img-element
														<img
															src={asset.secureUrl}
															alt={asset.altText}
															className="h-full w-full object-cover"
															loading="lazy"
														/>
													)}

													{/* Selection overlay */}
													{isSelected ? (
														<div className="absolute inset-0 flex items-center justify-center bg-red-600/20">
															<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
																<svg
																	viewBox="0 0 16 16"
																	fill="currentColor"
																	className="h-4 w-4"
																>
																	<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
																</svg>
															</div>
														</div>
													) : null}

													{/* Info on hover */}
													<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
														<p className="truncate text-[10px] text-white">
															{asset.altText}
														</p>
														<p className="text-[9px] text-white/60">
															{asset.format} · {asset.sizeLabel}
														</p>
													</div>
												</button>
											);
										})}
									</div>
								)}
							</div>
						</>
					)}
				</div>

				{/* Footer — only visible when a file is selected in library tab */}
				{activeTab === "library" && selectedAsset ? (
					<div className="flex shrink-0 items-center justify-between gap-4 border-t border-stone-200 px-6 py-4">
						<div className="flex items-center gap-3 min-w-0">
							{selectedAsset.resourceType === "video" ? (
								<Film className="h-10 w-10 shrink-0 text-stone-400" />
							) : (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={selectedAsset.secureUrl}
									alt={selectedAsset.altText}
									className="h-10 w-10 shrink-0 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-ink-950">
									{selectedAsset.altText}
								</p>
								<p className="text-xs text-stone-400">
									{selectedAsset.format} · {selectedAsset.sizeLabel} ·{" "}
									{selectedAsset.folder}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={() => setSelectedId(null)}
								className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									onSelect(selectedAsset.secureUrl, selectedAsset.altText);
									onClose();
								}}
								className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
							>
								Use This Image
							</button>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}
