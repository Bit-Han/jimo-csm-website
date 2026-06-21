// // app/(public)/page.tsx
// import { HeroSection } from "@/components/public/HeroSection";
// import { AboutTeaserSection } from "@/components/public/AboutTeaserSection";
// import { FeaturedProjectsSection } from "@/components/public/FeaturedProject";
// import { WhyChooseUsSection } from "@/components/public/whyChooseUsSection";
// import { ContactFormSection } from "@/components/public/ContactForm";
// import { getCompanyPageByType } from "@/lib/services/company-pages.service";
// import { getFormByType } from "@/lib/services/forms.service";
// import { getSectionContent } from "@/lib/utils/company-page-content";
// import type { HeroSectionContent, AboutTeaserContent, WhyChooseUsContent, ContactCtaContent } from "@/lib/types/public-content";

// export default async function HomePage() {
//   const [homePage, contactForm] = await Promise.all([
//     getCompanyPageByType("home"),
//     getFormByType("general_contact"),
//   ]);

//   const hero = getSectionContent<HeroSectionContent>(homePage, "hero");
//   const aboutTeaser = getSectionContent<AboutTeaserContent>(homePage, "about_teaser");
//   const whyChooseUs = getSectionContent<WhyChooseUsContent>(homePage, "why_choose_us");
//   const contactCta = getSectionContent<ContactCtaContent>(homePage, "contact_cta");

//   return (
//     <>
//       {hero && <HeroSection content={hero} />}
//       {aboutTeaser && <AboutTeaserSection content={aboutTeaser} />}
//       <FeaturedProjectsSection />
//       {whyChooseUs && <WhyChooseUsSection content={whyChooseUs} />}
//       {contactCta && <ContactFormSection content={contactCta} form={contactForm} />}
//     </>
//   );
// }


import type { Metadata } from "next";
import HeroSection from "@/components/public/HeroSection";
import VisionSection from "@/components/public/VisionSection";
import FeaturedProjects from "@/components/public/FeaturedProjects";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import ContactCTA from "@/components/public/ContactCTA";
import { FEATURED_PROJECTS } from "@/lib/data/seed-projects";

export const metadata: Metadata = {
  title: "Jimo Property Development Limited — Premium Real Estate in Lagos",
  description:
    "Developing Premium Real Estate with Structure, Insight, and Long-Term Value. Explore our residential and hospitality projects across Lagos.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VisionSection />
      <FeaturedProjects projects={FEATURED_PROJECTS} />
      <WhyChooseUs />
      <ContactCTA />
    </>
  );
}