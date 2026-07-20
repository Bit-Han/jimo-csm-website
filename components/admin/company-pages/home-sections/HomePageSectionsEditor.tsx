"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Accordion } from "@/components/admin/ui/Accordion";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { AboutSectionEditor } from "./AboutSectionEditor";
import { FeaturedSectionEditor } from "./FeaturedSectionEditor";
import { WhyChooseSectionEditor } from "./WhyChooseSectionEditor";
import { HowWeWorkSectionEditor } from "./HowWeWorkSectionEditor";
import { CtaSectionEditor } from "./CtaSectionEditor";
import type { HomePageData } from "@/lib/types/home";

export function HomePageSectionsEditor({
	initialData,
}: {
	initialData: HomePageData;
}) {
	return (
		<div className="space-y-5">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-ink-950">
						Edit Home Page
					</h1>
					<p className="mt-1 text-sm text-stone-500">
						Expand each section to edit its text and images. Every section saves
						independently — editing one won&apos;t affect the others.
					</p>
				</div>
				<Link
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex shrink-0 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
				>
					<ExternalLink className="h-4 w-4" />
					Preview live site
				</Link>
			</div>

			<Accordion
				title="Hero Section"
				description="Background image, heading, description, CTA buttons, and stats row"
				defaultOpen
			>
				<HeroSectionEditor initial={initialData.hero} />
			</Accordion>

			<Accordion
				title="About Teaser"
				description="Image, heading, paragraph, and link shown below the hero"
			>
				<AboutSectionEditor initial={initialData.about} />
			</Accordion>

			<Accordion
				title="Featured Projects Section"
				description="Eyebrow, heading, and description above the project cards"
			>
				<FeaturedSectionEditor initial={initialData.featured} />
			</Accordion>

			<Accordion
				title="Why Choose Jimo"
				description="Heading and the 4 feature cards"
			>
				<WhyChooseSectionEditor initial={initialData.whyChoose} />
			</Accordion>

			<Accordion
				title="How We Work"
				description="Heading and the numbered process steps"
			>
				<HowWeWorkSectionEditor initial={initialData.howWeWork} />
			</Accordion>

			<Accordion
				title="Bottom CTA Banner"
				description="Heading, description, and two buttons"
			>
				<CtaSectionEditor initial={initialData.cta} />
			</Accordion>
		</div>
	);
}
