import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/public/CtaBanner";
import { formatDate } from "@/lib/utils/helpers";
import { getAllInsightSlugs, getInsightDetail } from "@/lib/data/insights";
import { siteConfig } from "@/lib/data/site";

interface InsightPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: InsightPageProps): Promise<Metadata> {
	const { slug } = await params;
	const insight = getInsightDetail(slug);

	if (!insight) {
		return { title: "Article Not Found" };
	}

	return {
		title: insight.title,
		description: insight.excerpt,
	};
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
	const { slug } = await params;
	const insight = getInsightDetail(slug);

	if (!insight) {
		notFound();
	}

	return (
		<>
			<section className="bg-cream-100 py-16">
				<Container className="max-w-2xl">
					<span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
						{insight.categoryLabel}
					</span>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
						{insight.title}
					</h1>
					<p className="mt-3 text-sm font-medium text-stone-500">
						{formatDate(insight.publishedAt)} &middot; {insight.readTimeMinutes}{" "}
						min read
					</p>
				</Container>
			</section>

			<article className="bg-cream-50 py-16">
				<Container className="max-w-2xl">
					<div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
						<Image
							src={insight.coverImage.src}
							alt={insight.coverImage.alt}
							fill
							sizes="(min-width: 1024px) 700px, 100vw"
							className="object-cover"
						/>
					</div>

					<div className="mt-10 space-y-5 text-base leading-relaxed text-stone-700">
						{insight.body.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>

					{insight.relatedProject ? (
						<Link
							href={`/projects/${insight.relatedProject.slug}`}
							className="mt-10 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-red-200 hover:bg-red-50"
						>
							<div>
								<p className="text-xs font-medium uppercase tracking-wide text-stone-500">
									Related Project
								</p>
								<p className="mt-1 text-base font-bold text-ink-950">
									{insight.relatedProject.name}
								</p>
							</div>
							<ArrowUpRight className="h-5 w-5 text-red-600" />
						</Link>
					) : null}
				</Container>
			</article>

			<CtaBanner
				eyebrow="Start a Conversation"
				title="Want to talk through what this means for you?"
				description="Our team is available to discuss current projects, upcoming developments, and partnership opportunities."
				primaryCta={{
					label: "Register Interest",
					href: siteConfig.registerInterestHref,
				}}
				secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
			/>
		</>
	);
}
