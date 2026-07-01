
import type { Project } from "@/lib/types/project";
import type { ProjectAmenityIcon } from "@/lib/types/amenity";

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
	icon: ProjectAmenityIcon;
}

export type ProjectProgressStage =
	| "design"
	| "approvals"
	| "construction"
	| "finishing"
	| "handover";


export type ProjectMediaType = "image" | "video";

export interface ProjectMediaItem {
	id: string;
	type: ProjectMediaType;
	src: string;
	/** Only used for video items — shown while the video loads. */
	poster?: string;
	alt: string;
}


export interface ProjectDetail extends Project {
	categoryLabel: string;
	facts: ProjectFact[];
	overview: string[];
	units: ProjectUnit[];
	investmentHighlights: ProjectChecklistItem[];
	paymentPlan: ProjectChecklistItem[];
	amenities: ProjectAmenity[];
	media: ProjectMediaItem[];
	contactCtaTitle: string;
	contactCtaDescription: string;
}