import type { ProjectAmenity } from "@/lib/types/project-detail";

export interface AmenitiesListProps {
	amenities: ProjectAmenity[];
}

export function ProjectAmenities({ amenities }: AmenitiesListProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{amenities.map((amenity) => (
				<span
					key={amenity.id}
					className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium text-stone-600"
				>
					{amenity.label}
				</span>
			))}
		</div>
	);
}
