// import type { Metadata } from "next";
// import { Container } from "@/components/ui/Container";
// import { InsightsExplorer } from "@/components/public/insight/InsightsExplorer";
// import { getPublishedInsights } from "@/lib/db/queries/insights";
// import { getInsightCategories } from "@/lib/db/queries/insight-categories";

// export const metadata: Metadata = {
// 	title: "Insights",
// 	description:
// 		"Market insight, investment education, and project updates from Jimo Property Development Limited.",
// };

// export const revalidate = 60;

// export default async function InsightsPage() {
// 	const [insights, categories] = await Promise.all([
// 		getPublishedInsights(),
// 		getInsightCategories(),
// 	]);

// 	return (
// 		<>
// 			<section className="bg-cream-100 py-20">
// 				<Container className="max-w-3xl">
// 					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 						Insights
// 					</p>
// 					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
// 						News, market insight, and project updates
// 					</h1>
// 					<p className="mt-4 text-base leading-relaxed text-stone-600">
// 						Read what we are seeing across the Lagos real estate market, how to
// 						think about investment decisions, and the latest updates from
// 						current developments.
// 					</p>
// 				</Container>
// 			</section>

// 			<section className="bg-cream-50 py-16">
// 				<Container>
// 					<InsightsExplorer insights={insights} categories={categories} />
// 				</Container>
// 			</section>
// 		</>
// 	);
// }

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { InsightsExplorer } from "@/components/public/insight/InsightsExplorer";
import { getPublishedInsights } from "@/lib/db/queries/insights";
import { getInsightCategories } from "@/lib/db/queries/insight-categories";

export const metadata: Metadata = {
	title: "Insights",
	description:
		"Market insight, investment education, and project updates from Jimo Property Development Limited.",
};

export const revalidate = 60;

export default async function InsightsPage() {
	const [insights, categories] = await Promise.all([
		getPublishedInsights(),
		getInsightCategories(),
	]);

	const hasInsights = insights.length > 0;

	return (
		<>
			<section className="bg-cream-100 py-20">
				<Container className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						Insights
					</p>

					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
						News, market insight, and project updates
					</h1>

					<p className="mt-4 text-base leading-relaxed text-stone-600">
						Read what we are seeing across the Lagos real estate market, how to
						think about investment decisions, and the latest updates from
						current developments.
					</p>
				</Container>
			</section>

			<section className="bg-cream-50 py-16">
				<Container>
					{hasInsights ? (
						<InsightsExplorer insights={insights} categories={categories} />
					) : (
						<div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white px-8 py-16 text-center shadow-sm">
							<h2 className="text-2xl font-bold text-ink-950">
								No insights available yet
							</h2>

							<p className="mt-3 text-stone-600">
								We&apos;re working on bringing you market insights, investment
								education, and project updates. Please check back soon.
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