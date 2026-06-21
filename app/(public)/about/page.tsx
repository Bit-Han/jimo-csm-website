// app/(public)/about/page.tsx
import type { Metadata } from "next";
import AboutHero from "@/components/public/about/AboutHero";
import AboutMission from "@/components/public/about/AboutMission";
import AboutVision from "@/components/public/about/AboutVision";
import AboutCoreValues from "@/components/public/about/AboutCoreValues";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Jimo Property Development Limited — our mission, vision, values, and commitment to building premium real estate across Lagos.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <AboutHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-5">
        <AboutMission />
        <AboutVision />
        <AboutCoreValues />
      </div>
      {/* Bottom spacing before footer */}
      <div className="pb-16 md:pb-24" />
    </div>
  );
}