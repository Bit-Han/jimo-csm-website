// import type { Project } from "@/lib/types/project";

// export interface ProjectFact {
// 	label: string;
// 	value: string;
// }

// export type ProjectUnitIcon = "home" | "building";

// export interface ProjectUnit {
// 	id: string;
// 	name: string;
// 	icon: ProjectUnitIcon;
// 	priceLabel: string;
// 	availabilityLabel: string;
// }

// export interface ProjectChecklistItem {
// 	id: string;
// 	label: string;
// }

// export interface ProjectAmenity {
// 	id: string;
// 	label: string;
// }

// export type ProjectProgressStage =
// 	| "design"
// 	| "approvals"
// 	| "construction"
// 	| "finishing"
// 	| "handover";

// export interface ProjectProgressStep {
// 	stage: ProjectProgressStage;
// 	label: string;
// 	isComplete: boolean;
// }

// export interface ProjectGalleryImage {
// 	id: string;
// 	src: string;
// 	alt: string;
// }

// export interface ProjectFaqItem {
// 	id: string;
// 	question: string;
// 	answer: string;
// }

// export interface ProjectDetail extends Project {
// 	categoryLabel: string;
// 	facts: ProjectFact[];
// 	overview: string[];
// 	units: ProjectUnit[];
// 	investmentHighlights: ProjectChecklistItem[];
// 	paymentPlan: ProjectChecklistItem[];
// 	amenities: ProjectAmenity[];
// 	progress: ProjectProgressStep[];
// 	gallery: ProjectGalleryImage[];
// 	faq: ProjectFaqItem[];
// 	contactCtaTitle: string;
// 	contactCtaDescription: string;
// }

import type { Project } from "@/lib/types/project";

export interface ProjectFact {
	label: string;
	value: string;
}

export type ProjectUnitIcon = "home" | "building";

export interface ProjectUnit {
	id: string;
	name: string;
	icon: ProjectUnitIcon;
	priceLabel: string;
	availabilityLabel: string;
}

export interface ProjectChecklistItem {
	id: string;
	label: string;
}

export interface ProjectAmenity {
	id: string;
	label: string;
}

export type ProjectProgressStage =
	| "design"
	| "approvals"
	| "construction"
	| "finishing"
	| "handover";

export interface ProjectProgressStep {
	stage: ProjectProgressStage;
	label: string;
	isComplete: boolean;
}

export type ProjectMediaType = "image" | "video";

export interface ProjectMediaItem {
	id: string;
	type: ProjectMediaType;
	src: string;
	/** Only used for video items — shown while the video loads. */
	poster?: string;
	alt: string;
}

export interface ProjectFaqItem {
	id: string;
	question: string;
	answer: string;
}

export interface ProjectDetail extends Project {
	categoryLabel: string;
	facts: ProjectFact[];
	overview: string[];
	units: ProjectUnit[];
	investmentHighlights: ProjectChecklistItem[];
	paymentPlan: ProjectChecklistItem[];
	amenities: ProjectAmenity[];
	progress: ProjectProgressStep[];
	media: ProjectMediaItem[];
	/** No longer rendered on the project page itself — kept in case you want it elsewhere later (e.g. a dedicated FAQ page). */
	faq: ProjectFaqItem[];
	contactCtaTitle: string;
	contactCtaDescription: string;
}