//@lib/data/admin/projects.ts

import { getAdminProjectListRows } from "@/lib/db/queries/projects";
import type {
	AdminProjectListRow,
	AdminProjectSummaryStats,
} from "@/lib/types/admin/project";

export async function getAdminProjectRows(): Promise<AdminProjectListRow[]> {
	return getAdminProjectListRows();
}

export async function getAdminProjectSummaryStats(): Promise<AdminProjectSummaryStats> {
	// TODO: compute from real DB aggregates
	// missingBrochure → projects with publishStatus="published" and no active brochure
	// missingSeo      → seo_configs where metaTitle IS NULL and pageType = "project"
	// draftProjects   → projects where publishStatus = "draft"
	return {
		missingBrochure: 1,
		missingBrochureNote: "Visible projects without a brochure",
		missingSeo: 2,
		missingSeoNote: "Missing meta titles / descriptions",
		draftProjects: 1,
		draftProjectsNote: "Not visible on the website",
	};
}