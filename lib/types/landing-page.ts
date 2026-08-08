// // lib/types/landing-page.ts
// // ─────────────────────────────────────────────────────────────────────────────
// // The theme registry is the whole extensibility story: to add a new hero
// // layout later, add one entry here and one matching component in
// // components/public/landing/themes/. The builder's theme picker and the
// // public renderer both derive from this array — neither hardcodes a list.
// // ─────────────────────────────────────────────────────────────────────────────

// export type LandingHeroTheme =
// 	| "centered"
// 	| "split-image-right"
// 	| "split-image-left";

// export interface LandingHeroThemeMeta {
// 	id: LandingHeroTheme;
// 	label: string;
// 	description: string;
// 	// Drives whether the builder shows the image upload field at all —
// 	// this is what makes "a theme with no background image" possible.
// 	requiresBackgroundImage: boolean;
// 	// Small static swatch class shown in the theme picker grid — no need
// 	// to render a live iframe just to let the admin choose a layout.
// 	previewClassName: string;
// }

// export const LANDING_HERO_THEMES: LandingHeroThemeMeta[] = [
// 	{
// 		id: "centered",
// 		label: "Centered — No Image",
// 		description:
// 			"Solid brand-colour background, centred headline and CTA. No image required.",
// 		requiresBackgroundImage: false,
// 		previewClassName: "bg-red-600",
// 	},
// 	{
// 		id: "split-image-right",
// 		label: "Split — Image Right",
// 		description:
// 			"Headline and CTA on the left, a full-height image on the right.",
// 		requiresBackgroundImage: true,
// 		previewClassName: "bg-gradient-to-r from-ink-950 to-ink-950/40",
// 	},
// 	{
// 		id: "split-image-left",
// 		label: "Split — Image Left",
// 		description:
// 			"Full-height image on the left, headline and CTA on the right.",
// 		requiresBackgroundImage: true,
// 		previewClassName: "bg-gradient-to-l from-ink-950 to-ink-950/40",
// 	},
// ];

// export function getThemeMeta(theme: LandingHeroTheme): LandingHeroThemeMeta {
// 	return (
// 		LANDING_HERO_THEMES.find((t) => t.id === theme) ?? LANDING_HERO_THEMES[0]!
// 	);
// }

// export interface LandingHeroCta {
// 	label: string;
// 	// References forms.id — which existing Form this button reveals as an
// 	// overlay. Nullable-in-spirit at draft time (empty string), required
// 	// non-empty before publish.
// 	formId: string;
// }

// export interface LandingHeroContent {
// 	theme: LandingHeroTheme;
// 	eyebrow: string; // small label above headline, e.g. "JIMO Residences"
// 	badgeText: string; // pill badge, e.g. "YABA, LAGOS"
// 	headline: string;
// 	subheadline: string;
// 	backgroundImageUrl: string | null;
// 	backgroundImageAlt: string;
// 	accentColor: "red" | "gold" | "ink";
// 	primaryCta: LandingHeroCta;
// 	secondaryCta: LandingHeroCta | null;
// }

// export const EMPTY_LANDING_HERO: LandingHeroContent = {
// 	theme: "centered",
// 	eyebrow: "",
// 	badgeText: "",
// 	headline: "",
// 	subheadline: "",
// 	backgroundImageUrl: null,
// 	backgroundImageAlt: "",
// 	accentColor: "red",
// 	primaryCta: { label: "Register Interest", formId: "" },
// 	secondaryCta: null,
// };


// export interface PublicFormField {
// 	id: string;
// 	type: string;
// 	label: string;
// 	placeholder: string | null;
// 	required: boolean;
// 	options: { label: string; value: string }[] | null;
// }

// export interface PublicFormForOverlay {
// 	id: string;
// 	title: string;
// 	fields: PublicFormField[];
// }

