// app/api/leads/[id]/assign/route.ts
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { updateLead } from "@/lib/services/leads.service";
import { assignLeadSchema } from "@/lib/validations/leads";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "assign_leads")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const parsed = assignLeadSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		const updated = await updateLead(
			id,
			{ assignedTo: parsed.data.assignedTo },
			auth.profile.id,
		);
		return ok(updated);
	} catch (err) {
		return serverError("Failed to assign lead.", err);
	}
}
