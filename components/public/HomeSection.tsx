import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { homeIconMap } from "@/lib/data/home-icons";
import type { HomeHeroSection } from "@/lib/types/home";

export interface HeroSectionProps {
	data: HomeHeroSection;
}

export function HeroSection({ data }: HeroSectionProps) {
	return (
		<section className="overflow-hidden bg-cream-50 pb-24 pt-14 sm:pb-32 sm:pt-20">
			<Container className="grid items-center gap-12 lg:grid-cols-2">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						{data.eyebrow}
					</p>
					<h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
						{data.heading}
					</h1>
					<p className="mt-6 max-w-lg text-base leading-relaxed text-stone-600">
						{data.description}
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<ButtonLink href={data.primaryCta.href} variant="primary" size="lg">
							{data.primaryCta.label}
							<ArrowRight className="h-4 w-4" />
						</ButtonLink>
						<ButtonLink
							href={data.secondaryCta.href}
							variant="outline"
							size="lg"
						>
							{data.secondaryCta.label}
						</ButtonLink>
					</div>

					<dl className="mt-10 grid grid-cols-1 gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3">
						{data.stats.map((stat) => {
							const Icon = homeIconMap[stat.icon];
							return (
								<div key={stat.id} className="flex items-center gap-3">
									<Icon className="h-5 w-5 shrink-0 text-red-600" />
									<dt className="text-sm font-medium text-ink-950">
										{stat.label}
									</dt>
								</div>
							);
						})}
					</dl>
				</div>

				<div className="relative pb-10 sm:pb-12">
					<div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl sm:aspect-[5/6]">
						<Image
							src={data.image.src}
							alt={data.image.alt}
							fill
							priority
							sizes="(min-width: 1024px) 40vw, 90vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/60 to-maroon-950/10" />

						<div className="absolute left-5 top-5 inline-flex flex-col gap-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
							<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
								Project Focus
							</span>
							<span className="text-sm font-medium text-white">
								{data.projectFocusLabel}
							</span>
						</div>

						<div className="absolute bottom-24 left-5">
							<p className="text-lg font-bold text-white">Jimo Development</p>
							<p className="text-sm text-white/70">Premium Residence</p>
						</div>
					</div>

					<div className="absolute bottom-0 right-4 w-[85%] max-w-xs rounded-2xl bg-white p-5 shadow-xl sm:right-6">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
							Built For
						</p>
						<p className="mt-1 text-base font-bold text-ink-950">
							{data.builtForLabel}
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}