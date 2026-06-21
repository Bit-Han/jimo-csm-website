// app/api/leads/sync-crm/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import { bulkSyncToHubSpot } from "@/lib/services/leads.service";

export async function POST(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_leads")) return forbidden();
		const result = await bulkSyncToHubSpot();
		return ok(result);
	} catch (err) {
		return serverError("CRM sync failed.", err);
	}
}
