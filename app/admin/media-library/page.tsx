import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibraryShell } from "@/components/admin/media/MediaLibraryShell";
import { UploadMediaButton } from "@/components/admin/media/UploadMediaButton";
import { ManageFoldersButton } from "@/components/admin/media/ManagerFolderButton";
import {
	getStorageStats,
	mockMediaAssets,
	mockMediaFolders,
} from "@/lib/data/admin/media";

export const metadata: Metadata = {
	title: "Media Library | Jimo Command Centre",
};

export default function AdminMediaLibraryPage() {
	const storage = getStorageStats();
	const totalCount = mockMediaAssets.length;

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
				folders={mockMediaFolders}
				storageUsedGb={storage.usedGb}
				storageTotalGb={storage.totalGb}
				storageUsedPercent={storage.usedPercent}
				totalCount={totalCount}
			/>
		</div>
	);
}