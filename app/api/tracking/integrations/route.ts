// app/api/tracking/integrations/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getTrackingIntegrations,
	upsertTrackingIntegration,
} from "@/lib/services/tracking.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_tracking")) return forbidden();
		return ok(await getTrackingIntegrations());
	} catch (err) {
		return serverError("Failed to load integrations.", err);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_tracking")) return forbidden();
		const body = await req.json();
		const updated = await upsertTrackingIntegration(body);
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update integration.", err);
	}
}
