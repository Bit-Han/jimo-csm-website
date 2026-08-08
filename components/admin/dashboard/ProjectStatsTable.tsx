// // components/admin/dashboard/ProjectStatsTable.tsx

// import { TrendingDown, TrendingUp } from "lucide-react";
// import Link from "next/link";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// import { cn } from "@/lib/utils/helpers";
// import type { AdminDisplayStatus } from "@/lib/types/admin/project";
// import type { ProjectStatRow } from "@/lib/types/admin/dashboard";

// // Covers every AdminDisplayStatus value
// const STATUS_BADGE: Record<AdminDisplayStatus, AdminBadgeVariant> = {
//    "under-development": "under-development",
// 	active: "active",
// 	completed: "completed",
// };

// export interface ProjectStatsTableProps {
//   projects: ProjectStatRow[];
// }

// export function ProjectStatsTable({ projects }: ProjectStatsTableProps) {
//   if (projects.length === 0) {
//     return (
//       <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
//         <p className="text-sm text-stone-400">
//           No projects yet.{" "}
// 			<Link
// 				href="/admin/projects/new"
// 				prefetch={false}
// 				className="font-medium text-red-600 hover:text-red-700"
// 			>
//             Add your first project →
//           </Link>
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
//       <div className="border-b border-stone-100 px-6 py-5">
//         <h2 className="text-base font-bold text-ink-950">Project Performance</h2>
//         <p className="mt-0.5 text-xs text-stone-500">
//           Lead counts from the database. Brochure and WhatsApp counts available after tracking integration.
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[560px] text-left text-sm">
//           <thead>
//             <tr className="border-b border-stone-100 bg-stone-50/60">
//               {["Project", "Leads", "Brochure", "WhatsApp", "Status", ""].map(
//                 (h) => (
//                   <th
//                     key={h}
//                     className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
//                   >
//                     {h}
//                   </th>
//                 ),
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((project) => (
//               <tr
//                 key={project.id}
//                 className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
//               >
//                 <td className="px-6 py-4 font-medium text-ink-950">
//                   {project.name}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-1.5">
//                     <span className="text-ink-950">
//                       {project.leads > 0 ? project.leads.toLocaleString() : "—"}
//                     </span>
//                     {project.leads > 0 && project.leadChangePercent !== 0 ? (
//                       <span
//                         className={cn(
//                           "flex items-center gap-0.5 text-xs font-medium",
//                           project.leadChangePercent >= 0
//                             ? "text-emerald-600"
//                             : "text-red-500",
//                         )}
//                       >
//                         {project.leadChangePercent >= 0 ? (
//                           <TrendingUp className="h-3 w-3" />
//                         ) : (
//                           <TrendingDown className="h-3 w-3" />
//                         )}
//                         {project.leadChangePercent >= 0 ? "+" : ""}
//                         {project.leadChangePercent}%
//                       </span>
//                     ) : null}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-stone-400">
//                   {project.brochures > 0 ? project.brochures : "—"}
//                 </td>
//                 <td className="px-6 py-4 text-stone-400">
//                   {project.whatsapp > 0 ? project.whatsapp : "—"}
//                 </td>
//                 <td className="px-6 py-4">
//                   <AdminBadge variant={STATUS_BADGE[project.status]} />
//                 </td>
//                 <td className="pr-6 py-4 text-right">
// 					<Link
// 						href={`/admin/projects/${project.id}/edit`}
// 						prefetch={false}
// 						className="text-xs font-medium text-red-600 hover:text-red-700"
// 					>
//                     Edit
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { ProjectStatRow } from "@/lib/types/admin/dashboard";

const STATUS_LABEL: Record<string, string> = {
	completed: "Completed",
	"under-development": "In Progress",
};

const STATUS_STYLE: Record<string, string> = {
	completed: "bg-emerald-50 text-emerald-700",
	"under-development": "bg-amber-50 text-amber-700",
};

export function ProjectStatsTable({
	projects,
}: {
	projects: ProjectStatRow[];
}) {
	if (projects.length === 0) {
		return (
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<h2 className="text-base font-bold text-ink-950">
					Project Lead Performance
				</h2>
				<p className="mt-4 text-sm text-stone-400">
					No published projects yet. Leads will appear here once projects are
					published.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
			<div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
				<h2 className="text-base font-bold text-ink-950">
					Project Lead Performance
				</h2>
				<span className="text-xs text-stone-400">Last 30 days</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px] text-sm">
					<thead>
						<tr className="border-b border-stone-100 bg-stone-50/60">
							{[
								"Project",
								"Status",
								"Leads (30 d)",
								"Change",
								"Brochures",
								"WhatsApp",
								"",
							].map((h) => (
								<th
									key={h}
									className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{projects.map((project) => {
							const isUp = project.leadChangePercent >= 0;
							return (
								<tr
									key={project.id}
									className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
								>
									<td className="px-6 py-4 font-semibold text-ink-950">
										{project.name}
									</td>
									<td className="px-6 py-4">
										<span
											className={cn(
												"inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
												STATUS_STYLE[project.status] ??
													"bg-stone-100 text-stone-600",
											)}
										>
											{STATUS_LABEL[project.status] ?? project.status}
										</span>
									</td>
									<td className="px-6 py-4 font-bold text-ink-950">
										{project.leads}
									</td>
									<td className="px-6 py-4">
										<span
											className={cn(
												"flex items-center gap-1 text-xs font-medium",
												isUp ? "text-emerald-600" : "text-red-500",
											)}
										>
											{isUp ? (
												<TrendingUp className="h-3.5 w-3.5" />
											) : (
												<TrendingDown className="h-3.5 w-3.5" />
											)}
											{isUp ? "+" : ""}
											{project.leadChangePercent}%
										</span>
									</td>
									<td className="px-6 py-4 text-stone-600">
										{project.brochures > 0 ? (
											<span className="font-medium text-emerald-600">
												{project.brochures} active
											</span>
										) : (
											<span className="text-stone-400">None</span>
										)}
									</td>
									<td className="px-6 py-4 text-stone-600">
										{project.whatsapp.toLocaleString()}
									</td>
									<td className="py-4 pr-6 text-right">
										<Link
											href="/admin/projects/"
											className="text-xs font-medium text-red-600 hover:text-red-700"
											aria-label={`View ${project.name}`}
										>
											View
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}