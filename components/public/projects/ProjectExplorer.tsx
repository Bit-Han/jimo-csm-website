"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { projectFilters } from "@/lib/data/project-filters";
import { cn } from "@/lib/utils/helpers";
import type { Project, ProjectFilterId } from "@/lib/types/project";

export interface ProjectsExplorerProps {
	projects: Project[];
}

function matchesFilter(project: Project, filterId: ProjectFilterId): boolean {
	if (filterId === "all") {
		return true;
	}

	if (
		filterId === "completed" ||
		filterId === "under-development"
	) {
		return project.status === filterId;
	}

	return project.category.includes(filterId);
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
	const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");

	const visibleProjects = projects.filter((project) =>
		matchesFilter(project, activeFilter),
	);

	return (
		<div>
			<div className="flex flex-wrap gap-3">
				{projectFilters.map((filter) => {
					const isActive = filter.id === activeFilter;

					return (
						<button
							key={filter.id}
							type="button"
							onClick={() => setActiveFilter(filter.id)}
							aria-pressed={isActive}
							className={cn(
								"rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
								isActive
									? "border-red-600 bg-red-600 text-white"
									: "border-stone-200 bg-white text-ink-950 hover:border-red-200 hover:bg-red-50",
							)}
						>
							{filter.label}
						</button>
					);
				})}
			</div>

			{visibleProjects.length > 0 ? (
				<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{visibleProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			) : (
				<p className="mt-10 rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
					No projects match this filter yet. Check back soon as new developments
					are added.
				</p>
			)}
		</div>
	);
}
