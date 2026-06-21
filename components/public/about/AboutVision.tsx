// components/public/about/AboutVision.tsx
import Image from "next/image";

export default function AboutVision() {
	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-0">
				{/* Left — Text */}
				<div className="flex flex-col justify-center px-8 md:px-10 lg:px-12 py-10 md:py-14 order-1">
					<span className="text-xs font-bold tracking-widest uppercase text-[#CC1718]">
						Vision
					</span>
					<h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-xs">
						Africa&apos;s most trusted real estate developer
					</h2>
					<p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
						We envision a future where Jimo Property Development is recognized
						across Africa as the benchmark for premium, integrity-driven real
						estate — creating spaces that inspire living, attract investment,
						and shape the built environment of tomorrow&apos;s cities.
					</p>
				</div>

				{/* Right — Image */}
				<div className="relative min-h-[260px] md:min-h-[340px] p-6 md:p-8 order-2">
					<div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden">
						<Image
							src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80"
							alt="Jimo Vision — premium real estate across Africa"
							fill
							className="object-cover object-center"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
