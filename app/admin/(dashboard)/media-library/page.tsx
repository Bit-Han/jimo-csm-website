// import type { Metadata } from "next";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { MediaLibraryShell } from "@/components/admin/media/MediaLibraryShell";
// import { UploadMediaButton } from "@/components/admin/media/UploadMediaButton";
// import { ManageFoldersButton } from "@/components/admin/media/ManagerFolderButton";
// import {
// 	getStorageStats,
// 	mockMediaAssets,
// 	mockMediaFolders,
// } from "@/lib/data/admin/media";

// export const metadata: Metadata = {
// 	title: "Media Library | Jimo Command Centre",
// };

// export default function AdminMediaLibraryPage() {
// 	const storage = getStorageStats();
// 	const totalCount = mockMediaAssets.length;

// 	return (
// 		<div className="space-y-6">
// 			<AdminPageHeader
// 				title="Media Library"
// 				description="Organize and manage project renders, construction photos, videos, brochures, logos, and documents."
// 				action={
// 					<div className="flex items-center gap-2">
// 						<ManageFoldersButton />
// 						<UploadMediaButton />
// 					</div>
// 				}
// 			/>
// 			<MediaLibraryShell
// 				folders={mockMediaFolders}
// 				storageUsedGb={storage.usedGb}
// 				storageTotalGb={storage.totalGb}
// 				storageUsedPercent={storage.usedPercent}
// 				totalCount={totalCount}
// 			/>
// 		</div>
// 	);
// }

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibraryShell } from "@/components/admin/media/MediaLibraryShell";
import { UploadMediaButton } from "@/components/admin/media/UploadMediaButton";
import { ManageFoldersButton } from "@/components/admin/media/ManagerFolderButton";
import {
	getAdminMediaAssets,
	getMediaFolderCounts,
} from "@/lib/db/queries/media";
// import { mockMediaFolders } from "@/lib/data/admin/media";
import type { MediaFolderItem } from "@/lib/types/admin/media";

export const metadata: Metadata = {
	title: "Media Library | Jimo Command Centre",
};

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
	const [assets, folderCounts] = await Promise.all([
		getAdminMediaAssets("all"),
		getMediaFolderCounts(),
	]);

	// Merge real counts with the static folder list
	const countByFolder = Object.fromEntries(
		folderCounts.map(({ folder, count }) => [folder, count]),
	);

	const totalCount = assets.length;

	const realFolders: MediaFolderItem[] = [
		{ id: "all", label: "All Media", count: totalCount },
		{
			id: "project-renders",
			label: "Project Renders",
			count: countByFolder["Project Renders"] ?? 0,
		},
		{
			id: "interior-renders",
			label: "Interior Renders",
			count: countByFolder["Interior Renders"] ?? 0,
		},
		{
			id: "construction-updates",
			label: "Construction Updates",
			count: countByFolder["Construction Updates"] ?? 0,
		},
		{
			id: "brochures",
			label: "Brochures",
			count: countByFolder["Brochures"] ?? 0,
		},
		{
			id: "team-photos",
			label: "Team Photos",
			count: countByFolder["Team Photos"] ?? 0,
		},
		{
			id: "logos-icons",
			label: "Logos & Icons",
			count: countByFolder["Logos & Icons"] ?? 0,
		},
		{
			id: "documents",
			label: "Documents",
			count: countByFolder["Documents"] ?? 0,
		},
		{ id: "videos", label: "Videos", count: countByFolder["Videos"] ?? 0 },
		{
			id: "site-images",
			label: "Site Images",
			count: countByFolder["Site Images"] ?? 0,
		},
	];

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Media Library"
				description="Organize and manage project renders, construction photos, videos, brochures, logos, and documents."
				action={
					<div className="flex items-center gap-2">
						<ManageFoldersButton />
						<UploadMediaButton />
					</div>
				}
			/>
			<MediaLibraryShell
				folders={realFolders}
				initialAssets={assets}
				storageUsedGb={0}
				storageTotalGb={200}
				storageUsedPercent={0}
				totalCount={totalCount}
			/>
		</div>
	);
}