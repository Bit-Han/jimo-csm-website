// components/public/project-card.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

const LISTING_LABEL: Record<string, string> = {
	for_sale: "For sale",
	for_rent: "For rent",
};
const CONSTRUCTION_LABEL: Record<string, string> = {
	planning: "Planning",
	under_construction: "Under Construction",
	completed: "Completed",
};

export function ProjectCard({ project }: { project: Project }) {
	return (
		<article className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col">
			<div className="relative aspect-[4/3]">
				{project.heroImageUrl ? (
					<Image
						src={project.heroImageUrl}
						alt={project.name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gray-100" />
				)}
				<span className="absolute top-3 left-3 bg-white text-xs font-medium px-2.5 py-1 rounded-md shadow-sm">
					{LISTING_LABEL[project.listingType] ?? "For sale"}
				</span>
			</div>

			<div className="p-5 flex flex-col flex-1">
				<h3 className="text-xl font-bold text-brand-red">{project.name}</h3>
				<div className="flex items-center gap-2 mt-1.5 mb-3">
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<MapPin size={12} /> {project.location}
					</span>
					<span className="text-[10px] font-semibold bg-lime-100 text-lime-700 px-2 py-0.5 rounded">
						{CONSTRUCTION_LABEL[project.constructionStatus] ?? "Planning"}
					</span>
				</div>
				<p className="text-sm text-gray-500 line-clamp-3 flex-1">
					{project.description}
				</p>
				<Link
					href={`/projects/${project.slug}`}
					className="mt-4 inline-flex items-center gap-2 bg-brand-black text-white text-sm font-medium px-4 py-2.5 rounded-lg self-start hover:bg-black transition"
				>
					Read more <ArrowRight size={14} />
				</Link>
			</div>
		</article>
	);
}
