// components/public/about/AboutMission.tsx
import Image from "next/image";

export default function AboutMission() {
	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-0">
				{/* Left — Image */}
				<div className="relative min-h-[260px] md:min-h-[340px] p-6 md:p-8 order-2 md:order-1">
					<div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden">
						<Image
							src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80"
							alt="Jimo Mission — quality real estate development"
							fill
							className="object-cover object-center"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				</div>

				{/* Right — Text */}
				<div className="flex flex-col justify-center px-8 md:px-10 lg:px-12 py-10 md:py-14 order-1 md:order-2">
					<span className="text-xs font-bold tracking-widest uppercase text-[#CC1718]">
						Mission
					</span>
					<h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-xs">
						Building with purpose, delivering with precision
					</h2>
					<p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
						Our mission is to develop premium real estate that delivers
						exceptional quality, genuine value, and lasting impact for buyers,
						investors, and communities across Lagos and beyond. We are committed
						to every project being a true reflection of our dedication to
						excellence.
					</p>
				</div>
			</div>
		</div>
	);
}
