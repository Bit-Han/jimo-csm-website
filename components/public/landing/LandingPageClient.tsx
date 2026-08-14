
// components/public/landing/LandingPageClient.tsx
"use client";

import { useState } from "react";
import { HeroThemeRenderer } from "./HeroThemeRenderer";
import { FormOverlay } from "./FormOverlay";
import { InlineFormCard } from "./InlineFormCard";
import { PageViewTracker } from "@/components/public/tracking/PageViewTracker";
import type {
	LandingHeroContent,
	PublicFormForOverlay,
	UtmParams,
} from "@/lib/types/landing-page";

export function LandingPageClient({
	hero,
	slug,
	primaryForm,
	secondaryForm,
	utm,
}: {
	hero: LandingHeroContent;
	slug: string;
	primaryForm: PublicFormForOverlay | null;
	secondaryForm: PublicFormForOverlay | null;
	utm?: UtmParams;
}) {
	const [activeForm, setActiveForm] = useState<PublicFormForOverlay | null>(null);
	const presentation = hero.ctaPresentation ?? "modal-center";
	const isInline = presentation === "inline-card" && primaryForm !== null;

	function handlePrimaryClick() {
		if (isInline) {
			document.getElementById("lp-inline-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
			return;
		}
		if (primaryForm) setActiveForm(primaryForm);
	}

	function handleSecondaryClick() {
		if (secondaryForm) setActiveForm(secondaryForm);
	}

	return (
		<>
			<PageViewTracker metadata={{ landingPageSlug: slug }} />
			<HeroThemeRenderer
				hero={hero}
				onPrimaryCtaClick={handlePrimaryClick}
				onSecondaryCtaClick={handleSecondaryClick}
				formOverlay={
					isInline && primaryForm ? (
						<InlineFormCard form={primaryForm} landingPageSlug={slug} utm={utm} />
					) : undefined
				}
			/>
			{activeForm ? (
				<FormOverlay
					form={activeForm}
					landingPageSlug={slug}
					utm={utm}
					presentation={presentation === "modal-side" ? "side" : "center"}
					onClose={() => setActiveForm(null)}
				/>
			) : null}
		</>
	);
}