// // lib/db/queries/lead-dedupe.ts
// import { and, eq, gt, or, sql } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { leads } from "@/lib/db/schema";
// import { withTimeout } from "@/lib/utils/timeout";
// import { BROCHURE_DEDUPE_COOLDOWN_HOURS } from "@/lib/constants/lead-dedupe";

// const DB_TIMEOUT_MS = 8000;

// export interface RecentBrochureRequestInput {
// 	projectSlug: string;
// 	email?: string | null;
// 	phoneNumber?: string | null;
// 	cooldownHours?: number;
// }

// // Scoped to ONE project — the same person requesting a different project's
// // brochure, or reaching you via website/whatsapp/instagram/etc, is a
// // separate lead and is never touched by this check.
// export async function hasRecentBrochureRequest(
// 	input: RecentBrochureRequestInput,
// ): Promise<boolean> {
// 	const email = input.email?.trim().toLowerCase() || null;
// 	const phone = input.phoneNumber?.trim() || null;
// 	if (!email && !phone) return false;

// 	const cooldownHours = input.cooldownHours ?? BROCHURE_DEDUPE_COOLDOWN_HOURS;
// 	const cutoff = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

// 	const matchConditions = [];
// 	if (email) matchConditions.push(sql`lower(${leads.email}) = ${email}`);
// 	if (phone) matchConditions.push(eq(leads.phoneNumber, phone));

// 	try {
// 		const rows = await withTimeout(
// 			db
// 				.select({ id: leads.id })
// 				.from(leads)
// 				.where(
// 					and(
// 						eq(leads.projectSlug, input.projectSlug),
// 						eq(leads.source, "brochure"),
// 						gt(leads.createdAt, cutoff),
// 						or(...matchConditions),
// 					),
// 				)
// 				.limit(1),
// 			DB_TIMEOUT_MS,
// 			"hasRecentBrochureRequest",
// 		);
// 		return rows.length > 0;
// 	} catch (error) {
// 		// Fail OPEN — a dedupe-check outage should never block a real visitor.
// 		console.error(
// 			"[hasRecentBrochureRequest] check failed, allowing request through:",
// 			error,
// 		);
// 		return false;
// 	}
// }


// lib/db/queries/lead-dedupe.ts
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { withTimeout } from "@/lib/utils/timeout";
import { BROCHURE_DEDUPE_COOLDOWN_HOURS, BROCHURE_RETRY_COOLDOWN_SECONDS } from "@/lib/constants/lead-dedupe";

const DB_TIMEOUT_MS = 8000;

export interface ClaimBrochureLeadInput {
	fullName: string;
	email: string; // must already be trim().toLowerCase()'d by the caller
	phoneNumber: string | null;
	projectId: string | null;
	projectSlug: string;
	landingPageId?: string | null;
	landingPageSlug?: string | null;
	budgetRange?: string | null;
	enquiryType?: string | null;
	message?: string | null;
	utmSource?: string | null;
	utmMedium?: string | null;
	utmCampaign?: string | null;
}

export interface ClaimResult {
	claimed: boolean;
	leadId: string | null;
	attemptCount: number | null;
}

/**
 * Atomically claims the right to send a project's brochure to an email, in
 * ONE statement against the `leads` table itself — no second table.
 *
 * Postgres serializes this: when two requests race for the same
 * (project_slug, email), one wins the INSERT; the other evaluates against
 * the row the winner just wrote and is (correctly) rejected by the WHERE
 * clause below, because that row is always inside the retry cooldown.
 *
 * Raw SQL deliberately, not the query-builder's .onConflictDoUpdate() —
 * targeting a PARTIAL unique index needs the arbiter's WHERE clause to
 * appear verbatim in the ON CONFLICT clause, which varies by drizzle-orm
 * version to express safely. Raw SQL maps 1:1 to real Postgres syntax with
 * no ambiguity, which matters here since this path is what stops duplicate
 * sends — worth the few extra lines to be certain it's correct.
 */
