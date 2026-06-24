import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { featuredProjects } from "@/lib/data/projects";

export function FeaturedProjectsSection() {
	return (
		<section className="bg-cream-50 py-20">
			<Container>
				<SectionHeading
					align="center"
					eyebrow="Featured Projects"
					title="Current and upcoming developments"
					description="Explore residential, serviced apartment, and hospitality-led real estate projects from Jimo Property Development Limited."
				/>

				<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{featuredProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</Container>
		</section>
	);
}
