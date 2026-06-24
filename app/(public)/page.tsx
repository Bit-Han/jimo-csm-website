import { HeroSection } from "@/components/public/HomeSection";
import { AboutSection } from "@/components/public/AboutSection";
import { FeaturedProjectsSection } from "@/components/public/projects/FeaturedProjectsSection";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { HowWeWorkSection } from "@/components/public/HowWeWorkSection";
import { CtaSection } from "@/components/public/CtaSection";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<FeaturedProjectsSection />
			<WhyChooseSection />
			<HowWeWorkSection />
			<CtaSection />
		</>
	);
}
