import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/db/queries/projects";

// DELETE THIS FILE before deploying to production.
// Only for local debugging — confirms DB queries return data.
export async function GET() {
	try {
		const projects = await getPublishedProjects();
		return NextResponse.json({
			count: projects.length,
			slugs: projects.map((p) => p.slug),
			names: projects.map((p) => p.name),
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
