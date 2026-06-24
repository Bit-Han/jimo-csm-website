
// // app/(public)/projects/page.tsx
// import type { Metadata } from "next";
// import ProjectsListing from "@/components/public/projects/ProjectsListing";
// import { SEED_PROJECTS } from "@/lib/data/projects";

// export const metadata: Metadata = {
// 	title: "Our Projects",
// 	description:
// 		"Explore Jimo Property Development's premium residential, hospitality and investment-led projects across Lagos.",
// };

// export default function ProjectsPage() {
// 	return <ProjectsListing projects={SEED_PROJECTS} />;
// }



import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectsExplorer } from "@/components/public/projects/ProjectExplorer";
import { featuredProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Residential, serviced apartment, and hospitality-led real estate projects designed with long-term value in mind.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-cream-100 py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
            Our Projects
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
            Explore Jimo developments
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Residential, serviced apartment, and hospitality-led real estate projects designed
            with long-term value in mind.
          </p>
        </Container>
      </section>

      <section className="bg-cream-50 py-16">
        <Container>
          <ProjectsExplorer projects={featuredProjects} />
        </Container>
      </section>
    </>
  );
}