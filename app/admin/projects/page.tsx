// app/admin/projects/page.tsx — now a Server Component, no hook at all
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getAuthUser } from "@/lib/auth/server";
import { can } from "@/lib/utils/permissions";
import { getProjects } from "@/lib/services/projects.service";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { cn } from "@/lib/utils/helpers";

type ProjectsPageProps = {
	searchParams: Promise<{
		search?: string;
		status?: string;
		locationArea?: string;
	}>;
};

export default async function ProjectsPage({
	searchParams,
}: ProjectsPageProps) {
	const auth = await getAuthUser();
	if (!auth) redirect("/login");
	if (!can(auth.profile.role, "view_projects")) redirect("/admin");

	const filters = await searchParams;
	const { data: projects } = await getProjects(filters); // direct service call — no fetch, no API route

	const missingBrochure = projects.filter(
		(p) => p.status !== "draft" && !p.hubspotDealId,
	).length;
	const missingSeo = projects.filter(
		(p) => !p.metaTitle || !p.metaDescription,
	).length;
	const draftCount = projects.filter((p) => p.status === "draft").length;

	return (
		<div className="space-y-6 max-w-6xl">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Projects</h1>
					<p className="text-sm text-gray-500 mt-0.5">
						Manage Jimo development projects, pricing, images, brochures and
						visibility.
					</p>
				</div>
				<Link
					href="/admin/projects/new"
					className="flex items-center gap-2 bg-[#c8a84b] hover:bg-[#b8962e] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
				>
					<Plus size={15} /> Add New Project
				</Link>
			</div>

			<ProjectsTable projects={projects} currentFilters={filters} />

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{[
					{
						label: "Projects Missing Brochure",
						value: missingBrochure,
						color: "text-orange-600",
						bg: "bg-orange-50",
					},
					{
						label: "Projects Missing SEO",
						value: missingSeo,
						color: "text-blue-600",
						bg: "bg-blue-50",
					},
					{
						label: "Draft Projects",
						value: draftCount,
						color: "text-gray-600",
						bg: "bg-gray-50",
					},
				].map(({ label, value, color, bg }) => (
					<div
						key={label}
						className={cn("rounded-xl border border-gray-200 p-4", bg)}
					>
						<p className={cn("text-2xl font-bold", color)}>{value}</p>
						<p className="text-sm font-medium text-gray-800">{label}</p>
					</div>
				))}
			</div>
		</div>
	);
}