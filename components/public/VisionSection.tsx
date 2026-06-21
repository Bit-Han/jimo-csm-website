// components/public/home/VisionSection.tsx
import Image from "next/image";

export default function VisionSection() {
	return (
		<section className="w-full bg-white py-16 md:py-20 lg:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
					{/* Left — Text */}
					<div className="order-2 md:order-1">
						<h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight text-gray-900">
							Driven with vision
							<br />
							built with purpose
						</h2>
						<p className="mt-5 text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
							At Jimo Property Development, every project is built on a
							foundation of integrity, precision, and long-term thinking. We
							don&apos;t just build structures — we create spaces that generate
							lasting value for homeowners, investors, and communities across
							Lagos.
						</p>
					</div>

					{/* Right — Image */}
					<div className="order-1 md:order-2">
						<div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
							<Image
								src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80"
								alt="Jimo Property Development — premium building"
								fill
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
