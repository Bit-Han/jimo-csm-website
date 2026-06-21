// app/api/media/upload/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
  created,
  unauthorized,
  forbidden,
  badRequest,
  serverError,
} from "@/lib/utils/api-response";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import {
  uploadToCloudinary,
  getCloudinaryFolder,
} from "@/lib/integrations/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return unauthorized();
    if (!can(auth.profile.role, "upload_media")) return forbidden();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "project_renders";
    const title = (formData.get("title") as string) ?? file?.name ?? "Untitled";
    const projectId = formData.get("projectId") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) return badRequest("No file provided.");

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinaryFolder = getCloudinaryFolder(folder);
    const result = await uploadToCloudinary(buffer, {
      folder: cloudinaryFolder,
      resourceType: "auto",
    });

    // Save media record to DB
    const [mediaRecord] = await db
      .insert(media)
      .values({
        title,
        projectId: projectId ?? undefined,
        folder: folder as (typeof media.$inferInsert)["folder"],
        usageTag: "project_render",
        cloudinaryPublicId: result.publicId,
        cloudinaryUrl: result.secureUrl,
        resourceType: result.resourceType,
        format: result.format,
        altText: altText ?? undefined,
        fileSizeMb: result.bytes / (1024 * 1024),
        width: result.width,
        height: result.height,
        durationSeconds: result.duration,
        uploadedBy: auth.profile.id,
      })
      .returning();

    return created(mediaRecord);
  } catch (err) {
    return serverError("Failed to upload media.", err);
  }
}