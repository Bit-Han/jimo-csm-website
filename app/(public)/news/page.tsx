// app/(public)/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
	SEED_ARTICLES,
	ARTICLE_CATEGORY_LABELS,
	formatDate,
} from "@/lib/data/seed-articles";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
	title: "News & Updates",
	description:
		"Market insights, investment education, project updates, and real estate news from Jimo Property Development Limited.",
};

export default function NewsPage() {
	return (
		<>
			{/* Page Header */}
			<section className="w-full bg-white pt-14 pb-10 md:pt-20 md:pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-4xl md:text-5xl font-bold text-[#CC1718] leading-tight">
						News &amp; Updates
					</h1>
					<p className="mt-3 text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
						Market insights, investment education, project updates, and real
						estate news — straight from the Jimo team.
					</p>
				</div>
			</section>

			{/* Articles Grid */}
			<section className="w-full bg-white pb-20 md:pb-28">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Featured article — first one is larger */}
					{SEED_ARTICLES.length > 0 && (
						<>
							{/* Hero article */}
							<div className="mb-10">
								<Link
									href={`/news/${SEED_ARTICLES[0].slug}`}
									className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
								>
									{/* Image */}
									<div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px] overflow-hidden">
										<Image
											src={SEED_ARTICLES[0].featuredImageUrl}
											alt={SEED_ARTICLES[0].title}
											fill
											priority
											className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
										<span className="absolute top-4 left-4 px-2.5 py-1 bg-[#CC1718] text-white text-xs font-semibold rounded-sm">
											{ARTICLE_CATEGORY_LABELS[SEED_ARTICLES[0].category]}
										</span>
									</div>

									{/* Content */}
									<div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
										<div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
											<span>{formatDate(SEED_ARTICLES[0].publishedAt)}</span>
											<span>·</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{SEED_ARTICLES[0].readingTimeMinutes} min read
											</span>
										</div>

										<h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-[#CC1718] transition-colors">
											{SEED_ARTICLES[0].title}
										</h2>

										<p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
											{SEED_ARTICLES[0].excerpt}
										</p>

										<div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#CC1718]">
											Read article <ArrowRight className="h-4 w-4" />
										</div>
									</div>
								</Link>
							</div>

							{/* Remaining articles — 3 col grid */}
							{SEED_ARTICLES.length > 1 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{SEED_ARTICLES.slice(1).map((article) => (
										<ArticleCard key={article.id} article={article} />
									))}
								</div>
							)}
						</>
					)}

					{SEED_ARTICLES.length === 0 && (
						<div className="py-20 text-center">
							<p className="text-gray-500 text-sm">
								No articles published yet. Check back soon.
							</p>
						</div>
					)}
				</div>
			</section>
		</>
	);
}

function ArticleCard({ article }: { article: (typeof SEED_ARTICLES)[number] }) {
	return (
		<Link
			href={`/news/${article.slug}`}
			className="group flex flex-col bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
		>
			{/* Image */}
			<div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
				<Image
					src={article.featuredImageUrl}
					alt={article.title}
					fill
					className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				<span className="absolute top-3 left-3 px-2 py-0.5 bg-[#CC1718] text-white text-xs font-semibold rounded-sm">
					{ARTICLE_CATEGORY_LABELS[article.category]}
				</span>
			</div>

			{/* Content */}
			<div className="flex flex-col flex-1 p-5">
				<div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
					<span>{formatDate(article.publishedAt)}</span>
					<span>·</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{article.readingTimeMinutes} min read
					</span>
				</div>

				<h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-[#CC1718] transition-colors line-clamp-2">
					{article.title}
				</h2>

				<p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
					{article.excerpt}
				</p>

				<div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#CC1718]">
					Read more <ArrowRight className="h-3.5 w-3.5" />
				</div>
			</div>
		</Link>
	);
}
