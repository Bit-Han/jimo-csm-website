
//@app/(public)/projects/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectsExplorer } from "@/components/public/projects/ProjectExplorer";
import { getPublishedProjects } from "@/lib/db/queries/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Residential, serviced apartment, and hospitality-led real estate projects designed with long-term value in mind.",
};

// export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  const hasProjects = projects.length > 0;

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
            Residential, serviced apartment, and hospitality-led real estate
            projects designed with long-term value in mind.
          </p>
        </Container>
      </section>

      <section className="bg-cream-50 py-16">
        <Container>
          {hasProjects ? (
            <ProjectsExplorer projects={projects} />
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white px-8 py-16 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-ink-950">
                No projects available yet
              </h2>

              <p className="mt-3 text-stone-600">
                We&apos;re currently preparing details of our latest developments.
                Please check back soon to explore our upcoming residential,
                serviced apartment, and hospitality projects.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Back to Home
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}