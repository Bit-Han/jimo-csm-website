// import { featuredProjects } from "@/lib/data/projects";
// import { getProjectDetail } from "@/lib/data/project-details";
// import type {
// 	AdminDisplayStatus,
// 	AdminProjectListRow,
// 	AdminProjectSummaryStats,
// } from "@/lib/types/admin/project";

// // TODO (integration stage): replace with:
// // db.query.projects.findMany({
// //   with: { leads: { columns: { id: true } } },
// //   orderBy: [desc(projects.updatedAt)],
// // })

// interface AdminMockMetrics {
// 	leads: number;
// 	leadChangePercent: number;
// 	lastUpdatedDate: string;
// 	lastUpdatedBy: string;
// 	adminStatus: AdminDisplayStatus;
// 	publishStatus: "draft" | "published";
// }

// const mockMetrics: Record<string, AdminMockMetrics> = {
// 	"jimo-residences-yaba": {
// 		leads: 428,
// 		leadChangePercent: 18,
// 		lastUpdatedDate: "Jun 9, 2025",
// 		lastUpdatedBy: "Tolu Adebayo",
// 		adminStatus: "under-development",
// 		publishStatus: "published",
// 	},
// 	"vatican-court": {
// 		leads: 316,
// 		leadChangePercent: 12,
// 		lastUpdatedDate: "Jun 9, 2025",
// 		lastUpdatedBy: "Emeka Chidi",
// 		adminStatus: "active",
// 		publishStatus: "published",
// 	},
// 	"yaba-hospitality-hub": {
// 		leads: 214,
// 		leadChangePercent: 24,
// 		lastUpdatedDate: "Jun 8, 2025",
// 		lastUpdatedBy: "Fumi Okafor",
// 		adminStatus: "active",
// 		publishStatus: "published",
// 	},
// };

// function buildStartingPrice(slug: string): string {
// 	const detail = getProjectDetail(slug);
// 	if (!detail) return "—";
// 	const priceFact = detail.facts.find((f) => f.label === "Starting Price");
// 	if (!priceFact) return "—";
// 	const firstUnit = detail.units[0]?.name ?? "";
// 	return firstUnit ? `${priceFact.value} · ${firstUnit}` : priceFact.value;
// }

// // The two extra rows below are mock-only to show the full status range
// // matching the design screenshot. Remove and replace with real DB rows
// // when project seeding is complete.
// const mockOnlyRows: AdminProjectListRow[] = [
// 	{
// 		id: "future-project",
// 		slug: "future-project",
// 		name: "Future Project",
// 		location: "Ibeju-Lekki, Lagos",
// 		adminStatus: "under-development",
// 		startingPrice: "₦50M Land Plot",
// 		leads: 86,
// 		leadChangePercent: -8,
// 		lastUpdatedDate: "Jun 7, 2025",
// 		lastUpdatedBy: "Ibrahim Musa",
// 		publishStatus: "draft",
// 	},
// 	{
// 		id: "sold-project-archive",
// 		slug: "sold-project-archive",
// 		name: "Sold Project Archive",
// 		location: "Victoria Island, Lagos",
// 		adminStatus: "completed",
// 		startingPrice: "— N/A",
// 		leads: 0,
// 		leadChangePercent: 0,
// 		lastUpdatedDate: "Jun 1, 2025",
// 		lastUpdatedBy: "System",
// 		publishStatus: "published",
// 	},
// ];

// export function getAdminProjectRows(): AdminProjectListRow[] {
// 	const realRows: AdminProjectListRow[] = featuredProjects.map((project) => {
// 		const metrics = mockMetrics[project.slug];

// 		if (!metrics) {
// 			return {
// 				id: project.id,
// 				slug: project.slug,
// 				name: project.name,
// 				location: project.location,
// 				adminStatus: "under-development",
// 				startingPrice: "—",
// 				leads: 0,
// 				leadChangePercent: 0,
// 				lastUpdatedDate: "—",
// 				lastUpdatedBy: "System",
// 				publishStatus: "draft",
// 			};
// 		}

// 		return {
// 			id: project.id,
// 			slug: project.slug,
// 			name: project.name,
// 			location: project.location,
// 			adminStatus: metrics.adminStatus,
// 			startingPrice: buildStartingPrice(project.slug),
// 			leads: metrics.leads,
// 			leadChangePercent: metrics.leadChangePercent,
// 			lastUpdatedDate: metrics.lastUpdatedDate,
// 			lastUpdatedBy: metrics.lastUpdatedBy,
// 			publishStatus: metrics.publishStatus,
// 		};
// 	});

// 	return [...realRows, ...mockOnlyRows];
// }

// export function getAdminProjectSummaryStats(): AdminProjectSummaryStats {
// 	// TODO (integration stage): compute from real DB queries
// 	// missingBrochure → projects with publishStatus="published" and no brochures row with status="active"
// 	// missingSeo      → seo_configs rows where metaTitle IS NULL and pageType = "project"
// 	// draftProjects   → projects where publishStatus = "draft"
// 	return {
// 		missingBrochure: 1,
// 		missingBrochureNote: "Visible projects without a brochure",
// 		missingSeo: 2,
// 		missingSeoNote: "Missing meta titles / descriptions",
// 		draftProjects: 1,
// 		draftProjectsNote: "Not visible on the website",
// 	};
// }

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