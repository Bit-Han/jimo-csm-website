// components/public/projects/detail/ProjectHighlights.tsx
import { CheckCircle2, TrendingUp } from "lucide-react";
import type { SeedProject } from "@/lib/data/seed-projects";

type Props = { project: SeedProject };

export default function ProjectHighlights({ project }: Props) {
	return (
		<section className="w-full bg-[#f9f9f9] py-14 md:py-18">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Investment Highlights */}
					<div className="bg-white border border-gray-100 rounded-sm p-6 md:p-8">
						<div className="flex items-center gap-2 mb-5">
							<TrendingUp className="h-5 w-5 text-[#CC1718]" />
							<h3 className="text-base font-bold text-gray-900">
								Investment Highlights
							</h3>
						</div>
						<ul className="space-y-3">
							{project.investmentHighlights.map((item, i) => (
								<li key={i} className="flex items-start gap-3">
									<span className="mt-0.5 w-5 h-5 rounded-full bg-[#CC1718]/10 flex items-center justify-center flex-shrink-0">
										<span className="w-1.5 h-1.5 rounded-full bg-[#CC1718]" />
									</span>
									<span className="text-sm text-gray-600 leading-relaxed">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Location Advantages */}
					<div className="bg-white border border-gray-100 rounded-sm p-6 md:p-8">
						<div className="flex items-center gap-2 mb-5">
							<CheckCircle2 className="h-5 w-5 text-[#CC1718]" />
							<h3 className="text-base font-bold text-gray-900">
								Location Advantages
							</h3>
						</div>
						<ul className="space-y-3">
							{project.locationAdvantages.map((item, i) => (
								<li key={i} className="flex items-start gap-3">
									<CheckCircle2 className="h-4 w-4 text-[#CC1718] flex-shrink-0 mt-0.5" />
									<span className="text-sm text-gray-600 leading-relaxed">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
