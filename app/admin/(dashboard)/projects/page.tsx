
//@app/admin/projects/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectsExplorer } from "@/components/admin/projects/ProjectsExplorer";
import { ProjectSummaryCards } from "@/components/admin/projects/ProjectSummaryCards";
import {
	getAdminProjectRows,
	getAdminProjectSummaryStats,
} from "@/lib/data/admin/projects";

export const metadata: Metadata = {
	title: "Projects | Jimo Command Centre",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
	const [projectRows, summaryStats] = await Promise.all([
		getAdminProjectRows(),
		getAdminProjectSummaryStats(),
	]);

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Projects"
				description="Manage Jimo development projects, pricing, images, brochures and visibility."
				action={
					<Link
						href="/admin/projects/new"
						className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
					>
						<Plus className="h-4 w-4" />
						Add New Project
					</Link>
				}
			/>
			<ProjectsExplorer projects={projectRows} />
			<ProjectSummaryCards stats={summaryStats} />
		</div>
	);
}