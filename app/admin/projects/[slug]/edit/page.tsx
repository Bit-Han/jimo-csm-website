import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditorShell } from "@/components/admin/projects/editor/ProjectEditorShell";
import { getProjectDetail } from "@/lib/data/project-details";

interface AdminProjectEditPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: AdminProjectEditPageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = getProjectDetail(slug);
	return {
		title: project
			? `Edit ${project.name} | Jimo Command Centre`
			: "Edit Project | Jimo Command Centre",
	};
}

export default async function AdminProjectEditPage({
	params,
}: AdminProjectEditPageProps) {
	const { slug } = await params;
	const project = getProjectDetail(slug);

	if (!project) {
		notFound();
	}

	return <ProjectEditorShell project={project} mode="edit" />;
}