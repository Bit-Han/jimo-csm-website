// app/lp/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicLandingPageBySlug } from "@/lib/db/queries/landing-pages";
import { LandingPageClient } from "@/components/public/landing/LandingPageClient";

interface Props {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const page = await getPublicLandingPageBySlug(slug);
	if (!page) return { title: "Page Not Found" };

	return {
		title: page.hero.headline || page.title,
		description: page.hero.subheadline || undefined,
		// Campaign-specific pages generally shouldn't compete for organic
		// search — remove this if you do want a given page indexed.
		robots: { index: false, follow: false },
	};
}

export const dynamic = "force-dynamic";

export default async function PublicLandingPage({
	params,
	searchParams,
}: Props) {
	const { slug } = await params;
	const sp = await searchParams;

	const page = await getPublicLandingPageBySlug(slug);
	if (!page) notFound();

	return (
		<LandingPageClient
			hero={page.hero}
			slug={page.slug}
			primaryForm={page.primaryForm}
			secondaryForm={page.secondaryForm}
			utm={{
				utmSource: sp.utm_source,
				utmMedium: sp.utm_medium,
				utmCampaign: sp.utm_campaign,
			}}
		/>
	);
}
