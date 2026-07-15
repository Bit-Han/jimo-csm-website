// "use client";

// import { useState } from "react";
// import { MediaFolderSidebar } from "./MediaFolderSidebar";
// import { MediaGrid } from "./MediaGrid";
// import { getMediaAssets } from "@/lib/data/admin/media";
// import type { MediaFolder, MediaFolderItem } from "@/lib/types/admin/media";

// interface MediaLibraryShellProps {
// 	folders: MediaFolderItem[];
// 	storageUsedGb: number;
// 	storageTotalGb: number;
// 	storageUsedPercent: number;
// 	totalCount: number;
// }

// export function MediaLibraryShell({
// 	folders,
// 	storageUsedGb,
// 	storageTotalGb,
// 	storageUsedPercent,
// 	totalCount,
// }: MediaLibraryShellProps) {
// 	const [activeFolder, setActiveFolder] = useState<MediaFolder>("all");

// 	// Derive assets on folder change — pure function, no useEffect needed
// 	const assets = getMediaAssets(activeFolder);

// 	return (
// 		<div className="grid h-[calc(100vh-160px)] gap-5 lg:grid-cols-[240px_1fr]">
// 			<MediaFolderSidebar
// 				folders={folders}
// 				activeFolder={activeFolder}
// 				onSelectFolder={setActiveFolder}
// 				storageUsedGb={storageUsedGb}
// 				storageTotalGb={storageTotalGb}
// 				storageUsedPercent={storageUsedPercent}
// 			/>
// 			<div className="overflow-y-auto">
// 				<MediaGrid assets={assets} totalCount={totalCount} />
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useState, useEffect } from "react";
import { MediaFolderSidebar } from "./MediaFolderSidebar";
import { MediaGrid } from "./MediaGrid";
import type {
	MediaAsset,
	MediaFolder,
	MediaFolderItem,
} from "@/lib/types/admin/media";

interface MediaLibraryShellProps {
	folders: MediaFolderItem[];
	initialAssets: MediaAsset[];
	storageUsedGb: number;
	storageTotalGb: number;
	storageUsedPercent: number;
	totalCount: number;
}

export function MediaLibraryShell({
	folders,
	initialAssets,
	storageUsedGb,
	storageTotalGb,
	storageUsedPercent,
	totalCount,
}: MediaLibraryShellProps) {
	const [activeFolder, setActiveFolder] = useState<MediaFolder>("all");
	const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
	const [loading, setLoading] = useState(false);

	async function loadFolder(folder: MediaFolder) {
		setActiveFolder(folder);
		setLoading(true);
		try {
			const params = new URLSearchParams({ folder, limit: "100" });
			const res = await fetch(`/api/admin/media/list?${params.toString()}`);
			if (!res.ok) return;
			const data = await res.json();
			setAssets(
				(data.assets ?? []).map(
					(a: {
						id: string;
						secureUrl: string;
						publicId: string;
						resourceType: string;
						format: string;
						altText: string;
						folder: string;
						sizeLabel: string;
					}) => ({
						id: a.id,
						cloudinaryPublicId: a.publicId,
						url: a.secureUrl,
						name: a.altText,
						projectName: null,
						tagLabel: a.folder,
						tagColorClass: "bg-stone-100 text-stone-600",
						resourceType: a.resourceType,
						format: a.format,
						sizeLabel: a.sizeLabel,
					}),
				),
			);
		} finally {
			setLoading(false);
		}
	}

	function handleNewUpload(newAsset: MediaAsset) {
		setAssets((prev) => [newAsset, ...prev]);
	}

	return (
		<div className="grid h-[calc(100vh-160px)] gap-5 lg:grid-cols-[240px_1fr]">
			<MediaFolderSidebar
				folders={folders}
				activeFolder={activeFolder}
				onSelectFolder={loadFolder}
				storageUsedGb={storageUsedGb}
				storageTotalGb={storageTotalGb}
				storageUsedPercent={storageUsedPercent}
			/>
			<div className="overflow-y-auto">
				<MediaGrid
					assets={assets}
					totalCount={totalCount}
					loading={loading}
					onUploadComplete={handleNewUpload}
				/>
			</div>
		</div>
	);
}