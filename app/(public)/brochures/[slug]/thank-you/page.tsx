// //@app/(public)/brochures/[slug]/thank-you/page.tsx
// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { Mail } from "lucide-react";
// import { Container } from "@/components/ui/Container";
// import { ButtonLink } from "@/components/ui/Button";
// import { getProjectDetail } from "@/lib/data/project-details";

// interface BrochureThankYouPageProps {
// 	params: Promise<{ slug: string }>;
// }

// export const metadata: Metadata = {
// 	title: "Check Your Email",
// };

// export default async function BrochureThankYouPage({
// 	params,
// }: BrochureThankYouPageProps) {
// 	const { slug } = await params;
// 	const project = getProjectDetail(slug);

// 	if (!project) {
// 		notFound();
// 	}

// 	return (
// 		<section className="bg-cream-50 py-24">
// 			<Container className="max-w-xl text-center">
// 				<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
// 					<Mail className="h-7 w-7" />
// 				</span>
// 				<h1 className="mt-6 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
// 					Check your email
// 				</h1>
// 				<p className="mt-4 text-base leading-relaxed text-stone-600">
// 					The {project.name} brochure is on its way to your inbox. If it does
// 					not arrive in a few minutes, check your spam folder or speak with our
// 					team directly.
// 				</p>
// 				<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
// 					<ButtonLink
// 						href={`/projects/${project.slug}`}
// 						variant="primary"
// 						size="lg"
// 					>
// 						Back to {project.name}
// 					</ButtonLink>
// 					<ButtonLink href="/contact" variant="outline" size="lg">
// 						Speak With Our Team
// 					</ButtonLink>
// 				</div>
// 			</Container>
// 		</section>
// 	);
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getProjectDetailBySlug } from "@/lib/db/queries/projects";

interface BrochureThankYouPageProps {
	params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
	title: "Check Your Email",
};

export const dynamic = "force-dynamic";

export default async function BrochureThankYouPage({
	params,
}: BrochureThankYouPageProps) {
	const { slug } = await params;
	const project = await getProjectDetailBySlug(slug);

	if (!project) {
		notFound();
	}

	return (
		<section className="bg-cream-50 py-24">
			<Container className="max-w-xl text-center">
				<span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
					<Mail className="h-7 w-7" />
				</span>
				<h1 className="mt-6 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
					Check your email
				</h1>
				<p className="mt-4 text-base leading-relaxed text-stone-600">
					The {project.name} brochure is on its way to your inbox. If it does
					not arrive in a few minutes, check your spam folder or speak with our
					team directly.
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