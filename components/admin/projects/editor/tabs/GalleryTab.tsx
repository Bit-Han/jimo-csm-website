// //@components/admin/projects/editor/tabs/GalleryTab.tsx
// import { ImageIcon, Plus, Trash2, Upload } from "lucide-react";
// import {
// 	EditorField,
// 	inputCls,
// 	selectCls,
// } from "@/components/admin/ui/EditorField";
// import type {
// 	EditorMediaItem,
// 	ProjectEditorState,
// } from "@/lib/types/admin/project-editor";

// interface GalleryTabProps {
// 	state: ProjectEditorState;
// 	onChange: <K extends keyof ProjectEditorState>(
// 		key: K,
// 		value: ProjectEditorState[K],
// 	) => void;
// }

// function makeMediaItem(): EditorMediaItem {
// 	return {
// 		id: `media-${Date.now()}`,
// 		type: "image",
// 		src: "",
// 		alt: "",
// 	};
// }

// export function GalleryTab({ state, onChange }: GalleryTabProps) {
// 	function addItem() {
// 		onChange("media", [...state.media, makeMediaItem()]);
// 	}

// 	function updateItem(id: string, field: keyof EditorMediaItem, value: string) {
// 		onChange(
// 			"media",
// 			state.media.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
// 		);
// 	}

// 	function removeItem(id: string) {
// 		onChange(
// 			"media",
// 			state.media.filter((m) => m.id !== id),
// 		);
// 	}

// 	return (
// 		<div className="space-y-5">
// 			<div className="flex items-center justify-between">
// 				<div>
// 					<p className="text-sm font-semibold text-ink-950">Gallery Media</p>
// 					<p className="text-xs text-stone-500">
// 						Images and videos shown in the carousel on the project detail page.
// 					</p>
// 				</div>
// 				<div className="flex gap-2">
// 					<button
// 						type="button"
// 						className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
// 					>
// 						<Upload className="h-3.5 w-3.5" />
// 						Upload
// 						<span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-700">
// 							TODO
// 						</span>
// 					</button>
// 					<button
// 						type="button"
// 						onClick={addItem}
// 						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
// 					>
// 						<Plus className="h-3.5 w-3.5" />
// 						Add URL
// 					</button>
// 				</div>
// 			</div>

// 			{state.media.length === 0 ? (
// 				<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
// 					<ImageIcon className="h-8 w-8 text-stone-300" />
// 					<p className="text-sm text-stone-500">No gallery media yet.</p>
// 				</div>
// 			) : (
// 				<div className="space-y-4">
// 					{state.media.map((item, index) => (
// 						<div
// 							key={item.id}
// 							className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
// 						>
// 							<div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2.5">
// 								<span className="text-xs font-semibold text-stone-500">
// 									Item {index + 1}
// 								</span>
// 								<button
// 									type="button"
// 									onClick={() => removeItem(item.id)}
// 									className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
// 								>
// 									<Trash2 className="h-3.5 w-3.5" />
// 									Remove
// 								</button>
// 							</div>
// 							<div className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_1fr]">
// 								<EditorField label="Type">
// 									<select
// 										value={item.type}
// 										onChange={(e) =>
// 											updateItem(item.id, "type", e.target.value)
// 										}
// 										className={selectCls}
// 									>
// 										<option value="image">Image</option>
// 										<option value="video">Video</option>
// 									</select>
// 								</EditorField>
// 								<EditorField label="URL">
// 									<input
// 										type="url"
// 										value={item.src}
// 										onChange={(e) => updateItem(item.id, "src", e.target.value)}
// 										placeholder="https://..."
// 										className={inputCls}
// 									/>
// 								</EditorField>
// 								<EditorField label="Alt Text">
// 									<input
// 										type="text"
// 										value={item.alt}
// 										onChange={(e) => updateItem(item.id, "alt", e.target.value)}
// 										placeholder="Describe the image"
// 										className={inputCls}
// 									/>
// 								</EditorField>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	);
// }

