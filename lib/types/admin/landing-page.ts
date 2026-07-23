// lib/types/admin/landing-page.ts
// Stage 2 only needs the list-row shape and filter state. The full
// LandingPageEditorState (hero fields, theme, CTA/form binding) gets added
// in Stage 3 when we build the builder itself.

export type LandingPagePublishStatus = "draft" | "published";

export interface AdminLandingPageListRow {
	id: string;
	slug: string;
	title: string;
	campaignType: string | null;
	audience: string | null;
	crmTag: string | null;
	// Live project name if the linked project still exists, else falls
	// back to the denormalised slug, else null — same resilience pattern
	// leads.projectSlug uses for a deleted project.
	linkedProjectName: string | null;
	publishStatus: LandingPagePublishStatus;
	updatedAt: string; // pre-formatted for display, e.g. "23 Jul 2026"
}

export interface LandingPageFilterState {
	search: string;
	status: string; // "all" | "draft" | "published"
	campaignType: string; // "all" | a value present in the data
	sort: "newest" | "oldest";
}
