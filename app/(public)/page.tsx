
// pages/index.tsx
import { HeroSection } from "@/components/public/HomeSection";
import { AboutSection } from "@/components/public/AboutSection";
import { FeaturedProjectsSection } from "@/components/public/projects/FeaturedProjectsSection";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { HowWeWorkSection } from "@/components/public/HowWeWorkSection";
import { CtaSection } from "@/components/public/CtaSection";
import { getHomePageContent } from "@/lib/db/queries/content";
import { getFeaturedProjects } from "@/lib/db/queries/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const [pageData, featuredProjects] = await Promise.all([
		getHomePageContent(),
		getFeaturedProjects(3),
	]);

	return (
		<>
			<HeroSection data={pageData.hero} />
			<AboutSection data={pageData.about} />
			<FeaturedProjectsSection
				data={pageData.featured}
				projects={featuredProjects}
			/>
			<WhyChooseSection data={pageData.whyChoose} />
			<HowWeWorkSection data={pageData.howWeWork} />
			<CtaSection data={pageData.cta} />
		</>
	);
}