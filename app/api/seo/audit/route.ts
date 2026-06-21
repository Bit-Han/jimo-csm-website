// app/api/seo/audit/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import { runSeoAudit } from "@/lib/services/seo.service";

export async function POST(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_seo")) return forbidden();
		const result = await runSeoAudit();
		return ok(result);
	} catch (err) {
		return serverError("SEO audit failed.", err);
	}
}
