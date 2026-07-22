// // import { count, desc, eq } from "drizzle-orm";
// // import { db } from "@/lib/db";
// // import { brochures, leads, projects } from "@/lib/db/schema";
// // import { mapBrochureRowToListRow } from "@/lib/db/mappers/brochure";
// // import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

// // export async function getAdminBrochureListRows(): Promise<AdminBrochureListRow[]> {
// //   const rows = await db
// //     .select({
// //       id: brochures.id,
// //       title: brochures.title,
// //       fileUrl: brochures.fileUrl,
// //       cloudinaryPublicId: brochures.cloudinaryPublicId,
// //       status: brochures.status,
// //       uploadedAt: brochures.uploadedAt,
// //       projectName: projects.name,
// //       projectSlug: projects.slug,
// //       leadCount: count(leads.id),
// //     })
// //     .from(brochures)
// //     .leftJoin(projects, eq(brochures.projectId, projects.id))
// //     .leftJoin(leads, eq(leads.projectId, projects.id))
// //     .groupBy(
// //       brochures.id,
// //       projects.name,
// //       projects.slug,
// //     )
// //     .orderBy(desc(brochures.uploadedAt));

// //   return rows.map(mapBrochureRowToListRow);
// // }

// // export async function getBrochureByProjectSlug(
// //   projectSlug: string,
// // ): Promise<{ fileUrl: string; title: string } | null> {
// //   const rows = await db
// //     .select({
// //       fileUrl: brochures.fileUrl,
// //       title: brochures.title,
// //     })
// //     .from(brochures)
// //     .leftJoin(projects, eq(brochures.projectId, projects.id))
// //     .where(eq(projects.slug, projectSlug))
// //     .limit(1);

// //   return rows[0] ?? null;
// // }

// import { count, desc, eq } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { brochures, leads, projects } from "@/lib/db/schema";
// import { mapBrochureRowToListRow } from "@/lib/db/mappers/brochure";
// import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

// export async function getAdminBrochureListRows(): Promise<
// 	AdminBrochureListRow[]
// > {
// 	const rows = await db
// 		.select({
// 			id: brochures.id,
// 			title: brochures.title,
// 			fileUrl: brochures.fileUrl,
// 			cloudinaryPublicId: brochures.cloudinaryPublicId,
// 			status: brochures.status,
// 			uploadedAt: brochures.uploadedAt,
// 			projectName: projects.name,
// 			projectSlug: projects.slug,
// 			leadCount: count(leads.id),
// 		})
// 		.from(brochures)
// 		.leftJoin(projects, eq(brochures.projectId, projects.id))
// 		.leftJoin(leads, eq(leads.projectId, projects.id))
// 		.groupBy(brochures.id, projects.name, projects.slug)
// 		.orderBy(desc(brochures.uploadedAt));

// 	return rows.map(mapBrochureRowToListRow);
// }

// export async function getBrochureByProjectSlug(
// 	projectSlug: string,
// ): Promise<{ fileUrl: string; title: string } | null> {
// 	const rows = await db
// 		.select({
// 			fileUrl: brochures.fileUrl,
// 			title: brochures.title,
// 		})
// 		.from(brochures)
// 		.leftJoin(projects, eq(brochures.projectId, projects.id))
// 		.where(eq(projects.slug, projectSlug))
// 		.limit(1);

// 	return rows[0] ?? null;
// }

// /**
//  * Full admin-view row for the ONE brochure attached to a project — used
//  * by the project editor's Brochure tab, which manages the same
//  * `brochures` row that appears in the global Admin → Brochures list.
//  * Assumes one brochure per project, matching getBrochureByProjectSlug's
//  * existing .limit(1) convention above.
//  */
// export async function getProjectBrochureRow(
// 	projectSlug: string,
// ): Promise<AdminBrochureListRow | null> {
// 	const rows = await db
// 		.select({
// 			id: brochures.id,
// 			title: brochures.title,
// 			fileUrl: brochures.fileUrl,
// 			cloudinaryPublicId: brochures.cloudinaryPublicId,
// 			status: brochures.status,
// 			uploadedAt: brochures.uploadedAt,
// 			projectName: projects.name,
// 			projectSlug: projects.slug,
// 		})
// 		.from(brochures)
// 		.innerJoin(projects, eq(brochures.projectId, projects.id))
// 		.where(eq(projects.slug, projectSlug))
// 		.limit(1);

