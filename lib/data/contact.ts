import { featuredProjects } from "@/lib/data/projects";
import type { EnquiryTypeOption } from "@/lib/types/contact";

export interface ProjectOfInterestOption {
	value: string;
	label: string;
}

export const enquiryTypeOptions: EnquiryTypeOption[] = [
	{ value: "buyer", label: "Buyer" },
	{ value: "investor", label: "Investor" },
	{ value: "partner", label: "Partner" },
	{ value: "diaspora-buyer", label: "Diaspora Buyer" },
	{ value: "realtor", label: "Realtor" },
	{ value: "general", label: "General Enquiry" },
];

export const projectOfInterestOptions: ProjectOfInterestOption[] = [
	{ value: "general", label: "General Enquiry" },
	...featuredProjects.map((project) => ({
		value: project.slug,
		label: project.name,
	})),
];

export function isKnownProjectSlug(value: string): boolean {
	return projectOfInterestOptions.some((option) => option.value === value);
}
