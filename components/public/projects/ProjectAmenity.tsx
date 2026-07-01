// import type { ProjectAmenity } from "@/lib/types/project-detail";

// export interface AmenitiesListProps {
// 	amenities: ProjectAmenity[];
// }

// export function ProjectAmenities({ amenities }: AmenitiesListProps) {
// 	return (
// 		<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
// 			{amenities.map((amenity) => (
// 				<div
// 					key={amenity.id}
// 					className="
// 						flex items-center justify-center
// 						rounded-xl border border-cream-50
// 						bg-red-100 px-4 py-4
// 						text-center shadow-sm
// 						transition-all duration-300
// 						hover:shadow-md"
// 				>
// 					<span className="text-sm font-medium text-stone-600">
// 						{amenity.label}
// 					</span>
// 				</div>
// 			))}
// 		</div>
// 	);
// }

import { amenityIconMap } from "@/lib/data/amenity-icons";
import type { ProjectAmenity } from "@/lib/types/project-detail";

export interface AmenitiesListProps {
	amenities: ProjectAmenity[];
}

export function ProjectAmenities({ amenities }: AmenitiesListProps) {
	return (
		<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{amenities.map((amenity) => {
				const Icon = amenityIconMap[amenity.icon];

				return (
					<div
						key={amenity.id}
						className="
							flex items-center justify-center gap-2
							rounded-xl border border-cream-50
							bg-red-100 px-4 py-4
							text-center shadow-sm
							transition-all duration-300
							hover:shadow-md"
					>
						<Icon className="h-4 w-4 shrink-0 text-red-700" />
						<span className="text-sm font-medium text-stone-600">
							{amenity.label}
						</span>
					</div>
				);
			})}
		</div>
	);
}