// components/projects/projects-table.tsx — only the genuinely interactive
// bits (search typing, delete confirm) need to be a Client Component
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MoreHorizontal, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatNaira, formatRelativeTime, cn } from "@/lib/utils/helpers";
import { deleteProjectAction } from "@/lib/actions/projects.actions";
import type { ProjectListItem } from "@/lib/types";

const STATUS_OPTIONS = [
	"All",
	"Selling Now",
	"Active",
	"Pre-launch",
	"Draft",
	"Sold Out",
];
const STATUS_VALUES: Record<string, string> = {
	"Selling Now": "selling_now",
	"Active": "active",
	"Pre-launch": "pre_launch",
	"Draft": "draft",
	"Sold Out": "sold_out",
};

type ProjectsTableProps = {
	projects: ProjectListItem[];
	currentFilters: { search?: string; status?: string; locationArea?: string };
};

export function ProjectsTable({
	projects,
	currentFilters,
}: ProjectsTableProps) {
	const router = useRouter();
	const [search, setSearch] = useState(currentFilters.search ?? "");
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function updateSearchParams(patch: Record<string, string | undefined>) {
		const merged = { ...currentFilters, search, ...patch };
		const params = new URLSearchParams();
		Object.entries(merged).forEach(([k, v]) => {
			if (v) params.set(k, v);
		});
		startTransition(() => router.push(`/admin/projects?${params}`));
	}

	async function handleDelete(id: string) {
		if (
			!confirm(
				"Are you sure you want to delete this project? This cannot be undone.",
			)
		)
			return;
		setDeleting(id);
		await deleteProjectAction(id);
		setDeleting(null);
		setActiveMenu(null);
		startTransition(() => router.refresh());
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative">
					<Search
						size={13}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						placeholder="Search projects... (press Enter)"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) =>
							e.key === "Enter" && updateSearchParams({ search })
						}
						className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c8a84b]/30 w-64"
					/>
				</div>
				<select
					value={currentFilters.status ?? ""}
					onChange={(e) =>
						updateSearchParams({ status: STATUS_VALUES[e.target.value] })
					}
					className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
				>
					{STATUS_OPTIONS.map((s) => (
						<option key={s} value={s === "All" ? "" : s}>
							{s === "All" ? "Status — All" : s}
						</option>
					))}
				</select>
			</div>

			<div
				className={cn(
					"bg-white rounded-xl border border-gray-200 overflow-hidden transition-opacity",
					isPending && "opacity-50",
				)}
			>
				{projects.length === 0 ? (
					<div className="p-8 text-center text-sm text-gray-500">
						No projects found.
					</div>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100">
								{[
									"Project",
									"Location",
									"Status",
									"Starting Price",
									"Leads",
									"Last Updated",
									"Actions",
								].map((h) => (
									<th
										key={h}
										className="text-left text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{projects.map((project) => (
								<tr
									key={project.id}
									className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
								>
									<td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">
										{project.name}
									</td>
									<td className="px-4 py-3 text-gray-600 text-xs">
										{project.location}
									</td>
									<td className="px-4 py-3">
										<StatusBadge status={project.status} />
									</td>
									<td className="px-4 py-3 text-gray-600">
										{project.startingPriceKobo
											? formatNaira(project.startingPriceKobo)
											: "—"}
									</td>
									<td className="px-4 py-3 text-gray-600">
										{project.leadsCount}
									</td>
									<td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
										{formatRelativeTime(project.updatedAt)}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											<Link
												href={`/admin/projects/${project.id}/edit`}
												className="text-xs text-[#c8a84b] font-medium hover:underline"
											>
												Edit
											</Link>
											<a
												href={`/projects/${project.slug}`}
												target="_blank"
												rel="noreferrer"
												className="text-xs text-gray-500 hover:text-gray-700 font-medium hover:underline"
											>
												Preview
											</a>
											<div className="relative">
												<button
													onClick={() =>
														setActiveMenu(
															activeMenu === project.id ? null : project.id,
														)
													}
													className="p-1 rounded hover:bg-gray-100 transition"
												>
													<MoreHorizontal size={14} className="text-gray-400" />
												</button>
												{activeMenu === project.id && (
													<div className="absolute right-0 top-6 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
														<button
															onClick={() => handleDelete(project.id)}
															disabled={deleting === project.id}
															className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
														>
															<Trash2 size={12} />{" "}
															{deleting === project.id ? "Deleting…" : "Delete"}
														</button>
													</div>
												)}
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</>
	);
}
