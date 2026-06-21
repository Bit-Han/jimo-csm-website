// components/public/services/ServicesHero.tsx
import Image from "next/image";

export default function ServicesHero() {
	return (
		<section className="w-full bg-[#f2f2f2] pt-6 md:pt-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Card */}
				<div className="relative w-full overflow-hidden rounded-2xl bg-white min-h-[300px] md:min-h-[380px]">
					<div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px] md:min-h-[380px]">
						{/* Left — Text */}
						<div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 md:py-14 order-2 md:order-1">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#CC1718] leading-tight">
								Our Services
							</h1>
							<p className="mt-5 text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
								From land acquisition to project delivery and beyond, Jimo
								Property Development provides a full spectrum of real estate
								development and advisory services — built on quality, integrity,
								and long-term value creation.
							</p>
						</div>

						{/* Right — Image */}
						<div className="relative order-1 md:order-2 min-h-[200px] md:min-h-0">
							<Image
								src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80"
								alt="Jimo Property Development — services and construction"
								fill
								priority
								className="object-cover object-center"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
