import type { ProjectFilterId } from "@/lib/types/project";

export interface ProjectFilterOption {
	id: ProjectFilterId;
	label: string;
}

export const projectFilters: ProjectFilterOption[] = [
	{ id: "all", label: "All" },
	{ id: "completed", label: "Completed" },
	{ id: "under-development", label: "Under-Development" },
	{ id: "residential", label: "Residential" },
	{ id: "hospitality", label: "Hospitality" },
];
