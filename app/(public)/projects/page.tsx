import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectsExplorer } from "@/components/public/projects/ProjectExplorer";
import { getPublishedProjects } from "@/lib/db/queries/projects";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Residential, serviced apartment, and hospitality-led real estate projects designed with long-term value in mind.",
};

// Force dynamic so every request re-queries the DB during development.
// Switch to `export const revalidate = 60` in production once confirmed working.
export const dynamic = "force-dynamic";


export default async function ProjectsPage() {
	const projects = await getPublishedProjects();

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
					<ProjectsExplorer projects={projects} />
				</Container>
			</section>
		</>
	);
}