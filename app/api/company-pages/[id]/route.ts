// app/api/company-pages/[id]/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	notFound,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getCompanyPageById,
	updateCompanyPage,
} from "@/lib/services/company-pages.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_company_pages")) return forbidden();
		const { id } = await params;
		const page = await getCompanyPageById(id);
		if (!page) return notFound("Page not found.");
		return ok(page);
	} catch (err) {
		return serverError("Failed to load page.", err);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_company_pages")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const updated = await updateCompanyPage(id, body, auth.profile.id);
		if (!updated) return notFound("Page not found.");
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update page.", err);
	}
}
