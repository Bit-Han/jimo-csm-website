// lib/services/media.service.ts
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, ilike, sql, desc, and } from "drizzle-orm";
import { deleteFromCloudinary } from "@/lib/integrations/cloudinary";
import { buildPaginationMeta } from "@/lib/utils/helpers";
import type { Media, PaginationParams } from "@/lib/types";

export type MediaFilters = {
  search?: string;
  folder?: string;
  projectId?: string;
  resourceType?: string;
};

export async function getMedia(
  filters: MediaFilters = {},
  pagination: PaginationParams = {}
) {
  const { page = 1, pageSize = 40 } = pagination;
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (filters.search) conditions.push(ilike(media.title, `%${filters.search}%`));
  if (filters.folder)
    conditions.push(eq(media.folder, filters.folder as Media["folder"]));
  if (filters.projectId) conditions.push(eq(media.projectId, filters.projectId));
  if (filters.resourceType)
    conditions.push(eq(media.resourceType, filters.resourceType));

  const where = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(media)
    .where(where);

  const rows = await db
    .select()
    .from(media)
    .where(where)
    .orderBy(desc(media.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { data: rows, meta: buildPaginationMeta(total, page, pageSize) };
}

export async function getMediaById(id: string): Promise<Media | null> {
  const [item] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return item ?? null;
}

export async function updateMedia(
  id: string,
  input: { title?: string; altText?: string; folder?: Media["folder"]; usageTag?: Media["usageTag"]; projectId?: string | null }
): Promise<Media | null> {
  const [updated] = await db
    .update(media)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(media.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteMedia(id: string): Promise<void> {
  const [item] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (item?.cloudinaryPublicId) {
    await deleteFromCloudinary(
      item.cloudinaryPublicId,
      item.resourceType as "image" | "video" | "raw"
    ).catch(console.error);
  }
  await db.delete(media).where(eq(media.id, id));
}

/** Folder breakdown counts for the sidebar in Media Library */
export async function getMediaFolderStats(): Promise
  Array<{ folder: string; count: number }>
 {
  const rows = await db
    .select({
      folder: media.folder,
      count: sql<number>`count(*)::int`,
    })
    .from(media)
    .groupBy(media.folder);

  return rows;
}

/** Total storage used in MB */
export async function getStorageUsedMb(): Promise<number> {
  const [{ total }] = await db
    .select({ total: sql<number>`COALESCE(SUM(file_size_mb), 0)::int` })
    .from(media);
  return total;
}