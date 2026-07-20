// export type HomeIconKey =
// 	| "building2"
// 	| "line-chart"
// 	| "shield-check"
// 	| "clipboard-list"
// 	| "trending-up"
// 	| "users";

// export interface HomeCta {
// 	label: string;
// 	href: string;
// }

// export interface HomeImage {
// 	src: string;
// 	alt: string;
// }

// export interface HomeHeroStat {
// 	id: string;
// 	label: string;
// 	icon: HomeIconKey;
// }

// export interface HomeHeroSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// 	primaryCta: HomeCta;
// 	secondaryCta: HomeCta;
// 	stats: HomeHeroStat[];
// 	image: HomeImage;
// 	projectFocusLabel: string;
// 	builtForLabel: string;
// }

// export interface HomeAboutSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// 	image: { src: string; alt: string }; // NEW
// 	cta: { label: string; href: string };
// }

// export interface HomeFeaturedSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// }

// export interface HomeFeatureItem {
// 	id: string;
// 	icon: HomeIconKey;
// 	title: string;
// 	description: string;
// }

// export interface HomeWhyChooseSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// 	features: HomeFeatureItem[];
// }

// export interface HomeWorkStep {
// 	id: string;
// 	number: string;
// 	title: string;
// }

// export interface HomeHowWeWorkSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// 	steps: HomeWorkStep[];
// }

// export interface HomeCtaSection {
// 	eyebrow: string;
// 	heading: string;
// 	description: string;
// 	primaryCta: HomeCta;
// 	secondaryCta: HomeCta;
// }

// export interface HomePageData {
// 	hero: HomeHeroSection;
// 	about: HomeAboutSection;
// 	featured: HomeFeaturedSection;
// 	whyChoose: HomeWhyChooseSection;
// 	howWeWork: HomeHowWeWorkSection;
// 	cta: HomeCtaSection;
// }

export type HomeIconKey =
	| "building2"
	| "line-chart"
	| "shield-check"
	| "clipboard-list"
	| "trending-up"
	| "users";

export interface HomeCta {
	label: string;
	href: string;
}

export interface HomeImage {
	src: string;
	alt: string;
}

export interface HomeHeroStat {
	id: string;
	label: string;
	icon: HomeIconKey;
}

export interface HomeHeroSection {
	eyebrow: string;
	heading: string;
	description: string;
	primaryCta: HomeCta;
	secondaryCta: HomeCta;
	stats: HomeHeroStat[];
	image: HomeImage;
	projectFocusLabel: string;
	builtForLabel: string;
}

export interface HomeAboutSection {
	eyebrow: string;
	heading: string;
	description: string;
	cta: HomeCta;
}

export interface HomeFeaturedSection {
	eyebrow: string;
	heading: string;
	description: string;
}

export interface HomeFeatureItem {
	id: string;
	icon: HomeIconKey;
	title: string;
	description: string;
}

export interface HomeWhyChooseSection {
	eyebrow: string;
	heading: string;
	description: string;
	features: HomeFeatureItem[];
}

export interface HomeWorkStep {
	id: string;
	number: string;
	title: string;
}

export interface HomeHowWeWorkSection {
	eyebrow: string;
	heading: string;
	description: string;
	steps: HomeWorkStep[];
}

export interface HomeCtaSection {
	eyebrow: string;
	heading: string;
	description: string;
	primaryCta: HomeCta;
	secondaryCta: HomeCta;
}

export interface HomePageData {
	hero: HomeHeroSection;
	about: HomeAboutSection;
	featured: HomeFeaturedSection;
	whyChoose: HomeWhyChooseSection;
	howWeWork: HomeHowWeWorkSection;
	cta: HomeCtaSection;
}