export async function claimBrochureLead(input: ClaimBrochureLeadInput): Promise<ClaimResult> {
	const email = input.email.trim().toLowerCase();
	const now = new Date();
	const deliveredCutoff = new Date(now.getTime() - BROCHURE_DEDUPE_COOLDOWN_HOURS * 60 * 60 * 1000);
	const pendingCutoff = new Date(now.getTime() - BROCHURE_RETRY_COOLDOWN_SECONDS * 1000);

	try {
		const result = await withTimeout(
			db.execute(sql`
				INSERT INTO leads (
					full_name, email, phone_number, project_id, project_slug,
					landing_page_id, landing_page_slug, source, status,
					budget_range, enquiry_type, message,
					utm_source, utm_medium, utm_campaign,
					brochure_last_attempt_at, brochure_attempt_count
				) VALUES (
					${input.fullName}, ${email}, ${input.phoneNumber}, ${input.projectId}, ${input.projectSlug},
					${input.landingPageId ?? null}, ${input.landingPageSlug ?? null}, 'brochure', 'new',
					${input.budgetRange ?? null}, ${input.enquiryType ?? "brochure-download"}, ${input.message ?? null},
					${input.utmSource ?? null}, ${input.utmMedium ?? null}, ${input.utmCampaign ?? null},
					${now}, 1
				)
				ON CONFLICT (project_slug, email)
				WHERE source = 'brochure' AND project_slug IS NOT NULL AND email IS NOT NULL
				DO UPDATE SET
					full_name = EXCLUDED.full_name,
					phone_number = COALESCE(EXCLUDED.phone_number, leads.phone_number),
					landing_page_id = COALESCE(EXCLUDED.landing_page_id, leads.landing_page_id),
					landing_page_slug = COALESCE(EXCLUDED.landing_page_slug, leads.landing_page_slug),
					brochure_last_attempt_at = ${now},
					brochure_attempt_count = leads.brochure_attempt_count + 1,
					updated_at = ${now}
				WHERE
					(leads.brochure_delivered_at IS NOT NULL AND leads.brochure_delivered_at < ${deliveredCutoff})
					OR
					(leads.brochure_delivered_at IS NULL AND leads.brochure_last_attempt_at < ${pendingCutoff})
				RETURNING id, brochure_attempt_count AS "attemptCount"
			`),
			DB_TIMEOUT_MS,
			"claimBrochureLead",
		);

		// node-postgres/postgres.js return shapes differ slightly — this
		// covers both without needing to know which driver you're on.
		const rows = (Array.isArray(result) ? result : (result as { rows?: unknown[] }).rows) as
			| { id: string; attemptCount: number }[]
			| undefined;
		const row = rows?.[0];

		if (!row) return { claimed: false, leadId: null, attemptCount: null };
		return { claimed: true, leadId: row.id, attemptCount: row.attemptCount };
	} catch (error) {
		// Fail CLOSED — this guards a write plus an outbound email, so an
		// unreachable DB should mean "please try again," not a risked
		// duplicate send.
		console.error("[claimBrochureLead] claim failed:", error);
		return { claimed: false, leadId: null, attemptCount: null };
	}
}

export async function markBrochureDelivered(leadId: string): Promise<void> {
	try {
		await withTimeout(
			db.execute(sql`
				UPDATE leads
				SET brochure_delivered_at = ${new Date()}, updated_at = ${new Date()}
				WHERE id = ${leadId}
			`),
			DB_TIMEOUT_MS,
			"markBrochureDelivered",
		);
	} catch (error) {
		// Non-fatal: worst case, the next attempt within the retry cooldown
		// gets treated as pending-retry instead of delivered, and a second
		// email goes out. Rare and low-cost compared to failing the request.
		console.error("[markBrochureDelivered] failed to persist delivered state:", error);
	}
}