import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { brochures, leads, projects } from "@/lib/db/schema";
import { mapBrochureRowToListRow } from "@/lib/db/mappers/brochure";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";

export async function getAdminBrochureListRows(): Promise<AdminBrochureListRow[]> {
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
    .groupBy(
      brochures.id,
      projects.name,
      projects.slug,
    )
    .orderBy(desc(brochures.uploadedAt));

  return rows.map(mapBrochureRowToListRow);
}

export async function getBrochureByProjectSlug(
  projectSlug: string,
): Promise<{ fileUrl: string; title: string } | null> {
  const rows = await db
    .select({
      fileUrl: brochures.fileUrl,
      title: brochures.title,
    })
    .from(brochures)
    .leftJoin(projects, eq(brochures.projectId, projects.id))
    .where(eq(projects.slug, projectSlug))
    .limit(1);

  return rows[0] ?? null;
}