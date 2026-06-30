
export type ProjectStatus = "completed" | "under-development" 
export type ProjectCategory = "residential" | "hospitality";
export type ProjectFilterId = "all" | ProjectStatus | ProjectCategory;

export interface ProjectTag {
	id: string;
	label: string;
}

export interface ProjectCta {
	label: string;
	href: string;
}

export interface ProjectImage {
	src: string;
	alt: string;
}

export interface Project {
	id: string;
	slug: string;
	name: string;
	location: string;
	status: ProjectStatus;
	statusLabel: string;
	category: ProjectCategory[];
	developerLabel: string;
	typeLabel: string;
	description: string;
	tags: ProjectTag[];
	primaryCta: ProjectCta;
	secondaryCta: ProjectCta;
	coverImage: ProjectImage;
}