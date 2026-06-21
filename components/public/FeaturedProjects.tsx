// // components/public/home/featured-projects-section.tsx
// import Link from "next/link";
// import { ProjectCard } from "./ProjectCard";
// import { getPublishedProjects } from "@/lib/services/projects.service";

// export async function FeaturedProjectsSection() {
// 	const allProjects = await getPublishedProjects();
// 	const featured = allProjects.filter((p) => p.isFeatured).slice(0, 3);
// 	const projectsToShow =
// 		featured.length > 0 ? featured : allProjects.slice(0, 3);

// 	if (projectsToShow.length === 0) return null;

// 	return (
// 		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// 			<div className="flex items-center justify-between mb-8">
// 				<h2 className="text-3xl font-extrabold text-brand-red">
// 					Featured Projects
// 				</h2>
// 				<Link
// 					href="/projects"
// 					className="bg-brand-black text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-black transition inline-flex items-center gap-2"
// 				>
// 					See all →
// 				</Link>
// 			</div>
// 			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// 				{projectsToShow.map((project) => (
// 					<ProjectCard key={project.id} project={project} />
// 				))}
// 			</div>
// 		</section>
// 	);
// }



// components/public/home/FeaturedProjects.tsx
import Link from "next/link";
import Image from "next/image";
import {
  type SeedProject,
  formatNaira,
  getListingLabel,
  getStatusLabel,
} from "@/lib/data/seed-projects";
import { MapPin } from "lucide-react";

type Props = {
  projects: SeedProject[];
};

export default function FeaturedProjects({ projects }: Props) {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#CC1718]">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            See all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: SeedProject }) {
  const listingLabel = getListingLabel(project.listingType);
  const { label: statusLabel, color: statusColor } = getStatusLabel(
    project.status
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
        {/* Listing Badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-gray-700 text-xs font-medium rounded-sm backdrop-blur-sm">
          {listingLabel}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#CC1718]">{project.name}</h3>

        <div className="flex items-center gap-2 mt-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
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