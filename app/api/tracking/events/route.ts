// app/api/tracking/events/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import {
	getTrackingEvents,
	upsertTrackingEvent,
} from "@/lib/services/tracking.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_tracking")) return forbidden();
		return ok(await getTrackingEvents());
	} catch (err) {
		return serverError("Failed to load events.", err);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_tracking")) return forbidden();
		const body = await req.json();
		const event = await upsertTrackingEvent(body);
		return created(event);
	} catch (err) {
		return serverError("Failed to save event.", err);
	}
}
