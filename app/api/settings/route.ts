// app/api/settings/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	serverError,
} from "@/lib/utils/api-response";
import { getSettings, upsertSettings } from "@/lib/services/settings.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_settings")) return forbidden();
		const settings = await getSettings();
		return ok(settings);
	} catch (err) {
		return serverError("Failed to load settings.", err);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_settings")) return forbidden();
		const body = await req.json();
		const updated = await upsertSettings(body);
		return ok(updated);
	} catch (err) {
		return serverError("Failed to update settings.", err);
	}
}