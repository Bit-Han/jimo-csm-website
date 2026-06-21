// app/api/leads/export/route.ts
// Returns a CSV of leads matching the current filters
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { unauthorized, forbidden, serverError } from "@/lib/utils/api-response";
import { getLeads } from "@/lib/services/leads.service";
import { formatNaira, formatDate } from "@/lib/utils/helpers";

export async function GET(req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "export_leads")) return forbidden();

		const { searchParams } = req.nextUrl;
		const { data } = await getLeads(
			{
				projectId: searchParams.get("projectId") ?? undefined,
				status: searchParams.get("status") ?? undefined,
			},
			{ pageSize: 10000 }, // export all matching
		);

		const headers = [
			"Name",
			"Phone",
			"Email",
			"Project",
			"Unit Interest",
			"Budget",
			"Source",
			"Status",
			"Assigned To",
			"Date",
		];

		const rows = data.map((lead) => [
			lead.name,
			lead.phone,
			lead.email ?? "",
			(lead as Record<string, unknown>).project
				? ((lead as Record<string, unknown>).project as { name: string }).name
				: "",
			lead.unitInterest ?? "",
			lead.budgetMinKobo && lead.budgetMaxKobo
				? `${formatNaira(lead.budgetMinKobo)}-${formatNaira(lead.budgetMaxKobo)}`
				: "",
			lead.source,
			lead.status,
			(lead as Record<string, unknown>).assignedTo
				? ((lead as Record<string, unknown>).assignedTo as { name: string })
						.name
				: "Unassigned",
			formatDate(lead.createdAt),
		]);

		const csv = [headers, ...rows]
			.map((row) =>
				row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
			)
			.join("\n");

		return new NextResponse(csv, {
			status: 200,
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="jimo-leads-${Date.now()}.csv"`,
			},
		});
	} catch (err) {
		return serverError("Failed to export leads.", err);
	}
}
