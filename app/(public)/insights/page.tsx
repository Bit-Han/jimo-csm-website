import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InsightsExplorer } from "@/components/public/insight/InsightsExplorer";
import { insights } from "@/lib/data/insights";

export const metadata: Metadata = {
	title: "Insights",
	description:
		"Market insight, investment education, and project updates from Jimo Property Development Limited.",
};

export default function InsightsPage() {
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
					<InsightsExplorer insights={insights} />
				</Container>
			</section>
		</>
	);
}