// export interface PublicLandingPage {
// 	slug: string;
// 	title: string;
// 	hero: LandingHeroContent;
// 	primaryForm: PublicFormForOverlay | null;
// 	secondaryForm: PublicFormForOverlay | null;
// }

// export interface UtmParams {
// 	utmSource?: string;
// 	utmMedium?: string;
// 	utmCampaign?: string;
// }

// // Add to the existing lib/types/landing-page.ts — everything else in that file stays as-is

// export interface PublicFormField {
// 	id: string;
// 	type: string;
// 	label: string;
// 	placeholder: string | null;
// 	required: boolean;
// 	options: { label: string; value: string }[] | null;
// }

// export interface PublicFormForOverlay {
// 	id: string;
// 	title: string;
// 	fields: PublicFormField[];
// }

// export interface PublicLandingPage {
// 	slug: string;
// 	title: string;
// 	hero: LandingHeroContent;
// 	primaryForm: PublicFormForOverlay | null;
// 	secondaryForm: PublicFormForOverlay | null;
// }

// export interface UtmParams {
// 	utmSource?: string;
// 	utmMedium?: string;
// 	utmCampaign?: string;
// }


// lib/types/landing-page.ts
export type LandingHeroTheme =
	| "centered"
	| "bold-gradient"
	| "fullscreen-image"
	| "split-image-right"
	| "split-image-left";

export interface LandingHeroThemeMeta {
	id: LandingHeroTheme;
	label: string;
	description: string;
	requiresBackgroundImage: boolean;
	previewClassName: string;
}

export const LANDING_HERO_THEMES: LandingHeroThemeMeta[] = [
	{
		id: "centered",
		label: "Centered",
		description:
			"Centered headline over a rich gradient with soft glow accents. No image required.",
		requiresBackgroundImage: false,
		previewClassName: "bg-gradient-to-br from-red-700 via-red-800 to-ink-950",
	},
	{
		id: "bold-gradient",
		label: "Bold Gradient",
		description:
			"Vivid gradient, subtle texture, and a floating glass card. No image required — our most eye-catching no-photo layout.",
		requiresBackgroundImage: false,
		previewClassName: "bg-gradient-to-br from-orange-500 via-red-600 to-purple-800",
	},
	{
		id: "fullscreen-image",
		label: "Fullscreen Photo",
		description:
			"Full-bleed photo with the headline anchored at the base — bold, editorial, ad-ready.",
		requiresBackgroundImage: true,
		previewClassName: "bg-gradient-to-t from-ink-950 via-ink-900/60 to-transparent",
	},
	{
		id: "split-image-right",
		label: "Split — Image Right",
		description: "Headline and CTA on the left, a full-height photo on the right.",
		requiresBackgroundImage: true,
		previewClassName: "bg-gradient-to-r from-ink-950 to-ink-950/40",
	},
	{
		id: "split-image-left",
		label: "Split — Image Left",
		description: "Full-height photo on the left, headline and CTA on the right.",
		requiresBackgroundImage: true,
		previewClassName: "bg-gradient-to-l from-ink-950 to-ink-950/40",
	},
];

export function getThemeMeta(theme: LandingHeroTheme): LandingHeroThemeMeta {
	return LANDING_HERO_THEMES.find((t) => t.id === theme) ?? LANDING_HERO_THEMES[0]!;
}

// ── Color schemes ───────────────────────────────────────────────────────────
export type LandingColorScheme =
	| "crimson"
	| "midnight"
	| "gold"
	| "emerald"
	| "ocean"
	| "sunset"
	| "charcoal"
	| "rose";

export interface ColorSchemeMeta {
	id: LandingColorScheme;
	label: string;
	gradientClassName: string;
	orbClassNames: [string, string];
	badgeClassName: string;
}

