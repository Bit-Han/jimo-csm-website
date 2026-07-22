// //@app/(public)/brochures/[slug]/page.tsx

// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { Container } from "@/components/ui/Container";
// import { BrochureRequestForm } from "@/components/public/brochures/BrochureRequestForm";
// import { getProjectBrochure } from "@/lib/data/brochures";
// import { getProjectDetail } from "@/lib/data/project-details";

// interface BrochurePageProps {
// 	params: Promise<{ slug: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: BrochurePageProps): Promise<Metadata> {
// 	const { slug } = await params;
// 	const project = getProjectDetail(slug);

// 	return {
// 		title: project ? `Download ${project.name} Brochure` : "Download Brochure",
// 	};
// }

// export default async function BrochureRequestPage({
// 	params,
// }: BrochurePageProps) {
// 	const { slug } = await params;
// 	const project = getProjectDetail(slug);
// 	const brochure = getProjectBrochure(slug);

// 	if (!project || !brochure) {
// 		notFound();
// 	}

// 	return (
// 		<section className="bg-cream-50 py-20">
// 			<Container className="max-w-lg">
// 				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 					Download Brochure
// 				</p>
// 				<h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
// 					{project.name}
// 				</h1>
// 				<p className="mt-3 text-base leading-relaxed text-stone-600">
// 					Enter your details and we will email the full brochure straight to
// 					your inbox.
// 				</p>

// 				<BrochureRequestForm projectSlug={project.slug} className="mt-8" />
// 			</Container>
// 		</section>
// 	);
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { BrochureRequestForm } from "@/components/public/brochures/BrochureRequestForm";
import { getProjectDetailBySlug } from "@/lib/db/queries/projects";
import { getBrochureByProjectSlug } from "@/lib/db/queries/brochures";

interface BrochurePageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BrochurePageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProjectDetailBySlug(slug);

	return {
		title: project ? `Download ${project.name} Brochure` : "Download Brochure",
	};
}

// Brochure availability changes independently of the project page itself
// (an admin can publish/unpublish/replace it at any time) — matching your
// project's own convention of force-dynamic during development.
export const dynamic = "force-dynamic";

export default async function BrochureRequestPage({
	params,
}: BrochurePageProps) {
	const { slug } = await params;
	const project = await getProjectDetailBySlug(slug);

	// A genuinely unknown project slug is a real 404.
	if (!project) {
		notFound();
	}

	const brochure = await getBrochureByProjectSlug(slug);

	// The project is real, but there's no approved brochure yet — this is a
	// normal, temporary state, not an error. A 404 here would wrongly imply
	// the project itself doesn't exist.
	if (!brochure) {
		return (
			<section className="bg-cream-50 py-20">
				<Container className="max-w-lg text-center">
					<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
						<FileX className="h-7 w-7" />
					</span>
					<h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
						Brochure not available yet
					</h1>
					<p className="mt-3 text-base leading-relaxed text-stone-600">
						The brochure for {project.name} isn&apos;t ready for download right
						now. Check back soon, or speak with our team directly and we&apos;ll
						send you everything you need.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<ButtonLink
							href={`/projects/${project.slug}`}
							variant="primary"
							size="lg"
						>
							Back to {project.name}
						</ButtonLink>
						<ButtonLink href="/contact" variant="outline" size="lg">
							Speak With Our Team
						</ButtonLink>
					</div>
				</Container>
			</section>
		);
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