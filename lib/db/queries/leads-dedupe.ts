// lib/db/queries/lead-dedupe.ts
import { and, eq, gt, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { withTimeout } from "@/lib/utils/timeout";
import { BROCHURE_DEDUPE_COOLDOWN_HOURS } from "@/lib/constants/lead-dedupe";

const DB_TIMEOUT_MS = 8000;

export interface RecentBrochureRequestInput {
	projectSlug: string;
	email?: string | null;
	phoneNumber?: string | null;
	cooldownHours?: number;
}

// Scoped to ONE project — the same person requesting a different project's
// brochure, or reaching you via website/whatsapp/instagram/etc, is a
// separate lead and is never touched by this check.
export async function hasRecentBrochureRequest(
	input: RecentBrochureRequestInput,
): Promise<boolean> {
	const email = input.email?.trim().toLowerCase() || null;
	const phone = input.phoneNumber?.trim() || null;
	if (!email && !phone) return false;

	const cooldownHours = input.cooldownHours ?? BROCHURE_DEDUPE_COOLDOWN_HOURS;
	const cutoff = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

	const matchConditions = [];
	if (email) matchConditions.push(sql`lower(${leads.email}) = ${email}`);
	if (phone) matchConditions.push(eq(leads.phoneNumber, phone));

	try {
		const rows = await withTimeout(
			db
				.select({ id: leads.id })
				.from(leads)
				.where(
					and(
						eq(leads.projectSlug, input.projectSlug),
						eq(leads.source, "brochure"),
						gt(leads.createdAt, cutoff),
						or(...matchConditions),
					),
				)
				.limit(1),
			DB_TIMEOUT_MS,
			"hasRecentBrochureRequest",
		);
		return rows.length > 0;
	} catch (error) {
		// Fail OPEN — a dedupe-check outage should never block a real visitor.
		console.error(
			"[hasRecentBrochureRequest] check failed, allowing request through:",
			error,
		);
		return false;
	}
}
