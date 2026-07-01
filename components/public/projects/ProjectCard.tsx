import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { Project, ProjectStatus } from "@/lib/types/project";

const statusBadgeVariant: Record<ProjectStatus, BadgeProps["variant"]> = {
  completed: "completed",
  "under-development": "under-development",
};

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-maroon-950/90 via-maroon-950/30 to-transparent" />
        <Badge variant={statusBadgeVariant[project.status]} size="sm" className="absolute left-4 top-4">
          {project.statusLabel}
        </Badge>
        <div className="absolute bottom-4 left-4">
          <p className="text-base font-bold text-white">{project.developerLabel}</p>
          <p className="text-xs text-white/70">{project.typeLabel}</p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
            <MapPin className="h-3.5 w-3.5" />
            {project.location}
          </p>
          <h3 className="mt-2 text-lg font-bold text-ink-950">{project.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-stone-600"
            >
              {tag.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <ButtonLink href={project.primaryCta.href} variant="primary" size="sm">
            {project.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={project.secondaryCta.href} variant="soft" size="sm">
            {project.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
