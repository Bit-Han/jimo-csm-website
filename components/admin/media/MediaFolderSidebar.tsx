import { Folder, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { MediaFolder, MediaFolderItem } from "@/lib/types/admin/media";

interface MediaFolderSidebarProps {
	folders: MediaFolderItem[];
	activeFolder: MediaFolder;
	onSelectFolder: (folder: MediaFolder) => void;
	storageUsedGb: number;
	storageTotalGb: number;
	storageUsedPercent: number;
}

export function MediaFolderSidebar({
	folders,
	activeFolder,
	onSelectFolder,
	storageUsedGb,
	storageTotalGb,
	storageUsedPercent,
}: MediaFolderSidebarProps) {
	return (
		<div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-4">
			<p className="px-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
				Folders
			</p>

			<nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto">
				{folders.map((folder) => (
					<button
						key={folder.id}
						type="button"
						onClick={() => onSelectFolder(folder.id)}
						className={cn(
							"flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
							activeFolder === folder.id
								? "bg-red-50 font-semibold text-red-700"
								: "text-stone-600 hover:bg-stone-50 hover:text-ink-950",
						)}
					>
						<span className="flex items-center gap-2.5">
							<Folder className="h-4 w-4 shrink-0" />
							{folder.label}
						</span>
						<span className="text-xs text-stone-400">{folder.count}</span>
					</button>
				))}
			</nav>

			<div className="mt-4 border-t border-stone-100 pt-4">
				<div className="flex items-center gap-2 px-2">
					<HardDrive className="h-4 w-4 shrink-0 text-stone-400" />
					<p className="text-xs font-medium text-stone-500">Storage Used</p>
				</div>
				<p className="mt-1.5 px-2 text-sm font-bold text-ink-950">
					{storageUsedGb}GB / {storageTotalGb}GB
				</p>
				<div className="mt-2 px-2">
					<div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
						<div
							className="h-full rounded-full bg-red-600 transition-all"
							style={{ width: `${storageUsedPercent}%` }}
						/>
					</div>
				</div>
				<button
					type="button"
					className="mt-3 w-full rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-50"
				>
					Manage Storage
				</button>
			</div>
		</div>
	);
}
