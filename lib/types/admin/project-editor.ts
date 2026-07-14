// export type ProjectEditorTab =
// 	| "basic-info"
// 	| "hero"
// 	| "units-pricing"
// 	| "payment-plan"
// 	| "gallery"
// 	| "brochure"
// 	| "enquiry"
// 	| "seo";

// export const EDITOR_TABS: { id: ProjectEditorTab; label: string }[] = [
// 	{ id: "basic-info", label: "Basic Info" },
// 	{ id: "hero", label: "Hero" },
// 	{ id: "units-pricing", label: "Units & Pricing" },
// 	{ id: "payment-plan", label: "Payment Plan" },
// 	{ id: "gallery", label: "Gallery" },
// 	{ id: "brochure", label: "Brochure" },
// 	{ id: "enquiry", label: "Enquiry" },
// 	{ id: "seo", label: "SEO" },
// ];

// export interface EditorUnit {
// 	id: string;
// 	name: string;
// 	icon: "home" | "building";
// 	priceLabel: string;
// 	availabilityLabel: string;
// 	ctaLabel: string;
// 	ctaHref: string;
// }

// export interface EditorChecklistItem {
// 	id: string;
// 	label: string;
// }

// export interface EditorMediaItem {
// 	id: string;
// 	type: "image" | "video";
// 	src: string;
// 	alt: string;
// 	cloudinaryPublicId?: string;
// 	poster?: string;
// }

// export interface EditorFact {
// 	id: string;
// 	label: string;
// 	value: string;
// }

// export interface ProjectEditorState {
// 	// Basic Info
// 	name: string;
// 	location: string;
// 	status: "completed" | "under-development";
// 	categories: ("residential" | "hospitality")[];
// 	statusLabel: string;
// 	categoryLabel: string;
// 	developerLabel: string;
// 	typeLabel: string;
// 	description: string;
// 	overview: string[];
// 	facts: EditorFact[];

// 	// Hero
// 	coverImageSrc: string;
// 	coverImageAlt: string;

// 	// Units & Pricing
// 	unitsSectionEyebrow: string;
// 	unitsSectionHeading: string;
// 	unitsSectionDescription: string;
// 	units: EditorUnit[];

// 	// Investment Highlights (lives in Basic Info tab)
// 	investmentHighlights: EditorChecklistItem[];

// 	// Payment Plan
// 	paymentPlan: EditorChecklistItem[];

// 	// Gallery
// 	media: EditorMediaItem[];

// 	// Enquiry
// 	contactCtaTitle: string;
// 	contactCtaDescription: string;

// 	// SEO
// 	seoTitle: string;
// 	seoDescription: string;
// 	focusKeyword: string;
// 	noIndex: boolean;
// }

// export type SaveStatus = "idle" | "saving" | "saved" | "error";

// export const DEFAULT_EDITOR_STATE: ProjectEditorState = {
// 	name: "",
// 	location: "",
// 	status: "under-development",
// 	categories: ["residential"],
// 	statusLabel: "Under-Development",
// 	categoryLabel: "Residential",
// 	developerLabel: "Jimo Development",
// 	typeLabel: "",
// 	description: "",
// 	overview: [""],
// 	facts: [
// 		{ id: "fact-location", label: "Location", value: "" },
// 		{ id: "fact-status", label: "Status", value: "" },
// 		{ id: "fact-type", label: "Project Type", value: "" },
// 		{ id: "fact-units", label: "Unit Types", value: "" },
// 		{ id: "fact-price", label: "Starting Price", value: "" },
// 		{ id: "fact-delivery", label: "Delivery", value: "" },
// 		{ id: "fact-title", label: "Title", value: "" },
// 	],
// 	coverImageSrc: "",
// 	coverImageAlt: "",
// 	unitsSectionEyebrow: "FLEXIBLE LIVING SPACE",
// 	unitsSectionHeading: "Choose Your Ideal Home",
// 	unitsSectionDescription:
// 		"Thoughtfully designed units to match your lifestyle and investment goals.",
// 	units: [],
// 	investmentHighlights: [],
// 	paymentPlan: [],
// 	media: [],
// 	contactCtaTitle: "",
// 	contactCtaDescription: "",
// 	seoTitle: "",
// 	seoDescription: "",
// 	focusKeyword: "",
// 	noIndex: false,
// };

