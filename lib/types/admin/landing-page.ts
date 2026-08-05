


// lib/types/admin/landing-page.ts
import type { LandingHeroContent } from "@/lib/types/landing-page";
import { EMPTY_LANDING_HERO } from "@/lib/types/landing-page";

export type LandingPagePublishStatus = "draft" | "published";

export interface AdminLandingPageListRow {
	id: string;
	slug: string;
	title: string;
	campaignType: string | null;
	audience: string | null;
	crmTag: string | null;
	linkedProjectName: string | null;
	publishStatus: LandingPagePublishStatus;
	updatedAt: string;
}

export interface LandingPageFilterState {
	search: string;
	status: string;
	campaignType: string;
	sort: "newest" | "oldest";
}

// ─── Editor ─────────────────────────────────────────────────────────────────

export interface LandingPageEditorState {
	id: string; // "" for a brand-new, unsaved page
	slug: string;
	title: string;
	campaignType: string;
	audience: string;
	crmTag: string;
	linkedProjectSlug: string;
	linkedProjectName: string;
	hero: LandingHeroContent;
	publishStatus: LandingPagePublishStatus;
}

export type LandingPageSaveStatus = "idle" | "saving" | "saved" | "error";

export const DEFAULT_LANDING_PAGE_STATE: LandingPageEditorState = {
	id: "",
	slug: "",
	title: "",
	campaignType: "",
	audience: "",
	crmTag: "",
	linkedProjectSlug: "",
	linkedProjectName: "",
	hero: EMPTY_LANDING_HERO,
	publishStatus: "draft",
};

export interface FormPickerOption {
	id: string;
	title: string;
	status: string;
}

export interface ProjectPickerOption {
	slug: string;
	name: string;
}