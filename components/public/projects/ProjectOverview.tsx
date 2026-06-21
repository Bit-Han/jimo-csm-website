// components/public/projects/detail/ProjectOverview.tsx
import { MapPin, Tag, Home, Hammer } from "lucide-react";
import {
	type SeedProject,
	getListingLabel,
	getConstructionLabel,
} from "@/lib/data/seed-projects";

type Props = { project: SeedProject };

export default function ProjectOverview({ project }: Props) {
	const stats = [
		{
			icon: MapPin,
			label: "Location Area",
			value: project.locationArea,
		},
		{
			icon: Tag,
			label: "Listing Type",
			value: getListingLabel(project.listingType),
		},
		{
			icon: Home,
			label: "Project Type",
			value:
				project.type.charAt(0).toUpperCase() +
				project.type.slice(1).replace("_", " "),
		},
		{
			icon: Hammer,
			label: "Construction Status",
			value: getConstructionLabel(project.constructionStatus),
		},
	];

	return (
		<section className="w-full bg-white py-14 md:py-18">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl">
					{/* Heading */}
					<h2 className="text-2xl md:text-3xl font-bold text-[#CC1718]">
						Project Overview
					</h2>

					{/* Description */}
					<div className="mt-5 space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
						<p>{project.description}</p>
					</div>

					{/* Mini stats row */}
					<div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.label}
									className="border border-gray-100 rounded-sm px-4 py-3 flex flex-col gap-1.5"
								>
									<div className="flex items-center gap-1.5">
										<Icon className="h-3.5 w-3.5 text-[#CC1718]" />
										<span className="text-xs text-gray-400">{stat.label}</span>
									</div>
									<span className="text-sm font-semibold text-gray-900">
										{stat.value}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
