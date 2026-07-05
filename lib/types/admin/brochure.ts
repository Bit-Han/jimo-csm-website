export type BrochureStatus = "active" | "draft";

export interface AdminBrochureListRow {
	id: string;
	title: string;
	fileType: "pdf";
	relatedProject: string;
	relatedProjectSlug: string;
	status: BrochureStatus;
	leadsCount: number | null;
	statusNote: string;
	fileUrl: string;
	cloudinaryPublicId: string | null;
	uploadedAt: string;
}

export interface BrochureFilterState {
	search: string;
	status: string;
	sort: "newest" | "oldest";
}

export interface UploadBrochureFormState {
	title: string;
	projectSlug: string;
	fileSelected: boolean;
	fileName: string;
}
