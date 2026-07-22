
//@components/public/ProjectHero.tsx 

import Image from "next/image";
import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { ProjectDetail } from "@/lib/types/project-detail";

export interface ProjectHeroProps {
	project: ProjectDetail;
}

export function ProjectHero({ project }: ProjectHeroProps) {
	return (
		<section className="relative overflow-hidden bg-ink-950 py-12 sm:py-16">
			<div className="pointer-events-none absolute inset-0 bg-linear-to-br from-maroon-950 via-ink-950 to-ink-950" />

			<Container className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
						{project.statusLabel} &middot; {project.categoryLabel}
					</p>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
						{project.name}
					</h1>
					<p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
						{project.description}
					</p>

					<div className="mt-6 hidden gap-4 lg:flex">
						<ButtonLink
							href={project.secondaryCta.href}
							variant="accent"
							size="lg"
						>
							Register Interest
						</ButtonLink>
						<ButtonLink
							href={`/brochures/${project.slug}`}
							variant="outline-light"
							size="lg"
						>
							<Download className="h-4 w-4" />
							Download Brochure
						</ButtonLink>
					</div>
				</div>

				<div>
					<div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl sm:aspect-[4/5] lg:aspect-[5/6]">
						<Image
							src={project.coverImage.src}
							alt={project.coverImage.alt}
							fill
							priority
							sizes="(min-width: 1024px) 45vw, 100vw"
							className="object-cover"
						/>
						<div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-ink-950/70 to-transparent p-4">
							<p className="text-sm font-bold text-white">
								{project.developerLabel}
							</p>
							<p className="text-xs text-white/70">{project.typeLabel}</p>
						</div>
					</div>

					<div className="mt-4 flex gap-3 lg:hidden">
						<ButtonLink
							href={project.secondaryCta.href}
							variant="accent"
							size="lg"
							className="flex-1"
						>
							Register Interest
						</ButtonLink>
						<ButtonLink
							href={`/brochures/${project.slug}`}
							variant="outline-light"
							size="lg"
							className="flex-1"
						>
							<Download className="h-4 w-4" />
							Brochure
						</ButtonLink>
					</div>
				</div>
			</Container>
		</section>
	);
}