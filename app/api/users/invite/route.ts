// app/api/users/invite/route.ts
import { NextRequest } from "next/server";
import { getAuthUser, createAdminClient } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import {
	ok,
	created,
	unauthorized,
	forbidden,
	badRequest,
	serverError,
} from "@/lib/utils/api-response";
import { db } from "@/lib/db";
import { invitations, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { inviteUserSchema } from "@/lib/validations/users";

export async function POST(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "manage_users")) return forbidden();

		const body = await req.json();
		const parsed = inviteUserSchema.safeParse(body);
		if (!parsed.success) {
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		}

		const { email, role } = parsed.data;

		// Check if user already exists
		const [existing] = await db
			.select()
			.from(profiles)
			.where(eq(profiles.email, email))
			.limit(1);

		if (existing) {
			return badRequest("A user with this email already exists.");
		}

		// Check for pending invite
		const [pendingInvite] = await db
			.select()
			.from(invitations)
			.where(eq(invitations.email, email))
			.limit(1);

		if (pendingInvite?.status === "pending") {
			return badRequest("An invitation has already been sent to this email.");
		}

		// Use Supabase Admin client to send the invite
		const adminClient = await createAdminClient();
		const { data: inviteData, error: inviteError } =
			await adminClient.auth.admin.inviteUserByEmail(email, {
				data: {
					role,
					invited_by: auth.profile.id,
				},
				redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/setup-account`,
			});

		if (inviteError || !inviteData.user) {
			return serverError(
				inviteError?.message ?? "Failed to send invitation.",
				inviteError,
			);
		}

		// Record the invitation in our DB for tracking
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7-day invite expiry

		await db.insert(invitations).values({
			email,
			role,
			invitedBy: auth.profile.id,
			supabaseUserId: inviteData.user.id,
			status: "pending",
			expiresAt,
		});

		return created({ message: `Invitation sent to ${email}` });
	} catch (err) {
		return serverError("Failed to send invitation.", err);
	}
}