// 	const row = rows[0];
// 	if (!row) return null;

// 	return {
// 		id: row.id,
// 		title: row.title,
// 		fileType: "pdf",
// 		relatedProject: row.projectName,
// 		relatedProjectSlug: row.projectSlug,
// 		status: row.status as "active" | "draft",
// 		leadsCount: null,
// 		statusNote: row.status === "draft" ? "Needs approval" : "Published",
// 		fileUrl: row.fileUrl,
// 		cloudinaryPublicId: row.cloudinaryPublicId,
// 		uploadedAt: row.uploadedAt.toLocaleDateString("en-GB", {
// 			day: "numeric",
// 			month: "short",
// 			year: "numeric",
// 		}),
// 	};
// }

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brochures, leads, projects } from "@/lib/db/schema";
import { mapBrochureRowToListRow } from "@/lib/db/mappers/brochure";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

export async function getAdminBrochureListRows(): Promise<
	AdminBrochureListRow[]
> {
	const rows = await db
		.select({
			id: brochures.id,
			title: brochures.title,
			fileUrl: brochures.fileUrl,
			cloudinaryPublicId: brochures.cloudinaryPublicId,
			status: brochures.status,
			uploadedAt: brochures.uploadedAt,
			projectName: projects.name,
			projectSlug: projects.slug,
			leadCount: count(leads.id),
		})
		.from(brochures)
		.leftJoin(projects, eq(brochures.projectId, projects.id))
		.leftJoin(leads, eq(leads.projectId, projects.id))
		.groupBy(brochures.id, projects.name, projects.slug)
		.orderBy(desc(brochures.uploadedAt));

	return rows.map(mapBrochureRowToListRow);
}

/**
 * Public-facing lookup — only ever returns a PUBLISHED ("active") brochure.
 * A brochure in "draft" (your admin UI calls this "Needs approval") must
 * never be servable or emailed to a public visitor before someone has
 * actually approved it. Returns null both when a project has no brochure
 * at all AND when it only has an unpublished one — the caller can't tell
 * those apart from this function alone, which is intentional: from the
 * public side, "not approved yet" and "doesn't exist yet" should look
 * identical.
 */
export async function getBrochureByProjectSlug(
	projectSlug: string,
): Promise<{ id: string; fileUrl: string; title: string } | null> {
	const rows = await db
		.select({
			id: brochures.id,
			fileUrl: brochures.fileUrl,
			title: brochures.title,
		})
		.from(brochures)
		.innerJoin(projects, eq(brochures.projectId, projects.id))
		.where(and(eq(projects.slug, projectSlug), eq(brochures.status, "active")))
		.limit(1);

	return rows[0] ?? null;
}

export async function getProjectBrochureRow(
	projectSlug: string,
): Promise<AdminBrochureListRow | null> {
	const rows = await db
		.select({
			id: brochures.id,
			title: brochures.title,
			fileUrl: brochures.fileUrl,
			cloudinaryPublicId: brochures.cloudinaryPublicId,
			status: brochures.status,
			uploadedAt: brochures.uploadedAt,
			projectName: projects.name,
			projectSlug: projects.slug,
		})
		.from(brochures)
		.innerJoin(projects, eq(brochures.projectId, projects.id))
		.where(eq(projects.slug, projectSlug))
		.limit(1);

	const row = rows[0];
	if (!row) return null;

	return {
		id: row.id,
		title: row.title,
		fileType: "pdf",
		relatedProject: row.projectName,
		relatedProjectSlug: row.projectSlug,
		status: row.status as "active" | "draft",
		leadsCount: null,
		statusNote: row.status === "draft" ? "Needs approval" : "Published",
		fileUrl: row.fileUrl,
		cloudinaryPublicId: row.cloudinaryPublicId,
		uploadedAt: row.uploadedAt.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}),
	};
}