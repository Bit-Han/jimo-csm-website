import { HeroSection } from "@/components/public/HomeSection";
import { AboutSection } from "@/components/public/AboutSection";
import { FeaturedProjectsSection } from "@/components/public/projects/FeaturedProjectsSection";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { HowWeWorkSection } from "@/components/public/HowWeWorkSection";
import { CtaSection } from "@/components/public/CtaSection";
import { homePageData } from "@/lib/data/home";
import { featuredProjects } from "@/lib/data/projects";

export default function HomePage() {
	const pageData = homePageData;
	const projects = featuredProjects;
	return (
		<>
			<HeroSection data={pageData.hero} />
			<AboutSection data={pageData.about} />
			<FeaturedProjectsSection data={pageData.featured} projects={projects} />
			<WhyChooseSection data={pageData.whyChoose} />
			<HowWeWorkSection data={pageData.howWeWork} />
			<CtaSection data={pageData.cta} />
		</>
	);
}
