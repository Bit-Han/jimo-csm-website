
import Link from "next/link";
import Image from "next/image";

// components/Hero.tsx
export default function HeroSection() {
  return (
		<section className="relative overflow-hidden bg-white">
			<div className="grid lg:grid-cols-4">
				{/* Text block: normal flow on mobile (stacks above image), 
            absolutely overlaid top-left on desktop */}
				<div className="order-1 relative z-10 px-6 lg:px-0 py-10 lg:py-0 lg:absolute lg:inset-0 lg:flex lg:items-center">
					<div className="max-w-7xl mx-auto w-full lg:px-10">
						<div className="max-w-xl">
							<h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand leading-tight">
								Building Africa&rsquo;s Next Innovative Real Estate
							</h1>
							<p className="mt-5 text-gray-600 text-base lg:text-lg max-w-md">
								Developing Premium Real Estate with Structure, Insight, and
								Long-Term Value
							</p>
							<div className="mt-9 flex flex-wrap gap-4">
								<Link
									href="/projects"
									className="inline-flex items-center bg-gray-800 gap-2 text-white font-heading font-semibold px-6 py-3.5 hover:bg-black transition-colors"
								>
									View Projects <span>&rarr;</span>
								</Link>
								<Link
									href="/contact"
									className="inline-flex items-center bg-gray-800 gap-2 border-2 border-white text-white font-heading font-semibold px-6 py-3.5 hover:bg-dark hover:text-white transition-colors hover:bg-black"
								>
									Contact Us <span>&rarr;</span>
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Image block: full width on mobile, right 3/4 on desktop (col 2-4 of 4) */}
				<div className="order-2 lg:order-none lg:col-start-2 lg:col-span-3 relative h-[320px] sm:h-[440px] lg:h-[640px]">
					{/* Replace src with your own image */}
					<Image
						src="/images/hero-2.png"
						alt="hero-section"
						width={600}
						height={300}
						className="absolute inset-0 w-full h-full object-cover"
					/>

					{/* Soft fade only at the seam, so the text stays legible without
              dulling the rest of the photo */}
					<div
						className="absolute inset-0 hidden lg:block"
						style={{
							background:
								"linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 12%, rgba(255,255,255,0) 28%)",
						}}
					/>
				</div>
			</div>
		</section>
	);
}