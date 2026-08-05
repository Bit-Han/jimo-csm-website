// import { featuredProjects } from "@/lib/data/projects";
// import type { EnquiryTypeOption } from "@/lib/types/contact";

// export interface ProjectOfInterestOption {
// 	value: string;
// 	label: string;
// }

// export const enquiryTypeOptions: EnquiryTypeOption[] = [
// 	{ value: "buyer", label: "Buyer" },
// 	{ value: "investor", label: "Investor" },
// 	{ value: "partner", label: "Partner" },
// 	{ value: "diaspora-buyer", label: "Diaspora Buyer" },
// 	{ value: "realtor", label: "Realtor" },
// 	{ value: "general", label: "General Enquiry" },
// ];

// export const projectOfInterestOptions: ProjectOfInterestOption[] = [
// 	{ value: "general", label: "General Enquiry" },
// 	...featuredProjects.map((project) => ({
// 		value: project.slug,
// 		label: project.name,
// 	})),
// ];

// export function isKnownProjectSlug(value: string): boolean {
// 	return projectOfInterestOptions.some((option) => option.value === value);
// }


// @/lib/data/contact.ts (or wherever your contact types/helpers live)
import type {
	EnquiryTypeOption,
	ProjectOfInterestOption,
} from "@/lib/types/contact";
import type { Project } from "@/lib/types/project"; // Adjust based on your types path


export const enquiryTypeOptions: EnquiryTypeOption[] = [
	{ value: "general", label: "General Enquiry" }, // Put general first here too if desired
	{ value: "buyer", label: "Buyer" },
	{ value: "investor", label: "Investor" },
	{ value: "partner", label: "Partner" },
	{ value: "diaspora-buyer", label: "Diaspora Buyer" },
	{ value: "realtor", label: "Realtor" },
];

/** Dynamically builds the options layout mapping database elements */
export function buildProjectOptions(dbProjects: Project[]): ProjectOfInterestOption[] {
	return [
		{ value: "general", label: "General Enquiry" }, // General enquiry is hard-pinned first
		...dbProjects.map((project) => ({
			value: project.slug,
			label: project.name,
		})),
	];
}
