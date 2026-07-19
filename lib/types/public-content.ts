//@types/public-content.ts
export type HeroSectionContent = {
	headline: string;
	subtext: string;
	primaryCtaLabel: string;
	primaryCtaHref: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
	backgroundImageUrl: string;
};

export type AboutTeaserContent = {
	heading: string;
	body: string;
	imageUrl: string;
};

export type WhyChooseUsItem = {
	icon:
		| "shield-check"
		| "clock"
		| "users"
		| "trending-up"
		| "map-pin"
		| "layers";
	title: string;
	description: string;
};

export type WhyChooseUsContent = {
	heading: string;
	items: WhyChooseUsItem[];
};

export type ContactCtaContent = {
	heading: string;
	body: string;
};
