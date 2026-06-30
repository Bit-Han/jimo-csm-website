import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/public/CtaBanner";
import { ProjectHero } from "@/components/public/projects/ProjectHero";
import { ProjectFactsCard } from "@/components/public/projects/ProjectFactsCard";
import { MobileBottomDock } from "@/components/public/projects/MobileBottomDock";
import { DetailCard } from "@/components/public/projects/DetailCard";
import { ProjectUnits } from "@/components/public/projects/ProjectUnits";
import { Checklist } from "@/components/public/projects/ProjectChecklistItem";
import { ProjectAmenities } from "@/components/public/projects/ProjectAmenity";
import { MediaCarousel } from "@/components/public/projects/MediaCarousel";
import {
	getAllProjectSlugs,
	getProjectDetail,
} from "@/lib/data/project-details";
import { siteConfig } from "@/lib/data/site";

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: ProjectPageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = getProjectDetail(slug);

	if (!project) {
		return { title: "Project Not Found" };
	}

	return {
		title: project.name,
		description: project.description,
	};
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = getProjectDetail(slug);

	if (!project) {
		notFound();
	}

	return (
		<>
			<ProjectHero project={project} />

			<div className="bg-cream-50 pt-8 lg:hidden">
				<Container>
					<ProjectFactsCard project={project} />
				</Container>
			</div>

			<MobileBottomDock
				whatsappHref={siteConfig.whatsappHref}
				brochureHref={`/brochures/${project.slug}`}
				closingContent={
					<CtaBanner
						eyebrow="Start a Conversation"
						title={project.contactCtaTitle}
						description={project.contactCtaDescription}
						primaryCta={{
							label: "Register Interest",
							href: project.secondaryCta.href,
						}}
						secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
					/>
				}
			>
				<section className="bg-cream-50 py-16">
					<Container className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
						<aside className="hidden lg:sticky lg:top-24 lg:block">
							<ProjectFactsCard project={project} />
						</aside>

						<div className="flex flex-col gap-6">
							<DetailCard title="Project Overview">
								<div className="space-y-4 text-sm leading-relaxed text-stone-600">
									{project.overview.map((paragraph) => (
										<p key={paragraph}>{paragraph}</p>
									))}
								</div>
							</DetailCard>

							<DetailCard title="Unit Types & Pricing">
								<ProjectUnits units={project.units} />
							</DetailCard>

							<DetailCard title="Investment Highlights">
								<Checklist items={project.investmentHighlights} />
							</DetailCard>

							<DetailCard title="Payment Plan">
								<Checklist items={project.paymentPlan} />
							</DetailCard>

							<DetailCard title="Features & Amenities">
								<ProjectAmenities amenities={project.amenities} />
							</DetailCard>

							<div className="flex flex-col gap-4">
								<div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
									<h2 className="text-xl font-bold text-ink-950">Gallery</h2>
								</div>
								<MediaCarousel items={project.media} />
							</div>
						</div>
					</Container>
				</section>
			</MobileBottomDock>
		</>
	);
}