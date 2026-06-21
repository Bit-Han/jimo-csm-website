// app/api/leads/[id]/notes/route.ts
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
import { addLeadNote } from "@/lib/services/leads.service";
import { createLeadNoteSchema } from "@/lib/validations/leads";
import { db } from "@/lib/db";
import { leadNotes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_leads")) return forbidden();
		const { id } = await params;
		const notes = await db.query.leadNotes.findMany({
			where: eq(leadNotes.leadId, id),
			with: { author: { columns: { id: true, name: true } } },
			orderBy: [desc(leadNotes.createdAt)],
		});
		return ok(notes);
	} catch (err) {
		return serverError("Failed to load notes.", err);
	}
}

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "edit_leads")) return forbidden();
		const { id } = await params;
		const body = await req.json();
		const parsed = createLeadNoteSchema.safeParse(body);
		if (!parsed.success)
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		await addLeadNote(
			id,
			parsed.data.content,
			auth.profile.id,
			parsed.data.mentionedUsers,
		);
		return created({ added: true });
	} catch (err) {
		return serverError("Failed to add note.", err);
	}
}