export const COLOR_SCHEMES: ColorSchemeMeta[] = [
	{ id: "crimson", label: "Crimson", gradientClassName: "from-red-700 via-red-900 to-ink-950", orbClassNames: ["bg-red-500", "bg-amber-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "midnight", label: "Midnight", gradientClassName: "from-ink-900 via-ink-950 to-black", orbClassNames: ["bg-sky-500", "bg-amber-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "gold", label: "Gold", gradientClassName: "from-amber-500 via-amber-600 to-amber-800", orbClassNames: ["bg-amber-300", "bg-red-500"], badgeClassName: "bg-black/20 text-white border border-white/30" },
	{ id: "emerald", label: "Emerald", gradientClassName: "from-emerald-700 via-emerald-900 to-ink-950", orbClassNames: ["bg-emerald-400", "bg-teal-300"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "ocean", label: "Ocean", gradientClassName: "from-sky-700 via-blue-900 to-ink-950", orbClassNames: ["bg-sky-400", "bg-indigo-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "sunset", label: "Sunset", gradientClassName: "from-orange-500 via-red-600 to-purple-800", orbClassNames: ["bg-orange-400", "bg-purple-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "charcoal", label: "Charcoal", gradientClassName: "from-stone-700 via-stone-800 to-stone-950", orbClassNames: ["bg-stone-400", "bg-amber-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
	{ id: "rose", label: "Rose", gradientClassName: "from-rose-500 via-pink-700 to-fuchsia-900", orbClassNames: ["bg-pink-400", "bg-fuchsia-400"], badgeClassName: "bg-white/15 text-white border border-white/20" },
];

// Pages saved before this update stored "red" | "gold" | "ink" in
// accentColor. That's JSONB, never validated against the TS type at the
// DB level, so old values must keep resolving to something sensible
// rather than the renderer breaking on an unrecognised string.
const LEGACY_ACCENT_MAP: Record<string, LandingColorScheme> = {
	red: "crimson",
	gold: "gold",
	ink: "midnight",
};

export function getSchemeMeta(value: string | undefined | null): ColorSchemeMeta {
	const resolvedId = value && value in LEGACY_ACCENT_MAP ? LEGACY_ACCENT_MAP[value] : value;
	return COLOR_SCHEMES.find((s) => s.id === resolvedId) ?? COLOR_SCHEMES[0]!;
}

export type LandingTextColor = "light" | "dark";
export type LandingCtaPresentation = "modal-center" | "modal-side" | "inline-card";

export interface LandingHeroCta {
	label: string;
	formId: string;
}

export interface LandingHeroContent {
	theme: LandingHeroTheme;
	eyebrow: string;
	badgeText: string;
	headline: string;
	subheadline: string;
	backgroundImageUrl: string | null;
	backgroundImageAlt: string;
	// Historically a 3-value palette id; now a LandingColorScheme id. Kept
	// as `string` (not a strict union) so old saved values still type-check
	// and resolve correctly via getSchemeMeta().
	accentColor: string;
	textColor: LandingTextColor;
	ctaPresentation: LandingCtaPresentation;
	primaryCta: LandingHeroCta;
	secondaryCta: LandingHeroCta | null;
}

export interface UtmParams {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
}

export const EMPTY_LANDING_HERO: LandingHeroContent = {
	theme: "centered",
	eyebrow: "",
	badgeText: "",
	headline: "",
	subheadline: "",
	backgroundImageUrl: null,
	backgroundImageAlt: "",
	accentColor: "crimson",
	textColor: "light",
	ctaPresentation: "modal-center",
	primaryCta: { label: "Register Interest", formId: "" },
	secondaryCta: null,
};

// ── Public-facing form/page shapes ──────────────────────────────────────────
export interface PublicFormField {
	id: string;
	type: string;
	label: string;
	placeholder: string | null;
	required: boolean;
	options: { label: string; value: string }[] | null;
}

export interface PublicFormForOverlay {
	id: string;
	title: string;
	fields: PublicFormField[];
}

export interface PublicLandingPage {
	slug: string;
	title: string;
	hero: LandingHeroContent;
	primaryForm: PublicFormForOverlay | null;
	secondaryForm: PublicFormForOverlay | null;
}