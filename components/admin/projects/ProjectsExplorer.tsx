"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  MoreHorizontal,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { cn } from "@/lib/utils/helpers";
import type {
  AdminDisplayStatus,
  AdminProjectListRow,
  ProjectAdminFilterState,
} from "@/lib/types/admin/project";

const STATUS_OPTIONS = [
  { value: "all", label: "Status — All" },
  { value: "under-development", label: "Under Development" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const STATUS_BADGE: Record<AdminDisplayStatus, AdminBadgeVariant> = {
  active: "active",
  "under-development": "under-development",
  completed: "completed",
};

const selectCn =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:opacity-50";

export interface ProjectsExplorerProps {
  projects: AdminProjectListRow[];
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [filters, setFilters] = useState<ProjectAdminFilterState>({
    search: "",
    status: "all",
    location: "all",
  });

  const uniqueLocations = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" || p.adminStatus === filters.status;
      const matchesLocation =
        filters.location === "all" || p.location === filters.location;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [projects, filters]);

  function set<K extends keyof ProjectAdminFilterState>(
    key: K,
    value: ProjectAdminFilterState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
          className={selectCn}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className={selectCn}
        >
          <option value="all">Location — All</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Visual-only — functional once unit/price data is structured */}
        <select className={selectCn} disabled>
          <option>Project Type</option>
        </select>
        <select className={selectCn} disabled>
          <option>Unit Type</option>
        </select>
        <select className={selectCn} disabled>
          <option>Price Range</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
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
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-stone-400"
                  >
                    No projects match your current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
                  >
                    <td className="px-5 py-4 font-semibold text-ink-950">
                      {project.name}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {project.location}
                    </td>
                    <td className="px-5 py-4">
                      <AdminBadge variant={STATUS_BADGE[project.adminStatus]} />
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {project.startingPrice}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-ink-950">
                          {project.leads > 0
                            ? project.leads.toLocaleString()
                            : "—"}
                        </span>
                        {project.leads > 0 && (
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
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-stone-600">{project.lastUpdatedDate}</p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {project.lastUpdatedBy}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/projects/${project.slug}/edit`}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-ink-950"
                        >
                          Preview
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <button
                          type="button"
                          aria-label={`More options for ${project.name}`}
                          className="text-stone-400 transition-colors hover:text-ink-950"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}