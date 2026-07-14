export type MediaResourceType = "image" | "video" | "raw";

export type MediaFolder =
	| "all"
	| "project-renders"
	| "interior-renders"
	| "construction-updates"
	| "brochures"
	| "team-photos"
	| "logos-icons"
	| "documents"
	| "videos"
	| "site-images";


export interface MediaFolderItem {
	id: MediaFolder;
	label: string;
	count: number;
}

export interface MediaAsset {
	id: string;
	cloudinaryPublicId: string;
	url: string;
	name: string;
	projectName: string | null;
	tagLabel: string;
	tagColorClass: string;
	resourceType: MediaResourceType;
	format: string;
	sizeLabel: string;
}

export type MediaViewMode = "grid" | "list";
export type MediaSortMode = "newest" | "oldest" | "name" | "size";

export interface MediaFilterState {
	folder: MediaFolder;
	fileType: string;
	linkedProject: string;
	search: string;
	sort: MediaSortMode;
}
