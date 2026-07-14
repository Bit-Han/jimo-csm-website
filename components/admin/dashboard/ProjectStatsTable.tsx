// import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
// import { cn } from "@/lib/utils/helpers";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// import type {
// 	AdminProjectStatus,
// 	ProjectStatRow,
// } from "@/lib/types/admin/dashboard";

// const statusVariant: Record<AdminProjectStatus, AdminBadgeVariant> = {
// 	"under-development": "under-development",
// 	active: "active",
// 	completed: "completed",
// };

// export interface ProjectStatsTableProps {
// 	projects: ProjectStatRow[];
// }

// export function ProjectStatsTable({ projects }: ProjectStatsTableProps) {
// 	return (
// 		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
// 			<div className="border-b border-stone-100 px-6 py-5">
// 				<h2 className="text-base font-bold text-ink-950">
// 					Project Performance
// 				</h2>
// 			</div>

// 			<div className="overflow-x-auto">
// 				<table className="w-full min-w-[560px] text-left text-sm">
// 					<thead>
// 						<tr className="border-b border-stone-100">
// 							{["Project", "Leads", "Brochure", "WhatsApp", "Status", ""].map(
// 								(heading) => (
// 									<th
// 										key={heading}
// 										className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500 first:pl-6 last:pr-6"
// 									>
// 										{heading}
// 									</th>
// 								),
// 							)}
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{projects.map((project) => (
// 							<tr
// 								key={project.id}
// 								className="border-b border-stone-100 last:border-none"
// 							>
// 								<td className="px-6 py-4 font-medium text-ink-950">
// 									{project.name}
// 								</td>
// 								<td className="px-6 py-4">
// 									<div className="flex items-center gap-1.5">
// 										<span className="text-ink-950">{project.leads}</span>
// 										<span
// 											className={cn(
// 												"flex items-center gap-0.5 text-xs font-medium",
// 												project.leadChangePercent >= 0
// 													? "text-emerald-600"
// 													: "text-red-500",
// 											)}
// 										>
// 											{project.leadChangePercent >= 0 ? (
// 												<TrendingUp className="h-3 w-3" />
// 											) : (
// 												<TrendingDown className="h-3 w-3" />
// 											)}
// 											{project.leadChangePercent >= 0 ? "+" : ""}
// 											{project.leadChangePercent}%
// 										</span>
// 									</div>
// 								</td>
// 								<td className="px-6 py-4 text-stone-600">
// 									{project.brochures}
// 								</td>
// 								<td className="px-6 py-4 text-stone-600">{project.whatsapp}</td>
// 								<td className="px-6 py-4">
// 									<AdminBadge variant={statusVariant[project.status]} />
// 								</td>
// 								<td className="pr-6 py-4 text-right">
// 									<button
// 										type="button"
// 										aria-label={`More actions for ${project.name}`}
// 										className="text-stone-400 transition-colors hover:text-ink-950"
// 									>
// 										<MoreHorizontal className="h-4 w-4" />
// 									</button>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	);
// }


import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { cn } from "@/lib/utils/helpers";
import type { AdminDisplayStatus } from "@/lib/types/admin/project";
import type { ProjectStatRow } from "@/lib/types/admin/dashboard";

// Covers every AdminDisplayStatus value
const STATUS_BADGE: Record<AdminDisplayStatus, AdminBadgeVariant> = {
   "under-development": "under-development",
	active: "active",
	completed: "completed",
};

export interface ProjectStatsTableProps {
  projects: ProjectStatRow[];
}

export function ProjectStatsTable({ projects }: ProjectStatsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-sm text-stone-400">
          No projects yet.{" "}
          <Link
            href="/admin/projects/new"
            className="font-medium text-red-600 hover:text-red-700"
          >
            Add your first project →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="border-b border-stone-100 px-6 py-5">
        <h2 className="text-base font-bold text-ink-950">Project Performance</h2>
        <p className="mt-0.5 text-xs text-stone-500">
          Lead counts from the database. Brochure and WhatsApp counts available after tracking integration.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/60">
              {["Project", "Leads", "Brochure", "WhatsApp", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
              >
                <td className="px-6 py-4 font-medium text-ink-950">
                  {project.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-950">
                      {project.leads > 0 ? project.leads.toLocaleString() : "—"}
                    </span>
                    {project.leads > 0 && project.leadChangePercent !== 0 ? (
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-medium",
                          project.leadChangePercent >= 0
                            ? "text-emerald-600"
                            : "text-red-500",
                        )}
                      >
                        {project.leadChangePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {project.leadChangePercent >= 0 ? "+" : ""}
                        {project.leadChangePercent}%
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-400">
                  {project.brochures > 0 ? project.brochures : "—"}
                </td>
                <td className="px-6 py-4 text-stone-400">
                  {project.whatsapp > 0 ? project.whatsapp : "—"}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={STATUS_BADGE[project.status]} />
                </td>
                <td className="pr-6 py-4 text-right">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}