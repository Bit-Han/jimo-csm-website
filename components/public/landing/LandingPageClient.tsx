// components/public/landing/LandingPageClient.tsx
"use client";

import { useState } from "react";
import { HeroThemeRenderer } from "./HeroThemeRenderer";
import { FormOverlay } from "./FormOverlay";
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
	const [activeForm, setActiveForm] = useState<PublicFormForOverlay | null>(
		null,
	);

	return (
		<>
			<HeroThemeRenderer
				hero={hero}
				onPrimaryCtaClick={() => primaryForm && setActiveForm(primaryForm)}
				onSecondaryCtaClick={() =>
					secondaryForm && setActiveForm(secondaryForm)
				}
			/>
			{activeForm ? (
				<FormOverlay
					form={activeForm}
					landingPageSlug={slug}
					utm={utm}
					onClose={() => setActiveForm(null)}
				/>
			) : null}
		</>
	);
}
