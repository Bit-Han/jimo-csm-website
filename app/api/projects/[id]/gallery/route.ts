// app/api/projects/[id]/gallery/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	noContent,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { db } from "@/lib/db";
import { projectGallery } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		const { id } = await params;
		const gallery = await db
			.select()
			.from(projectGallery)
			.where(eq(projectGallery.projectId, id))
			.orderBy(asc(projectGallery.orderIndex));
		return ok(gallery);
	} catch (err) {
		return serverError("Failed to load gallery.", err);
	}
}

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_projects")) return forbidden();
		const { id } = await params;
		const { mediaId, orderIndex = 0 } = await req.json();
		if (!mediaId) return badRequest("mediaId is required");
		const [item] = await db
			.insert(projectGallery)
			.values({ projectId: id, mediaId, orderIndex })
			.returning();
		return created(item);
	} catch (err) {
		return serverError("Failed to add gallery item.", err);
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_projects")) return forbidden();
		const { galleryItemId } = await req.json();
		if (!galleryItemId) return badRequest("galleryItemId required");
		await db.delete(projectGallery).where(eq(projectGallery.id, galleryItemId));
		return noContent();
	} catch (err) {
		return serverError("Failed to remove gallery item.", err);
	}
}
