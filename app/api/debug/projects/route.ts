import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { getPublishedProjects } from "@/lib/db/queries/projects";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export async function GET() {
	const adminUser = await getAdminUser();
	if (!adminUser)
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

	const allRows = await db
		.select({
			id: projects.id,
			slug: projects.slug,
			name: projects.name,
			publishStatus: projects.publishStatus,
			coverImageSrc: projects.coverImageSrc,
			updatedAt: projects.updatedAt,
		})
		.from(projects);

	let publishedViaQuery: unknown[] = [];
	let queryError: string | null = null;
	try {
		publishedViaQuery = await getPublishedProjects();
	} catch (err) {
		queryError = err instanceof Error ? err.message : String(err);
	}

	return NextResponse.json({
		totalRowsInDb: allRows.length,
		allRows,
		publishedCountRaw: allRows.filter((r) => r.publishStatus === "published")
			.length,
		publishedViaGetPublishedProjectsQuery: publishedViaQuery,
		queryErrorIfAny: queryError,
	});
}