"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
	AlertTriangle,
	FileVideo,
	ImageIcon,
	Loader2,
	Trash2,
	UploadCloud,
} from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import {
	requestProjectMediaUploadSignature,
	deleteProjectMediaAsset,
} from "@/lib/actions/admin/project-media";
import { uploadMediaToCloudinary } from "@/lib/utils/cloudinary-client-upload";
import type {
	EditorMediaItem,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // chunked upload kicks in automatically past 90MB

const IMAGE_FOLDER = "jimo-property/project-renders";
const VIDEO_FOLDER = "jimo-property/videos";

interface UploadingItem {
	localId: string;
	file: File;
	progress: number;
	error: string | null;
}

interface GalleryTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

function isVideoFile(file: File): boolean {
	return file.type.startsWith("video/");
}

export function GalleryTab({ state, onChange }: GalleryTabProps) {
	const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<EditorMediaItem | null>(
		null,
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const mediaRef = useRef(state.media);

	useEffect(() => {
		mediaRef.current = state.media;
	}, [state.media]);

	const handleFiles = useCallback(
		(fileList: FileList | File[]) => {
			for (const file of Array.from(fileList)) {
				const isVideo = isVideoFile(file);
				const isImage = file.type.startsWith("image/");
				if (!isVideo && !isImage) continue; // skip a stray non-media file dropped by mistake

				const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
				const localId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

				if (file.size > maxSize) {
					setUploadingItems((prev) => [
						...prev,
						{
							localId,
							file,
							progress: 0,
							error: `Too large — max ${Math.round(maxSize / 1024 / 1024)} MB.`,
						},
					]);
					continue;
				}

				setUploadingItems((prev) => [
					...prev,
					{ localId, file, progress: 0, error: null },
				]);

				(async () => {
					try {
						const resourceType: "image" | "video" = isVideo ? "video" : "image";
						const folder = isVideo ? VIDEO_FOLDER : IMAGE_FOLDER;
						const signed = await requestProjectMediaUploadSignature(
							folder,
							resourceType,
						);

						const uploaded = await uploadMediaToCloudinary(
							signed,
							file,
							(pct) =>
								setUploadingItems((prev) =>
									prev.map((u) =>
										u.localId === localId ? { ...u, progress: pct } : u,
									),
								),
							undefined,
							resourceType,
						);

						const newItem: EditorMediaItem = {
							id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
							type: resourceType,
							src: uploaded.secureUrl,
							alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
							cloudinaryPublicId: uploaded.publicId,
						};

						onChange("media", [...mediaRef.current, newItem]);
						setUploadingItems((prev) =>
							prev.filter((u) => u.localId !== localId),
						);
					} catch (err) {
						const message =
							err instanceof Error ? err.message : "Upload failed.";
						setUploadingItems((prev) =>
							prev.map((u) =>
								u.localId === localId ? { ...u, error: message } : u,
							),
						);
					}
				})();
			}
		},
		[onChange],
	);

	function updateAlt(id: string, alt: string) {
		onChange(
			"media",
			state.media.map((m) => (m.id === id ? { ...m, alt } : m)),
		);
	}

	function handleConfirmDelete() {
		if (!pendingDelete) return;
		const item = pendingDelete;
		setPendingDelete(null);
		setDeletingId(item.id);

		(async () => {
			if (item.cloudinaryPublicId) {
				await deleteProjectMediaAsset(item.cloudinaryPublicId, item.type);
			}
			onChange(
				"media",
				state.media.filter((m) => m.id !== item.id),
			);
			setDeletingId(null);
		})();
	}

	return (
		<div className="space-y-5">
			<div>
				<p className="text-sm font-semibold text-ink-950">Gallery Media</p>
				<p className="text-xs text-stone-500">
					Images and videos shown in the carousel on the project detail page.
					Drag files in, or click to browse.
				</p>
			</div>

			<div
				onDragOver={(e) => {
					e.preventDefault();
					setDragActive(true);
				}}
				onDragLeave={() => setDragActive(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragActive(false);
					if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
				}}
				onClick={() => fileInputRef.current?.click()}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
				className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
					dragActive
						? "border-red-400 bg-red-50"
						: "border-stone-300 bg-stone-50 hover:border-red-300 hover:bg-red-50"
				}`}
			>
				<UploadCloud className="h-8 w-8 text-stone-400" />
				<p className="text-sm font-medium text-stone-600">
					Drag images or videos here, or click to browse
				</p>
				<p className="text-xs text-stone-400">
					Images up to {MAX_IMAGE_SIZE / 1024 / 1024} MB · Videos up to{" "}
					{MAX_VIDEO_SIZE / 1024 / 1024} MB — large videos upload in chunks
					automatically
				</p>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*,video/*"
					multiple
					className="sr-only"
					onChange={(e) => {
						if (e.target.files?.length) handleFiles(e.target.files);
						e.target.value = "";
					}}
				/>
			</div>

			{uploadingItems.length > 0 ? (
				<div className="space-y-2">
					{uploadingItems.map((u) => (
						<div
							key={u.localId}
							className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3"
						>
							{isVideoFile(u.file) ? (
								<FileVideo className="h-5 w-5 shrink-0 text-stone-400" />
							) : (
								<ImageIcon className="h-5 w-5 shrink-0 text-stone-400" />
							)}
							<div className="min-w-0 flex-1">
								<p className="truncate text-xs font-medium text-ink-950">
									{u.file.name}
								</p>
								{u.error ? (
									<p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-red-500">
										<AlertTriangle className="h-3 w-3" />
										{u.error}
									</p>
								) : (
									<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
										<div
											className="h-full rounded-full bg-red-600 transition-all duration-200"
											style={{ width: `${u.progress}%` }}
										/>
									</div>
								)}
							</div>
							{!u.error ? (
								<span className="shrink-0 text-xs text-stone-400">
									{u.progress}%
								</span>
							) : null}
							{u.error ? (
								<button
									type="button"
									onClick={() =>
										setUploadingItems((prev) =>
											prev.filter((x) => x.localId !== u.localId),
										)
									}
									className="shrink-0 text-xs font-medium text-stone-400 hover:text-red-500"
								>
									Dismiss
								</button>
							) : null}
						</div>
					))}
				</div>
			) : null}

			{state.media.length === 0 && uploadingItems.length === 0 ? (
				<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
					<ImageIcon className="h-8 w-8 text-stone-300" />
					<p className="text-sm text-stone-500">No gallery media yet.</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{state.media.map((item) => (
						<div
							key={item.id}
							className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
						>
							<div className="relative aspect-video bg-stone-100">
								{item.type === "video" ? (
									<video
										src={item.src}
										className="h-full w-full object-cover"
										muted
									/>
								) : (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={item.src}
										alt={item.alt}
										className="h-full w-full object-cover"
									/>
								)}
								<button
									type="button"
									onClick={() => setPendingDelete(item)}
									disabled={deletingId === item.id}
									aria-label="Delete media"
									className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white hover:bg-red-700 disabled:opacity-50"
								>
									{deletingId === item.id ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
								</button>
							</div>
							<div className="p-3">
								<input
									type="text"
									value={item.alt}
									onChange={(e) => updateAlt(item.id, e.target.value)}
									placeholder="Describe this image or video"
									className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
								/>
							</div>
						</div>
					))}
				</div>
			)}

			<ConfirmDialog
				open={pendingDelete !== null}
				title="Delete this media item?"
				description="This permanently removes the file from Cloudinary right away. The gallery change itself is saved the next time you click Save Draft or Publish."
				confirmLabel="Delete permanently"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onCancel={() => setPendingDelete(null)}
			/>
		</div>
	);
}