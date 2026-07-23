// lib/types/landing-page.ts
// ─────────────────────────────────────────────────────────────────────────────
// The theme registry is the whole extensibility story: to add a new hero
// layout later, add one entry here and one matching component in
// components/public/landing/themes/. The builder's theme picker and the
// public renderer both derive from this array — neither hardcodes a list.
// ─────────────────────────────────────────────────────────────────────────────

export type LandingHeroTheme =
	| "centered"
	| "split-image-right"
	| "split-image-left";

export interface LandingHeroThemeMeta {
	id: LandingHeroTheme;
	label: string;
	description: string;
	// Drives whether the builder shows the image upload field at all —
	// this is what makes "a theme with no background image" possible.
	requiresBackgroundImage: boolean;
	// Small static swatch class shown in the theme picker grid — no need
	// to render a live iframe just to let the admin choose a layout.
	previewClassName: string;
}

export const LANDING_HERO_THEMES: LandingHeroThemeMeta[] = [
	{
		id: "centered",
		label: "Centered — No Image",
		description:
			"Solid brand-colour background, centred headline and CTA. No image required.",
		requiresBackgroundImage: false,
		previewClassName: "bg-red-600",
	},
	{
		id: "split-image-right",
		label: "Split — Image Right",
		description:
			"Headline and CTA on the left, a full-height image on the right.",
		requiresBackgroundImage: true,
		previewClassName: "bg-gradient-to-r from-ink-950 to-ink-950/40",
	},
	{
		id: "split-image-left",
		label: "Split — Image Left",
		description:
			"Full-height image on the left, headline and CTA on the right.",
		requiresBackgroundImage: true,
		previewClassName: "bg-gradient-to-l from-ink-950 to-ink-950/40",
	},
];

export function getThemeMeta(theme: LandingHeroTheme): LandingHeroThemeMeta {
	return (
		LANDING_HERO_THEMES.find((t) => t.id === theme) ?? LANDING_HERO_THEMES[0]!
	);
}

export interface LandingHeroCta {
	label: string;
	// References forms.id — which existing Form this button reveals as an
	// overlay. Nullable-in-spirit at draft time (empty string), required
	// non-empty before publish.
	formId: string;
}

export interface LandingHeroContent {
	theme: LandingHeroTheme;
	eyebrow: string; // small label above headline, e.g. "JIMO Residences"
	badgeText: string; // pill badge, e.g. "YABA, LAGOS"
	headline: string;
	subheadline: string;
	backgroundImageUrl: string | null;
	backgroundImageAlt: string;
	accentColor: "red" | "gold" | "ink";
	primaryCta: LandingHeroCta;
	secondaryCta: LandingHeroCta | null;
}

export const EMPTY_LANDING_HERO: LandingHeroContent = {
	theme: "centered",
	eyebrow: "",
	badgeText: "",
	headline: "",
	subheadline: "",
	backgroundImageUrl: null,
	backgroundImageAlt: "",
	accentColor: "red",
	primaryCta: { label: "Register Interest", formId: "" },
	secondaryCta: null,
};
