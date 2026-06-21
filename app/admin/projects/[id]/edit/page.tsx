// // app/admin/projects/[id]/edit/page.tsx
// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import { useProject } from "@/hooks/use-projects";
// import {
// 	ProjectEditorTabs,
// 	type TabKey,
// } from "@/components/projects/project-editor-tabs";
// import { BasicInfoTab } from "@/components/projects/tabs/BasicInfoTab";
// import { UnitsPricingTab } from "@/components/projects/tabs/UnitsPricingTab";
// import { formatRelativeTime } from "@/lib/utils/helpers";

// export default function ProjectEditorPage() {
// 	const params = useParams<{ id: string }>();
// 	const projectId = params.id;
// 	const {
// 		project,
// 		loading,
// 		error,
// 		updateProjectDetail,
// 		updateUnit,
// 		addUnit,
// 		refetch,
// 	} = useProject(projectId);

// 	const [activeTab, setActiveTab] = useState<TabKey>("basic_info");
// 	const [saving, setSaving] = useState(false);

// 	async function handleSaveDraft() {
// 		if (!project) return;
// 		setSaving(true);
// 		await updateProjectDetail({ status: "draft" });
// 		setSaving(false);
// 	}

// 	async function handlePublish() {
// 		if (!project) return;
// 		setSaving(true);
// 		await updateProjectDetail({ status: "active" });
// 		await refetch();
// 		setSaving(false);
// 	}

// 	if (loading)
// 		return <div className="p-8 text-sm text-gray-500">Loading project…</div>;
// 	if (error || !project)
// 		return (
// 			<div className="p-8 text-sm text-red-600">
// 				{error ?? "Project not found."}
// 			</div>
// 		);

// 	return (
// 		<div className="space-y-6 max-w-7xl">
// 			<div className="flex items-center justify-between">
// 				<div>
// 					<h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
// 					<p className="text-sm text-gray-500 mt-0.5">
// 						{project.name} • Last edited {formatRelativeTime(project.updatedAt)}
// 					</p>
// 				</div>
// 				<div className="flex items-center gap-2">
// 					<button
// 						onClick={handleSaveDraft}
// 						disabled={saving}
// 						className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
// 					>
// 						Save Draft
// 					</button>
// 					<a
// 						href={`/projects/${project.slug}`}
// 						target="_blank"
// 						rel="noreferrer"
// 						className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
// 					>
// 						Preview
// 					</a>
// 					<button
// 						onClick={handlePublish}
// 						disabled={saving}
// 						className="px-5 py-2.5 text-sm font-semibold bg-[#c8a84b] hover:bg-[#b8962e] text-white rounded-lg transition disabled:opacity-60"
// 					>
// 						{saving ? "Publishing…" : "Publish ▾"}
// 					</button>
// 				</div>
// 			</div>

// 			<ProjectEditorTabs activeTab={activeTab} onChange={setActiveTab} />

// 			{activeTab === "basic_info" && (
// 				<BasicInfoTab project={project} onSave={updateProjectDetail} />
// 			)}
// 			{activeTab === "units_pricing" && (
// 				<UnitsPricingTab
// 					project={project}
// 					onUpdateUnit={updateUnit}
// 					onAddUnit={addUnit}
// 				/>
// 			)}
// 		</div>
// 	);
// }


// app/admin/projects/[id]/edit/page.tsx — unchanged from before, already a
// Server Component, already calling the service directly
import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { getProjectById } from "@/lib/services/projects.service";
import { ProjectEditorShell } from "@/components/projects/ProjectEditorShell";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectEditorPage({ params }: Props) {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");
  if (!can(auth.profile.role, "view_projects")) redirect("/admin");

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return <ProjectEditorShell project={project} canEditPricing={can(auth.profile.role, "edit_pricing")} />;
}