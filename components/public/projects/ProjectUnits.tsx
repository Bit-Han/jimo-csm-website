// // components/public/projects/detail/ProjectCTABar.tsx
// "use client";

// import { Phone, MessageCircle } from "lucide-react";
// import type { SeedProject } from "@/lib/data/projects";

// type Props = { project: SeedProject };

// export default function ProjectCTABar({ project }: Props) {
// 	function handleWhatsApp() {
// 		const msg = encodeURIComponent(
// 			`Hi, I'm interested in ${project.name}. Please share more details.`,
// 		);
// 		window.open(
// 			`https://wa.me/${project.whatsappNumber.replace(/\D/g, "")}?text=${msg}`,
// 			"_blank",
// 		);
// 	}

// 	function handleCall() {
// 		window.location.href = `tel:${project.callNumber}`;
// 	}

// 	return (
// 		<section id="enquiry-form" className="w-full bg-gray-900 py-12 md:py-14">
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// 				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
// 					{/* Left text */}
// 					<div className="max-w-lg">
// 						<p className="text-xs font-semibold uppercase tracking-widest text-[#CC1718] mb-2">
// 							Register Your Interest
// 						</p>
// 						<h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
// 							Secure your unit before
// 							<br />
// 							the next price review.
// 						</h2>
// 						<p className="mt-3 text-sm text-white/60 leading-relaxed">
// 							Speak with our project sales team to request the brochure, payment
// 							plan, construction updates, and investment details.
// 						</p>
// 					</div>

// 					{/* Right buttons */}
// 					<div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
// 						<button
// 							onClick={() => {
// 								document
// 									.getElementById("enquiry-form")
// 									?.scrollIntoView({ behavior: "smooth" });
// 							}}
// 							className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#CC1718] text-white text-sm font-semibold rounded-sm hover:bg-[#b01415] transition-colors"
// 						>
// 							Register Interest <span aria-hidden="true">→</span>
// 						</button>

// 						<button
// 							onClick={handleCall}
// 							className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white text-sm font-semibold rounded-sm hover:bg-white/10 transition-colors"
// 						>
// 							<Phone className="h-4 w-4" />
// 							Call Sales Team
// 						</button>
// 					</div>
// 				</div>
// 			</div>
// 		</section>
// 	);
// }


import { Building2, Home } from "lucide-react";
import type { ProjectUnit } from "@/lib/types/project-detail";

const unitIcons = {
  home: Home,
  building: Building2,
} as const;

export interface ProjectUnitsProps {
  units: ProjectUnit[];
}

export function ProjectUnits({ units }: ProjectUnitsProps) {
  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const Icon = unitIcons[unit.icon];

        return (
          <div
            key={unit.id}
            className="flex flex-col gap-3 rounded-2xl border border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-red-600">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-base font-semibold text-ink-950">{unit.name}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-stone-600 sm:items-end">
              <span className="font-semibold text-ink-950">{unit.priceLabel}</span>
              <span>{unit.availabilityLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}