import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { desc, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { formatFileSize } from "@/lib/integrations/cloudinary";

export async function GET(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const folder = searchParams.get("folder") ?? "all";
		const search = searchParams.get("search") ?? "";
		const resourceType = searchParams.get("resourceType") ?? "all";
		const limit = Math.min(parseInt(searchParams.get("limit") ?? "60"), 200);

		const allAssets = await db.query.mediaAssets.findMany({
			orderBy: [desc(mediaAssets.createdAt)],
		});

		const filtered = allAssets.filter((asset) => {
			const matchFolder =
				folder === "all" ||
				asset.folder.toLowerCase().includes(folder.toLowerCase());
			const matchSearch =
				!search ||
				asset.altText.toLowerCase().includes(search.toLowerCase()) ||
				asset.cloudinaryPublicId.toLowerCase().includes(search.toLowerCase());
			const matchType =
				resourceType === "all" || asset.resourceType === resourceType;
			return matchFolder && matchSearch && matchType;
		});

		const paginated = filtered.slice(0, limit);

		return NextResponse.json({
			assets: paginated.map((a) => ({
				id: a.id,
				secureUrl: a.secureUrl,
				publicId: a.cloudinaryPublicId,
				resourceType: a.resourceType,
				format: a.format,
				altText: a.altText,
				folder: a.folder,
				sizeLabel: formatFileSize(a.sizeBytes),
				width: a.width,
				height: a.height,
				createdAt: a.createdAt.toISOString(),
			})),
			total: filtered.length,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to list media.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
