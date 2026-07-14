// import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

// // TODO (integration stage):
// // db.query.brochures.findMany({ with: { project: true }, orderBy: [desc(brochures.uploadedAt)] })
// // leadsCount → count of leads where source = "brochure" and projectId matches
// export const mockAdminBrochures: AdminBrochureListRow[] = [
// 	{
// 		id: "brochure-jimo-residences",
// 		title: "Jimo Residences Brochure",
// 		fileType: "pdf",
// 		relatedProject: "Jimo Residences",
// 		relatedProjectSlug: "jimo-residences-yaba",
// 		status: "active",
// 		leadsCount: 88,
// 		statusNote: "88 leads captured",
// 		fileUrl: "/brochures/jimo-residences-yaba.pdf",
// 		cloudinaryPublicId: null,
// 		uploadedAt: "Jun 1, 2025",
// 	},
// 	{
// 		id: "brochure-vatican-court",
// 		title: "Vatican Court Brochure",
// 		fileType: "pdf",
// 		relatedProject: "Vatican Court",
// 		relatedProjectSlug: "vatican-court",
// 		status: "active",
// 		leadsCount: 39,
// 		statusNote: "39 leads captured",
// 		fileUrl: "/brochures/vatican-court.pdf",
// 		cloudinaryPublicId: null,
// 		uploadedAt: "May 15, 2025",
// 	},
// 	{
// 		id: "brochure-yaba-hub",
// 		title: "Yaba Hub Brochure",
// 		fileType: "pdf",
// 		relatedProject: "Yaba Hub",
// 		relatedProjectSlug: "yaba-hospitality-hub",
// 		status: "draft",
// 		leadsCount: null,
// 		statusNote: "Needs approval",
// 		fileUrl: "/brochures/yaba-hospitality-hub.pdf",
// 		cloudinaryPublicId: null,
// 		uploadedAt: "Jun 8, 2025",
// 	},
// ];

// export function getAdminBrochures(): AdminBrochureListRow[] {
// 	return mockAdminBrochures;
// }


export { getAdminBrochureListRows as getAdminBrochures } from "@/lib/db/queries/brochures";