import type { Metadata } from "next";
import { ProjectEditorShell } from "@/components/admin/projects/editor/ProjectEditorShell";
import { getProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";

export const metadata: Metadata = {
	title: "New Project | Jimo Command Centre",
};


export const dynamic = 'force-dynamic';

export default async function AdminNewProjectPage() {
	const suggestions = await getProjectFieldSuggestions();

	return (
		<ProjectEditorShell
			project={null}
			mode="new"
			suggestions={suggestions}
			initialBrochure={null}
		/>
	);
}