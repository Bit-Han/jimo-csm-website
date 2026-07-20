import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
// import { formatFileSize } from "@/lib/integrations/cloudinary";
import type { MediaAsset } from "@/lib/types/admin/media";

const FOLDER_ID_MAP: Record<string, string> = {
  "Project Renders": "project-renders",
  "Interior Renders": "interior-renders",
  "Construction Updates": "construction-updates",
  Brochures: "brochures",
  "Team Photos": "team-photos",
  "Logos & Icons": "logos-icons",
  Documents: "documents",
  Videos: "videos",
  "Site Images": "site-images",
};

const TAG_COLOR_MAP: Record<string, string> = {
  "Project Renders": "bg-emerald-50 text-emerald-700",
  "Interior Renders": "bg-blue-50 text-blue-700",
  "Construction Updates": "bg-amber-50 text-amber-700",
  Brochures: "bg-violet-50 text-violet-700",
  "Team Photos": "bg-pink-50 text-pink-700",
  "Logos & Icons": "bg-sky-50 text-sky-700",
  Documents: "bg-stone-100 text-stone-600",
  Videos: "bg-red-50 text-red-600",
  "Site Images": "bg-teal-50 text-teal-700",
};

export async function getAdminMediaAssets(
  folder = "all",
): Promise<MediaAsset[]> {
  const rows = await db.query.mediaAssets.findMany({
    orderBy: [desc(mediaAssets.createdAt)],
  });

  const filtered =
    folder === "all"
      ? rows
      : rows.filter(
          (r) =>
            r.folder.toLowerCase() === folder.toLowerCase() ||
            (FOLDER_ID_MAP[r.folder] ?? r.folder.toLowerCase().replace(/\s+/g, "-")) ===
              folder,
        );

  return filtered.map((row) => ({
    id: row.id,
    cloudinaryPublicId: row.cloudinaryPublicId,
    url: row.secureUrl,
    name: row.altText,
    projectName: null,
    tagLabel: row.folder,
    tagColorClass: TAG_COLOR_MAP[row.folder] ?? "bg-stone-100 text-stone-600",
    resourceType: row.resourceType,
    format: row.format,
  }));
}

export async function getMediaFolderCounts(): Promise<{ folder: string; count: number }[]> {
  const all = await db.query.mediaAssets.findMany({
    columns: { folder: true },
  });

  const counts: Record<string, number> = {};
  for (const { folder } of all) {
    counts[folder] = (counts[folder] ?? 0) + 1;
  }

  return Object.entries(counts).map(([folder, count]) => ({ folder, count }));
}