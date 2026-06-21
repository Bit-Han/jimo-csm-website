// components/public/projects/detail/ProjectAmenities.tsx
import {
	Waves,
	Dumbbell,
	Utensils,
	Sunset,
	ArrowUpDown,
	Zap,
	Shield,
	Lock,
	Car,
	Users,
	Sparkles,
	Wifi,
	Building2,
	Coffee,
	Star,
	CheckCircle2,
} from "lucide-react";

type Props = {
	amenities: string[];
};

// Map amenity name → icon
const ICON_MAP: Record<string, React.ElementType> = {
	"Swimming Pool": Waves,
	Pool: Waves,
	Gym: Dumbbell,
	Restaurant: Utensils,
	"Rooftop Lounge": Sunset,
	"Rooftop Terrace": Sunset,
	"Rooftop Pool": Waves,
	// Elevator: Elevator,
    ArrowUpDown: ArrowUpDown,
	"24/7 Power": Zap,
	"24/7 Power Supply": Zap,
	"Backup Power": Zap,
	CCTV: Shield,
	"Smart Access": Lock,
	Parking: Car,
	"Covered Parking": Car,
	"Valet Parking": Car,
	"Reception Lobby": Building2,
	"Housekeeping Support": Sparkles,
	"Managed Short-let Operations": Star,
	"Hotel-Managed Operations": Star,
	"High-Speed WiFi": Wifi,
	"Conference Rooms": Users,
	"Gym & Spa": Dumbbell,
	"24/7 Concierge": Coffee,
	"Smart Room Controls": Lock,
	"Backup Water": Zap,
	"Restaurant & Bar": Utensils,
};

function getIcon(amenity: string): React.ElementType {
	return ICON_MAP[amenity] ?? CheckCircle2;
}

export default function ProjectAmenities({ amenities }: Props) {
	return (
		<section className="w-full bg-white py-14 md:py-18">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
					Features &amp; Amenities
				</h2>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{amenities.map((amenity) => {
						const Icon = getIcon(amenity);
						return (
							<div
								key={amenity}
								className="flex flex-col items-center gap-2 p-4 border border-gray-100 rounded-sm hover:border-[#CC1718]/30 hover:bg-red-50/30 transition-colors text-center"
							>
								<Icon className="h-5 w-5 text-[#CC1718]" />
								<span className="text-xs text-gray-600 leading-snug">
									{amenity}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
