// components/public/projects/ProjectsListing.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	type SeedProject,
	getListingLabel,
	getStatusLabel,
} from "@/lib/data/seed-projects";
import { MapPin } from "lucide-react";

type FilterType = "all" | "for_sale" | "for_rent";

const FILTERS: { label: string; value: FilterType }[] = [
	{ label: "All", value: "all" },
	{ label: "For rent", value: "for_rent" },
	{ label: "For sale", value: "for_sale" },
];

type Props = { projects: SeedProject[] };

export default function ProjectsListing({ projects }: Props) {
	const [active, setActive] = useState<FilterType>("all");

	const filtered =
		active === "all"
			? projects
			: projects.filter((p) => p.listingType === active);

	return (
		<>
			{/* Page Header */}
			<section className="w-full bg-white pt-14 pb-10 md:pt-20 md:pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-4xl md:text-5xl font-bold text-[#CC1718] leading-tight">
						Our Projects
					</h1>
					<p className="mt-3 text-sm md:text-base text-gray-600 max-w-md leading-relaxed">
						Developing Premium Real Estate with Structure, Insight, and
						Long-Term Value
					</p>

					{/* Filter Tabs */}
					<div className="flex items-center gap-1 mt-10">
						{FILTERS.map((f) => (
							<button
								key={f.value}
								onClick={() => setActive(f.value)}
								className={`px-5 py-2 text-sm font-medium rounded-sm transition-colors ${
									active === f.value
										? "bg-gray-900 text-white"
										: "text-gray-500 hover:text-gray-900"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Projects Grid */}
			<section className="w-full bg-white pb-20 md:pb-28">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{filtered.length === 0 ? (
						<div className="py-20 text-center">
							<p className="text-gray-500 text-sm">
								No projects found for this filter.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filtered.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}

function ProjectCard({ project }: { project: SeedProject }) {
	const listingLabel = getListingLabel(project.listingType);
	const { label: statusLabel, color: statusColor } = getStatusLabel(
		project.status,
	);

	return (
		<div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			{/* Image */}
			<div className="relative aspect-[4/3] overflow-hidden">
				<Image
					src={project.heroImageUrl}
					alt={project.name}
					fill
					className="object-cover object-center hover:scale-105 transition-transform duration-500"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				<span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-gray-700 text-xs font-medium rounded-sm backdrop-blur-sm">
					{listingLabel}
				</span>
			</div>

			{/* Body */}
			<div className="p-5">
				<h2 className="text-lg font-bold text-[#CC1718]">{project.name}</h2>

				<div className="flex items-center gap-2 mt-1.5 flex-wrap">
					<MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
					<span className="text-xs text-gray-500">{project.location}</span>
					<span
						className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}
					>
						{statusLabel}
					</span>
				</div>

				<p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
					{project.description}
				</p>

				<div className="mt-5">
					<Link
						href={`/projects/${project.slug}`}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors"
					>
						Read more <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
