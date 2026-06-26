import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BrochureRequestForm } from "@/components/public/brochures/BrochureRequestForm";
import { getProjectBrochure } from "@/lib/data/brochures";
import { getProjectDetail } from "@/lib/data/project-details";

interface BrochurePageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BrochurePageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = getProjectDetail(slug);

	return {
		title: project ? `Download ${project.name} Brochure` : "Download Brochure",
	};
}

export default async function BrochureRequestPage({
	params,
}: BrochurePageProps) {
	const { slug } = await params;
	const project = getProjectDetail(slug);
	const brochure = getProjectBrochure(slug);

	if (!project || !brochure) {
		notFound();
	}

	return (
		<section className="bg-cream-50 py-20">
			<Container className="max-w-lg">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
					Download Brochure
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
					{project.name}
				</h1>
				<p className="mt-3 text-base leading-relaxed text-stone-600">
					Enter your details and we will email the full brochure straight to
					your inbox.
				</p>

				<BrochureRequestForm projectSlug={project.slug} className="mt-8" />
			</Container>
		</section>
	);
}
