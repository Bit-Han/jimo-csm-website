import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

// DELETE before deploying to production.
export async function GET() {
	try {
		const rows = await db
			.select({
				id: leads.id,
				fullName: leads.fullName,
				email: leads.email,
				source: leads.source,
				status: leads.status,
				projectSlug: leads.projectSlug,
				createdAt: leads.createdAt,
			})
			.from(leads)
			.orderBy(desc(leads.createdAt))
			.limit(10);

		return NextResponse.json({ count: rows.length, recent: rows });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
