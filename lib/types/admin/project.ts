//@/lib/types/admin/project.ts
export type AdminDisplayStatus =
	| "completed"
	| "active"
	| "under-development"

export type AdminProjectPublishStatus = "draft" | "published";

export interface AdminProjectListRow {
	id: string;
	slug: string;
	name: string;
	location: string;
	adminStatus: AdminDisplayStatus;
	startingPrice: string;
	leads: number;
	leadChangePercent: number;
	lastUpdatedDate: string;
	lastUpdatedBy: string;
	publishStatus: AdminProjectPublishStatus;
}

export interface AdminProjectSummaryStats {
	missingBrochure: number;
	missingBrochureNote: string;
	missingSeo: number;
	missingSeoNote: string;
	draftProjects: number;
	draftProjectsNote: string;
}

export interface ProjectAdminFilterState {
	search: string;
	status: string;
	location: string;
}
