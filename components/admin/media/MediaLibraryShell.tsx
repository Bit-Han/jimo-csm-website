"use client";

import { useState } from "react";
import { MediaFolderSidebar } from "./MediaFolderSidebar";
import { MediaGrid } from "./MediaGrid";
import { getMediaAssets } from "@/lib/data/admin/media";
import type { MediaFolder, MediaFolderItem } from "@/lib/types/admin/media";

interface MediaLibraryShellProps {
	folders: MediaFolderItem[];
	storageUsedGb: number;
	storageTotalGb: number;
	storageUsedPercent: number;
	totalCount: number;
}

export function MediaLibraryShell({
	folders,
	storageUsedGb,
	storageTotalGb,
	storageUsedPercent,
	totalCount,
}: MediaLibraryShellProps) {
	const [activeFolder, setActiveFolder] = useState<MediaFolder>("all");

	// Derive assets on folder change — pure function, no useEffect needed
	const assets = getMediaAssets(activeFolder);

	return (
		<div className="grid h-[calc(100vh-160px)] gap-5 lg:grid-cols-[240px_1fr]">
			<MediaFolderSidebar
				folders={folders}
				activeFolder={activeFolder}
				onSelectFolder={setActiveFolder}
				storageUsedGb={storageUsedGb}
				storageTotalGb={storageTotalGb}
				storageUsedPercent={storageUsedPercent}
			/>
			<div className="overflow-y-auto">
				<MediaGrid assets={assets} totalCount={totalCount} />
			</div>
		</div>
	);
}
