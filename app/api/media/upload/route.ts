import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import {
	deleteFromCloudinary,
	formatFileSize,
	uploadToCloudinary,
} from "@/lib/integrations/cloudinary";
import type { CloudinaryFolder } from "@/lib/integrations/cloudinary";

const ALLOWED_FOLDERS: CloudinaryFolder[] = [
	"jimo-property/project-renders",
	"jimo-property/interior-renders",
	"jimo-property/construction-updates",
	"jimo-property/brochures",
	"jimo-property/team-photos",
	"jimo-property/logos-icons",
	"jimo-property/documents",
	"jimo-property/videos",
	"jimo-property/site-images",
];

const FOLDER_DISPLAY_LABEL: Record<CloudinaryFolder, string> = {
	"jimo-property/project-renders": "Project Renders",
	"jimo-property/interior-renders": "Interior Renders",
	"jimo-property/construction-updates": "Construction Updates",
	"jimo-property/brochures": "Brochures",
	"jimo-property/team-photos": "Team Photos",
	"jimo-property/logos-icons": "Logos & Icons",
	"jimo-property/documents": "Documents",
	"jimo-property/videos": "Videos",
	"jimo-property/site-images": "Site Images",
};

export async function POST(request: NextRequest) {
	// Auth check — user must be an active admin
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const rawFolder = String(
			formData.get("folder") ?? "jimo-property/site-images",
		) as CloudinaryFolder;
		const altText = String(formData.get("altText") ?? "").trim();
		const linkedProjectId = formData.get("linkedProjectId") as string | null;

		if (!file || file.size === 0) {
			return NextResponse.json({ error: "No file provided." }, { status: 400 });
		}

		// 50 MB hard limit
		const MAX_SIZE = 50 * 1024 * 1024;
		if (file.size > MAX_SIZE) {
			return NextResponse.json(
				{ error: "File too large. Maximum size is 50 MB." },
				{ status: 400 },
			);
		}

		const folder = ALLOWED_FOLDERS.includes(rawFolder)
			? rawFolder
			: "jimo-property/site-images";

		// Upload to Cloudinary
		const cloudinaryResult = await uploadToCloudinary(file, folder);

		const folderLabel = FOLDER_DISPLAY_LABEL[folder];
		const autoAltText =
			altText ||
			file.name
				.replace(/\.[^/.]+$/, "")
				.replace(/[-_]/g, " ")
				.replace(/\b\w/g, (c) => c.toUpperCase());

		// Persist to Supabase via Drizzle
		const [asset] = await db
			.insert(mediaAssets)
			.values({
				cloudinaryPublicId: cloudinaryResult.publicId,
				url: cloudinaryResult.url,
				secureUrl: cloudinaryResult.secureUrl,
				resourceType: cloudinaryResult.resourceType,
				format: cloudinaryResult.format.toUpperCase(),
				width: cloudinaryResult.width,
				height: cloudinaryResult.height,
				sizeBytes: cloudinaryResult.sizeBytes,
				folder: folderLabel,
				altText: autoAltText,
				tags: [],
				linkedProjectId: linkedProjectId || null,
			})
			.returning();

		if (!asset) {
			// Cloudinary upload succeeded but DB failed — clean up
			await deleteFromCloudinary(
				cloudinaryResult.publicId,
				cloudinaryResult.resourceType,
			);
			return NextResponse.json(
				{ error: "Failed to save asset to database." },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			asset: {
				id: asset.id,
				secureUrl: asset.secureUrl,
				url: asset.url,
				publicId: asset.cloudinaryPublicId,
				resourceType: asset.resourceType,
				format: asset.format,
				altText: asset.altText,
				folder: asset.folder,
				sizeLabel: formatFileSize(asset.sizeBytes),
				width: asset.width,
				height: asset.height,
			},
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected upload error.";
		console.error("[media/upload]", message);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
