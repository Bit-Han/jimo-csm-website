// app/api/landing-pages/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import {
	getLandingPages,
	createLandingPage,
} from "@/lib/services/landing-pages.service";
import { parseIntParam } from "@/lib/utils/helpers";
import { z } from "zod";

const createLandingPageSchema = z.object({
	title: z.string().min(2),
	type: z.enum([
		"investment",
		"unit_campaign",
		"realtor",
		"diaspora",
		"general",
	]),
	projectId: z.string().uuid().optional(),
	campaignType: z.string().optional(),
	audience: z.string().optional(),
	crmTag: z.string().optional(),
	formId: z.string().uuid().optional(),
	metaTitle: z.string().max(60).optional(),
	metaDescription: z.string().max(160).optional(),
	focusKeyword: z.string().optional(),
	hubspotListId: z.string().optional(),
});

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_landing_pages")) return forbidden();
		const { searchParams } = req.nextUrl;
		const { data, meta } = await getLandingPages(
			{
				search: searchParams.get("search") ?? undefined,
				status: searchParams.get("status") ?? undefined,
				type: searchParams.get("type") ?? undefined,
			},
			{ page: parseIntParam(searchParams.get("page"), 1) },
		);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load landing pages.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_landing_pages")) return forbidden();
		const body = await req.json();
		const parsed = createLandingPageSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		const page = await createLandingPage(parsed.data, auth.profile.id);
		return created(page);
	} catch (err) {
		return serverError("Failed to create landing page.", err);
	}
}
