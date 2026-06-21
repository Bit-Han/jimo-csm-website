// components/public/about/AboutCoreValues.tsx
import Image from "next/image";

const VALUES = [
	{
		title: "Integrity",
		description:
			"We operate with complete transparency and honesty in every relationship — with buyers, investors, partners, and communities.",
	},
	{
		title: "Quality",
		description:
			"Every material, finish, and structural detail is held to the highest standard. We do not compromise on what we build.",
	},
	{
		title: "Innovation",
		description:
			"We continuously seek better ways to design, build, and deliver — adopting modern approaches that serve our clients well into the future.",
	},
	{
		title: "Long-Term Value",
		description:
			"We think generationally. Every project is designed to appreciate, perform, and remain relevant for decades.",
	},
];

export default function AboutCoreValues() {
	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-0">
				{/* Left — Image */}
				<div className="relative min-h-[260px] md:min-h-[380px] p-6 md:p-8 order-2 md:order-1">
					<div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden">
						<Image
							src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"
							alt="Jimo Core Values — quality construction"
							fill
							className="object-cover object-center"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				</div>

				{/* Right — Text */}
				<div className="flex flex-col justify-center px-8 md:px-10 lg:px-12 py-10 md:py-14 order-1 md:order-2">
					<span className="text-xs font-bold tracking-widest uppercase text-[#CC1718]">
						Core Values
					</span>
					<h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-xs">
						The principles that guide everything we do
					</h2>
					<p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
						Our values are not words on a wall — they are the daily standard by
						which every decision, every project, and every relationship is
						measured.
					</p>

					{/* Values list */}
					<ul className="mt-6 space-y-4">
						{VALUES.map((v) => (
							<li key={v.title} className="flex items-start gap-3">
								<span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#CC1718] flex-shrink-0" />
								<div>
									<span className="text-sm font-semibold text-gray-900">
										{v.title}
										{" — "}
									</span>
									<span className="text-sm text-gray-600">{v.description}</span>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
