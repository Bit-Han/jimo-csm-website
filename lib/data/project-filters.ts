import type { ProjectFilterId } from "@/lib/types/project";

export interface ProjectFilterOption {
	id: ProjectFilterId;
	label: string;
}

export const projectFilters: ProjectFilterOption[] = [
	{ id: "all", label: "All" },
	{ id: "completed", label: "Completed" },
	{ id: "pre-launch", label: "Pre-Launch" },
	{ id: "concept", label: "Concept" },
	{ id: "residential", label: "Residential" },
	{ id: "hospitality", label: "Hospitality" },
];
