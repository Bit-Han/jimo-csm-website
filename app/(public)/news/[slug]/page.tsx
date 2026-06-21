// app/(public)/news/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	SEED_ARTICLES,
	ARTICLE_CATEGORY_LABELS,
	formatDate,
} from "@/lib/data/seed-articles";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { SEED_PROJECTS } from "@/lib/data/seed-projects";

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
	return SEED_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const article = SEED_ARTICLES.find((a) => a.slug === slug);
	if (!article) return { title: "Article Not Found" };
	return {
		title: article.title,
		description: article.excerpt,
		openGraph: {
			title: article.title,
			description: article.excerpt,
			images: [article.featuredImageUrl],
		},
	};
}

export default async function ArticleDetailPage({ params }: Props) {
	const { slug } = await params;
	const article = SEED_ARTICLES.find((a) => a.slug === slug);
	if (!article) notFound();

	// Related articles — same category, excluding current
	const related = SEED_ARTICLES.filter(
		(a) => a.slug !== slug && a.category === article.category,
	).slice(0, 2);

	// Fill with other articles if not enough in same category
	const relatedFilled =
		related.length < 2
			? [
					...related,
					...SEED_ARTICLES.filter(
						(a) => a.slug !== slug && !related.find((r) => r.slug === a.slug),
					).slice(0, 2 - related.length),
				]
			: related;

	// Related project
	const relatedProject = article.relatedProjectSlug
		? SEED_PROJECTS.find((p) => p.slug === article.relatedProjectSlug)
		: null;

	return (
		<>
			{/* Hero Image */}
			<section className="w-full">
				<div className="relative w-full h-[300px] md:h-[440px] lg:h-[520px] overflow-hidden">
					<Image
						src={article.featuredImageUrl}
						alt={article.title}
						fill
						priority
						className="object-cover object-center"
						sizes="100vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

					{/* Category badge */}
					<div className="absolute bottom-6 left-0 right-0">
						<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
							<span className="inline-block px-3 py-1 bg-[#CC1718] text-white text-xs font-semibold rounded-sm">
								{ARTICLE_CATEGORY_LABELS[article.category]}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Article Body */}
			<section className="w-full bg-white py-10 md:py-14">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Back link */}
					<Link
						href="/news"
						className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#CC1718] transition-colors mb-8"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to News
					</Link>

					{/* Meta */}
					<div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
						<span>{formatDate(article.publishedAt)}</span>
						<span>·</span>
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{article.readingTimeMinutes} min read
						</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
						{article.title}
					</h1>

					{/* Excerpt */}
					<p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed border-l-4 border-[#CC1718] pl-5">
						{article.excerpt}
					</p>

					{/* Divider */}
					<div className="my-8 border-t border-gray-100" />

					{/* Article Content */}
					<div
						className="prose prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm prose-p:md:text-base
              prose-p:mb-5
              prose-a:text-[#CC1718] prose-a:no-underline hover:prose-a:underline"
						dangerouslySetInnerHTML={{ __html: article.content }}
					/>

					{/* Related Project CTA */}
					{relatedProject && (
						<div className="mt-12 p-6 md:p-8 bg-[#f9f9f9] border border-gray-100 rounded-sm">
							<p className="text-xs font-bold uppercase tracking-widest text-[#CC1718] mb-2">
								Related Project
							</p>
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h3 className="text-lg font-bold text-gray-900">
										{relatedProject.name}
									</h3>
									<p className="text-sm text-gray-500 mt-0.5">
										{relatedProject.location}
									</p>
								</div>
								<Link
									href={`/projects/${relatedProject.slug}`}
									className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#CC1718] text-white text-sm font-semibold rounded-sm hover:bg-[#b01415] transition-colors whitespace-nowrap flex-shrink-0"
								>
									View Project <ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Related Articles */}
			{relatedFilled.length > 0 && (
				<section className="w-full bg-[#f9f9f9] py-14 md:py-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-xl md:text-2xl font-bold text-[#CC1718] mb-8">
							More Articles
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{relatedFilled.map((a) => (
								<Link
									key={a.id}
									href={`/news/${a.slug}`}
									className="group flex flex-col sm:flex-row gap-4 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
								>
									{/* Image */}
									<div className="relative w-full sm:w-40 flex-shrink-0 aspect-[16/10] sm:aspect-auto sm:h-auto overflow-hidden">
										<Image
											src={a.featuredImageUrl}
											alt={a.title}
											fill
											className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
											sizes="(max-width: 640px) 100vw, 160px"
										/>
									</div>

									{/* Content */}
									<div className="flex flex-col justify-center p-4 sm:py-4 sm:pr-5 sm:pl-0">
										<span className="text-xs font-semibold text-[#CC1718] mb-1">
											{ARTICLE_CATEGORY_LABELS[a.category]}
										</span>
										<h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#CC1718] transition-colors line-clamp-2">
											{a.title}
										</h3>
										<p className="mt-1.5 text-xs text-gray-400">
											{formatDate(a.publishedAt)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
