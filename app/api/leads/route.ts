// app/api/leads/route.ts
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
import { getLeads, createLead } from "@/lib/services/leads.service";
import { submitLeadSchema } from "@/lib/validations/leads";
import { parseIntParam } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		// Public lead submissions don't need auth — only listing does
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_leads")) return forbidden();

		const { searchParams } = req.nextUrl;

		// Sales/CRM role can only see their own assigned leads
		const assignedToFilter =
			auth.profile.role === "sales_crm"
				? auth.profile.id
				: (searchParams.get("assignedTo") ?? undefined);

		const { data, meta } = await getLeads(
			{
				projectId: searchParams.get("projectId") ?? undefined,
				status: searchParams.get("status") ?? undefined,
				search: searchParams.get("search") ?? undefined,
				assignedTo: assignedToFilter,
				dateFrom: searchParams.get("dateFrom")
					? new Date(searchParams.get("dateFrom")!)
					: undefined,
				dateTo: searchParams.get("dateTo")
					? new Date(searchParams.get("dateTo")!)
					: undefined,
			},
			{
				page: parseIntParam(searchParams.get("page"), 1),
				pageSize: parseIntParam(searchParams.get("pageSize"), 25),
				sortOrder: "desc",
			},
		);
		return ok(data, meta);
	} catch (err) {
		return serverError("Failed to load leads.", err);
	}
}

/**
 * POST /api/leads — public endpoint for anonymous form submissions.
 * No auth required. Rate-limited by middleware (add next-rate-limit if needed).
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = submitLeadSchema.safeParse(body);
		if (!parsed.success) {
			return badRequest(parsed.error.issues[0]?.message ?? "Validation failed");
		}

		// Capture IP for fraud detection
		const ip =
			req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
			req.headers.get("x-real-ip") ??
			undefined;

		const lead = await createLead({ ...parsed.data, ipAddress: ip });
		return created({ id: lead.id, message: "Enquiry received successfully." });
	} catch (err) {
		return serverError("Failed to submit enquiry.", err);
	}
}
