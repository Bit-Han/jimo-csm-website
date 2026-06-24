// import Image from "next/image";
// import { MessageCircle, Phone } from "lucide-react";
// import { Container } from "@/components/ui/Container";
// import { ButtonLink } from "@/components/ui/Button";
// import type { ProjectDetail } from "@/lib/types/project-detail";

// export interface ProjectHeroProps {
// 	project: ProjectDetail;
// }

// export function ProjectHero({ project }: ProjectHeroProps) {
// 	return (
// 		<section className="relative overflow-hidden bg-ink-950 pb-24 pt-16 sm:pb-28 sm:pt-20">
// 			<Image
// 				src={project.coverImage.src}
// 				alt={project.coverImage.alt}
// 				fill
// 				priority
// 				sizes="100vw"
// 				className="object-cover opacity-40"
// 			/>
// 			<div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-maroon-950/60" />

// 			<Container className="relative max-w-3xl">
// 				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
// 					{project.statusLabel} &middot; {project.categoryLabel}
// 				</p>
// 				<h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
// 					{project.name}
// 				</h1>
// 				<p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
// 					{project.description}
// 				</p>

// 				<div className="mt-8 flex flex-wrap items-center gap-4">
// 					<ButtonLink
// 						href={project.secondaryCta.href}
// 						variant="accent"
// 						size="lg"
// 					>
// 						Register Interest
// 					</ButtonLink>
// 					<ButtonLink
// 						href="https://wa.me/2340000000000"
// 						variant="outline-light"
// 						size="lg"
// 					>
// 						<MessageCircle className="h-4 w-4" />
// 						Chat on WhatsApp
// 					</ButtonLink>
// 					<ButtonLink
// 						href="tel:+2340000000000"
// 						variant="outline-light"
// 						size="lg"
// 					>
// 						<Phone className="h-4 w-4" />
// 						Call Sales Team
// 					</ButtonLink>
// 				</div>

// 				<div className="mt-10">
// 					<p className="text-lg font-bold text-white">
// 						{project.developerLabel}
// 					</p>
// 					<p className="text-sm text-white/60">{project.typeLabel}</p>
// 				</div>
// 			</Container>
// 		</section>
// 	);
// }


import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data/site";
import type { ProjectDetail } from "@/lib/types/project-detail";

export interface ProjectHeroProps {
  project: ProjectDetail;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-24 pt-16 sm:pb-28 sm:pt-20">
      <Image
        src={project.coverImage.src}
        alt={project.coverImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-maroon-950/60" />

      <Container className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          {project.statusLabel} &middot; {project.categoryLabel}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href={project.secondaryCta.href} variant="accent" size="lg">
            Register Interest
          </ButtonLink>
          <ButtonLink href={siteConfig.whatsappHref} variant="outline-light" size="lg">
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </ButtonLink>
          <ButtonLink href={siteConfig.phoneHref} variant="outline-light" size="lg">
            <Phone className="h-4 w-4" />
            Call Sales Team
          </ButtonLink>
        </div>

        <div className="mt-10">
          <p className="text-lg font-bold text-white">{project.developerLabel}</p>
          <p className="text-sm text-white/60">{project.typeLabel}</p>
        </div>
      </Container>
    </section>
  );
}