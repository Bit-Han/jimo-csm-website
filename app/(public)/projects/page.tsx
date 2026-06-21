// // app/(public)/projects/page.tsx
// import type { Metadata } from "next";
// import { ProjectCard } from "@/components/public/ProjectCard";
// import { ListingFilterTabs } from "@/components/public/ListingFilterTabs";
// import { getPublishedProjects } from "@/lib/services/projects.service";

// export const metadata: Metadata = {
// 	title: "Our Projects",
// 	description:
// 		"Developing Premium Real Estate with Structure, Insight, and Long-Term Value.",
// };

// export default async function ProjectsPage({
// 	searchParams,
// }: {
// 	searchParams: Promise<{ listing?: string }>;
// }) {
// 	const { listing } = await searchParams;
// 	const projects = await getPublishedProjects(
// 		listing === "for_sale" || listing === "for_rent"
// 			? { listingType: listing }
// 			: {},
// 	);

// 	return (
// 		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
// 			<h1 className="text-4xl sm:text-5xl font-extrabold text-brand-red">
// 				Our Projects
// 			</h1>
// 			<p className="text-gray-500 mt-3 max-w-lg">
// 				Developing Premium Real Estate with Structure, Insight, and Long-Term
// 				Value
// 			</p>

// 			<div className="mt-8 mb-8">
// 				<ListingFilterTabs active={listing} />
// 			</div>

// 			{projects.length === 0 ? (
// 				<p className="text-gray-400 py-12 text-center">No projects found.</p>
// 			) : (
// 				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// 					{projects.map((project) => (
// 						<ProjectCard key={project.id} project={project} />
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	);
// }



// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { projects } from '@/lib/data/mock-data';
// import { MapPin, ChevronRight } from 'lucide-react';

// export default function ProjectsPage() {
//   const [activeFilter, setActiveFilter] = useState('All');

//   const filteredProjects = projects.filter((project) => {
//     if (activeFilter === 'All') return true;
//     if (activeFilter === 'For rent') return project.features[1].value === 'For Rent';
//     if (activeFilter === 'For sale') return project.features[1].value === 'For Sale';
//     return true;
//   });

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="min-h-[400px] bg-gradient-to-b from-gray-100 to-white flex items-center py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto w-full">
//           <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-6">Our Projects</h1>
//           <p className="text-lg text-gray-700">
//             Developing Premium Real Estate with Structure, Insight, and Long-Term Value
//           </p>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           {/* Filter Tabs */}
//           <div className="flex gap-4 mb-12 border-b border-gray-200">
//             {['All', 'For rent', 'For sale'].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`px-4 py-3 font-medium transition-colors border-b-2 ${
//                   activeFilter === filter
//                     ? 'border-red-600 text-red-600'
//                     : 'border-transparent text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>

//           {/* Projects Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredProjects.map((project) => (
//               <Link
//                 key={project.id}
//                 href={`/projects/${project.id}`}
//                 className="group cursor-pointer"
//               >
//                 <div className="mb-4 bg-gray-300 h-64 rounded-lg overflow-hidden relative">
//                   <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
//                     <span className="text-gray-500">Project Image</span>
//                   </div>
//                   {project.categoryBadges.length > 0 && (
//                     <div className="absolute top-3 left-3 flex gap-2">
//                       {project.categoryBadges.map((badge, idx) => (
//                         <span
//                           key={idx}
//                           className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded"
//                         >
//                           {badge}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
//                   {project.name}
//                 </h3>

//                 <div className="flex items-center gap-1 text-gray-600 mb-3">
//                   <MapPin size={16} />
//                   <span className="text-sm">{project.location}</span>
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                   {project.description}
//                 </p>

//                 <button className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
//                   Read more <ChevronRight size={16} />
//                 </button>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }


// app/(public)/projects/page.tsx
import type { Metadata } from "next";
import ProjectsListing from "@/components/public/projects/ProjectsListing";
import { SEED_PROJECTS } from "@/lib/data/seed-projects";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Jimo Property Development's premium residential, hospitality and investment-led projects across Lagos.",
};

export default function ProjectsPage() {
  return <ProjectsListing projects={SEED_PROJECTS} />;
}