export type ProjectEditorTab =
	| "basic-info"
	| "hero"
	| "units-pricing"
	| "payment-plan"
	| "gallery"
	| "brochure"
	| "enquiry"
	| "seo";

export const EDITOR_TABS: { id: ProjectEditorTab; label: string }[] = [
	{ id: "basic-info", label: "Basic Info" },
	{ id: "hero", label: "Hero" },
	{ id: "units-pricing", label: "Units & Pricing" },
	{ id: "payment-plan", label: "Payment Plan" },
	{ id: "gallery", label: "Gallery" },
	{ id: "brochure", label: "Brochure" },
	{ id: "enquiry", label: "Enquiry" },
	{ id: "seo", label: "SEO" },
];

export interface EditorUnit {
	id: string;
	name: string;
	icon: "home" | "building";
	priceLabel: string;
	availabilityLabel: string;
	ctaLabel: string;
	ctaHref: string;
}

export interface EditorChecklistItem {
	id: string;
	label: string;
}

// NEW — amenity with icon key stored as a string
export interface EditorAmenity {
	id: string;
	label: string;
	icon: string;
}

export interface EditorMediaItem {
	id: string;
	type: "image" | "video";
	src: string;
	alt: string;
	cloudinaryPublicId?: string;
	poster?: string;
}

export interface EditorFact {
	id: string;
	label: string;
	value: string;
}

export interface ProjectEditorState {
	// Basic Info
	name: string;
	location: string;
	status: "completed" | "under-development";
	categories: ("residential" | "hospitality")[];
	statusLabel: string;
	categoryLabel: string;
	developerLabel: string;
	typeLabel: string;
	description: string;
	overview: string[];
	facts: EditorFact[];
	amenities: EditorAmenity[]; // ← ADDED

	// Hero
	coverImageSrc: string;
	coverImageAlt: string;

	// Units & Pricing
	unitsSectionEyebrow: string;
	unitsSectionHeading: string;
	unitsSectionDescription: string;
	units: EditorUnit[];

	// Checklist items
	investmentHighlights: EditorChecklistItem[];
	paymentPlan: EditorChecklistItem[];

	// Gallery
	media: EditorMediaItem[];

	// Enquiry
	contactCtaTitle: string;
	contactCtaDescription: string;

	// SEO
	seoTitle: string;
	seoDescription: string;
	focusKeyword: string;
	noIndex: boolean;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export const DEFAULT_EDITOR_STATE: ProjectEditorState = {
	name: "",
	location: "",
	status: "under-development",
	categories: ["residential"],
	statusLabel: "Under-Development",
	categoryLabel: "Residential",
	developerLabel: "Jimo Development",
	typeLabel: "",
	description: "",
	overview: [""],
	facts: [
		{ id: "fact-location", label: "Location", value: "" },
		{ id: "fact-status", label: "Status", value: "" },
		{ id: "fact-type", label: "Project Type", value: "" },
		{ id: "fact-units", label: "Unit Types", value: "" },
		{ id: "fact-price", label: "Starting Price", value: "" },
		{ id: "fact-delivery", label: "Delivery", value: "" },
		{ id: "fact-title", label: "Title", value: "" },
	],
	amenities: [], // ← ADDED
	coverImageSrc: "",
	coverImageAlt: "",
	unitsSectionEyebrow: "FLEXIBLE LIVING SPACE",
	unitsSectionHeading: "Choose Your Ideal Home",
	unitsSectionDescription:
		"Thoughtfully designed units to match your lifestyle and investment goals.",
	units: [],
	investmentHighlights: [],
	paymentPlan: [],
	media: [],
	contactCtaTitle: "",
	contactCtaDescription: "",
	seoTitle: "",
	seoDescription: "",
	focusKeyword: "",
	noIndex: false,
};