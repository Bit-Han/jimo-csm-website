import { db } from "../index";
import { brochures, projects } from "../schema";

export async function seedBrochures() {
	const projectRows = await db.query.projects.findMany();

	if (projectRows.length === 0) {
		console.log("⚠ No projects found — seed projects first.");
		return;
	}

	const bySlug = Object.fromEntries(projectRows.map((p) => [p.slug, p.id]));

	const rows = [
		{
			projectId: bySlug["vatican-court"],
			title: "Vatican Court Brochure",
			cloudinaryPublicId: "placeholder-vc-brochure",
			fileUrl: "/brochures/vatican-court.pdf",
			status: "active" as const,
		},
		{
			projectId: bySlug["jimo-residences-yaba"],
			title: "Jimo Residences Yaba Brochure",
			cloudinaryPublicId: "placeholder-jr-brochure",
			fileUrl: "/brochures/jimo-residences-yaba.pdf",
			status: "active" as const,
		},
		{
			projectId: bySlug["yaba-hospitality-hub"],
			title: "Yaba Hub Brochure",
			cloudinaryPublicId: "placeholder-yh-brochure",
			fileUrl: "/brochures/yaba-hospitality-hub.pdf",
			status: "draft" as const,
		},
	].filter(
		(r): r is typeof r & { projectId: string } =>
			typeof r.projectId === "string",
	);

	await db.insert(brochures).values(rows).onConflictDoNothing();

	console.log("✓ Brochures seed complete.");
}
