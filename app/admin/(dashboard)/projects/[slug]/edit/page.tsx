// //@app/admin/projects/[slug]/edit/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditorShell } from "@/components/admin/projects/editor/ProjectEditorShell";
import { getAdminProjectEditorState } from "@/lib/db/queries/projects";
import { getProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";
import { mapProjectRowToDetail } from "@/lib/db/mappers/project";
import { getProjectBrochureRow } from "@/lib/db/queries/brochures";
interface AdminProjectEditPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: AdminProjectEditPageProps): Promise<Metadata> {
	const { slug } = await params;
	const row = await getAdminProjectEditorState(slug);
	return {
		title: row
			? `Edit ${row.name} | Jimo Command Centre`
			: "Edit Project | Jimo Command Centre",
	};
}

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
	const { slug } = await params;

	const [row, suggestions, initialBrochure] = await Promise.all([
		getAdminProjectEditorState(slug),
		getProjectFieldSuggestions(),
		getProjectBrochureRow(slug),
	]);

	if (!row) {
		notFound();
	}

	const project = mapProjectRowToDetail(row);

	return (
		<ProjectEditorShell
			project={project}
			mode="edit"
			suggestions={suggestions}
			initialBrochure={initialBrochure}
		/>
	);
}
