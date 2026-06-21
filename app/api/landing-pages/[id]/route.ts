// app/api/landing-pages/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	noContent,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getLandingPageById,
	updateLandingPage,
	deleteLandingPage,
} from "@/lib/services/landing-pages.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_landing_pages")) return forbidden();
		const { id } = await params;
		const page = await getLandingPageById(id);
		if (!page) return notFound("Landing page not found.");
		return ok(page);
	} catch (err) {
		return serverError("Failed to load landing page.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_landing_pages")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const updated = await updateLandingPage(id, body);
		if (!updated) return notFound("Landing page not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update landing page.", err);
	}
}

export async function DELETE(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_landing_pages")) return forbidden();
		const { id } = await params;
		await deleteLandingPage(id);
		return noContent();
	} catch (err) {
		return serverError("Failed to delete landing page.", err);
	}
}
