export interface ProjectBrochure {
	projectSlug: string;
	title: string;
	fileUrl: string;
}

export const projectBrochures: Record<string, ProjectBrochure> = {
	"vatican-court": {
		projectSlug: "vatican-court",
		title: "Vatican Court Brochure",
		fileUrl: "/brochures/vatican-court.pdf",
	},
	"jimo-residences-yaba": {
		projectSlug: "jimo-residences-yaba",
		title: "Jimo Residences Yaba Brochure",
		fileUrl: "/brochures/jimo-residences-yaba.pdf",
	},
	"yaba-hospitality-hub": {
		projectSlug: "yaba-hospitality-hub",
		title: "Yaba Hospitality Hub Brochure",
		fileUrl: "/brochures/yaba-hospitality-hub.pdf",
	},
};

export function getProjectBrochure(slug: string): ProjectBrochure | undefined {
	return projectBrochures[slug];
}
