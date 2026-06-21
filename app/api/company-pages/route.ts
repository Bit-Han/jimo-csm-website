// app/api/company-pages/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import { getCompanyPages } from "@/lib/services/company-pages.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_company_pages")) return forbidden();
		const pages = await getCompanyPages();
		return ok(pages);
	} catch (err) {
		return serverError("Failed to load company pages.", err);
	}
}
