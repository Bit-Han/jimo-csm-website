import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

export interface BrochureQueryRow {
	id: string;
	title: string;
	fileUrl: string;
	cloudinaryPublicId: string;
	status: string;
	uploadedAt: Date;
	projectName: string | null;
	projectSlug: string | null;
	leadCount: number;
}

export function mapBrochureRowToListRow(
	row: BrochureQueryRow,
): AdminBrochureListRow {
	const leadsCount = row.leadCount > 0 ? row.leadCount : null;

	return {
		id: row.id,
		title: row.title,
		fileType: "pdf",
		relatedProject: row.projectName ?? "—",
		relatedProjectSlug: row.projectSlug ?? "",
		status: row.status as "active" | "draft",
		leadsCount,
		statusNote:
			row.status === "draft"
				? "Needs approval"
				: `${row.leadCount} leads captured`,
		fileUrl: row.fileUrl,
		cloudinaryPublicId: row.cloudinaryPublicId,
		uploadedAt: row.uploadedAt.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}),
	};
}
