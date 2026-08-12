"use server";

import { ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads, insights, adminUsers } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { canAccessModule } from "@/lib/data/admin/roles";
import type { AdminModule } from "@/lib/types/admin/role";

export interface AdminSearchResult {
	id: string;
	module: AdminModule;
	moduleLabel: string;
	title: string;
	subtitle: string;
	href: string;
}

const RESULT_LIMIT_PER_MODULE = 5;

export async function globalAdminSearch(
	rawQuery: string,
): Promise<AdminSearchResult[]> {
	// Role is resolved from the authenticated session, never from anything
	// the client could pass in — this is the actual security boundary. The
	// UI only ever calls this with a search string, nothing else.
	const adminUser = await getAdminUser();
	if (!adminUser) return [];

	const query = rawQuery.trim().slice(0, 100);
	if (query.length < 2) return [];

	// Escapes LIKE wildcards so a search for "50% off" or "under_score"
	// isn't misread as a pattern.
	const escaped = query.replace(/[%_]/g, (c) => `\\${c}`);
	const pattern = `%${escaped}%`;

	const results: AdminSearchResult[] = [];

	// Every branch is gated on canAccessModule for THIS admin's actual
	// role. A marketing-admin searching "john" can never surface a lead
	// named John — the leads branch below simply never executes for that
	// role, so there's nothing to accidentally leak or filter after the
	// fact.
	if (canAccessModule(adminUser.role, "leads")) {
		const rows = await db
			.select({
				id: leads.id,
				fullName: leads.fullName,
				email: leads.email,
				phoneNumber: leads.phoneNumber,
			})
			.from(leads)
			.where(
				or(
					ilike(leads.fullName, pattern),
					ilike(leads.email, pattern),
					ilike(leads.phoneNumber, pattern),
				),
			)
			.limit(RESULT_LIMIT_PER_MODULE);

		results.push(
			...rows.map((r) => ({
				id: r.id,
				module: "leads" as AdminModule,
				moduleLabel: "Lead",
				title: r.fullName,
				subtitle: r.email ?? r.phoneNumber ?? "",
				href: `/admin/leads/${r.id}`,
			})),
		);
	}

	if (canAccessModule(adminUser.role, "insights")) {
		const rows = await db
			.select({
				id: insights.id,
				slug: insights.slug,
				title: insights.title,
				publishStatus: insights.publishStatus,
			})
			.from(insights)
			.where(ilike(insights.title, pattern))
			.limit(RESULT_LIMIT_PER_MODULE);

		results.push(
			...rows.map((r) => ({
				id: r.id,
				module: "insights" as AdminModule,
				moduleLabel: "Article",
				title: r.title,
				subtitle: r.publishStatus === "published" ? "Published" : "Draft",
				href: `/admin/news-insights/${r.slug}/edit`,
			})),
		);
	}

	if (canAccessModule(adminUser.role, "users-roles")) {
		const rows = await db
			.select({
				id: adminUsers.id,
				fullName: adminUsers.fullName,
				email: adminUsers.email,
			})
			.from(adminUsers)
			.where(
				or(
					ilike(adminUsers.fullName, pattern),
					ilike(adminUsers.email, pattern),
				),
			)
			.limit(RESULT_LIMIT_PER_MODULE);

		results.push(
			...rows.map((r) => ({
				id: r.id,
				module: "users-roles" as AdminModule,
				moduleLabel: "Admin User",
				title: r.fullName,
				subtitle: r.email,
				href: `/admin/users-roles`,
			})),
		);
	}

	return results;
}
