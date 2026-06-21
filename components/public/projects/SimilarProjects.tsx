// components/public/projects/detail/SimilarProjects.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import {
	type SeedProject,
	getListingLabel,
	getStatusLabel,
} from "@/lib/data/seed-projects";

type Props = { projects: SeedProject[] };

export default function SimilarProjects({ projects }: Props) {
	if (!projects.length) return null;

	return (
		<section className="w-full bg-white py-14 md:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl md:text-3xl font-bold text-[#CC1718] mb-10">
					Similar Projects
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => {
						const listingLabel = getListingLabel(project.listingType);
						const { label: statusLabel, color: statusColor } = getStatusLabel(
							project.status,
						);

						return (
							<div
								key={project.id}
								className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
							>
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
									<h3 className="text-base font-bold text-[#CC1718]">
										{project.name}
									</h3>

									<div className="flex items-center gap-2 mt-1.5 flex-wrap">
										<MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
										<span className="text-xs text-gray-500">
											{project.location}
										</span>
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
					})}
				</div>
			</div>
		</section>
	);
}
