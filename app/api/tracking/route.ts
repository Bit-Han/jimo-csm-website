// app/api/tracking/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import { getTrackingOverview } from "@/lib/services/tracking.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_tracking")) return forbidden();
		const data = await getTrackingOverview();
		return ok(data);
	} catch (err) {
		return serverError("Failed to load tracking data.", err);
	}
}
