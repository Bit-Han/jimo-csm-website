import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditorShell } from "@/components/admin/projects/editor/ProjectEditorShell";
import { getAdminProjectEditorState } from "@/lib/db/queries/projects";
import { mapProjectRowToDetail } from "@/lib/db/mappers/project";

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

export default async function AdminProjectEditPage({
	params,
}: AdminProjectEditPageProps) {
	const { slug } = await params;

	// ← This was the bug: previously called getProjectDetail(slug) from the
	//   static lib/data/project-details.ts file. Now reads from Supabase.
	const row = await getAdminProjectEditorState(slug);

	if (!row) {
		notFound();
	}

	const project = mapProjectRowToDetail(row);

	return <ProjectEditorShell project={project} mode="edit" />;
}