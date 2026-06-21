// app/api/dashboard/route.ts
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
	getDashboardStats,
	getRecentEnquiries,
	getOperationalAlerts,
	getProjectPerformanceRows,
} from "@/lib/services/dashboard.service";

export async function GET(_req: NextRequest) {
	try {
		const auth = await getAuthUser();
		if (!auth) return unauthorized();
		if (!can(auth.profile.role, "view_dashboard")) return forbidden();

		const [stats, recentEnquiries, alerts, projectRows] = await Promise.all([
			getDashboardStats(),
			getRecentEnquiries(),
			getOperationalAlerts(),
			getProjectPerformanceRows(),
		]);

		return ok({ stats, recentEnquiries, alerts, projectRows });
	} catch (err) {
		return serverError("Failed to load dashboard data.", err);
	}
}