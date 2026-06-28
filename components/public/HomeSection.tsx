import Image from "next/image";
import { ArrowRight, Building2, LineChart, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data/site";

const heroStats = [
	{ label: "Premium Developments", icon: Building2 },
	{ label: "Long-Term Asset Value", icon: LineChart },
	{ label: "Structured Approach", icon: ShieldCheck },
];

const heroImage = {
	src: "https://images.unsplash.com/photo-1752293451299-fca611e46389?auto=format&fit=crop&w=1200&q=80",
	alt: "Modern high-rise residential towers representative of a Jimo development",
};

export function HeroSection() {
	return (
		<section className="overflow-hidden bg-cream-50 pt-14 pb-24 sm:pt-20 sm:pb-32">
			<Container className="grid items-center gap-12 lg:grid-cols-2">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						Premium Real Estate Development
					</p>
					<h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
						Building Africa&apos;s Next Innovative Real Estate
					</h1>
					<p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">
						We develop premium residential, hospitality, and investment-led real
						estate projects designed with structure, market insight, and
						long-term value.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<ButtonLink href="/projects" variant="primary" size="lg">
							View Projects
							<ArrowRight className="h-4 w-4" />
						</ButtonLink>
						<ButtonLink
							href={siteConfig.registerInterestHref}
							variant="outline"
							size="lg"
						>
							Register Interest
						</ButtonLink>
					</div>

					<dl className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3">
						{heroStats.map(({ label, icon: Icon }) => (
							<div key={label} className="flex items-center gap-3">
								<Icon className="h-5 w-5 shrink-0 text-red-600" />
								<dt className="text-sm font-medium text-ink-950">{label}</dt>
							</div>
						))}
					</dl>
				</div>

				<div className="relative pb-10 sm:pb-12">
					<div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl sm:aspect-[5/6]">
						<Image
							src={heroImage.src}
							alt={heroImage.alt}
							fill
							priority
							sizes="(min-width: 1024px) 40vw, 90vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-maroon-950 via-maroon-950/60 to-maroon-950/10" />

						<div className="absolute left-5 top-5 inline-flex flex-col gap-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
							<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
								Project Focus
							</span>
							<span className="text-sm font-medium text-white">
								Residential &middot; Hospitality &middot; Investment
							</span>
						</div>

						{/* <div className="absolute bottom-24 left-5">
							<p className="text-lg font-bold text-white">Jimo Development</p>
							<p className="text-sm text-white/70">Premium Residence</p>
						</div> */}
					</div>

					<div className="absolute bottom-0 right-4 w-[85%] max-w-xs rounded-2xl bg-white p-5 shadow-xl sm:right-6">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
							Built For
						</p>
						<p className="mt-1 text-base font-bold text-ink-950">
							Home Owners, Investors &amp; Partners
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}
