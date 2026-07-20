// @/lib/types/admin/company-pages.ts
export type CompanyPageSlug =
	| "home"
	| "about"
	| "services"

export type CompanyPageSeoStatus = "good" | "needs-seo";

export interface AdminCompanyPageListRow {
	slug: CompanyPageSlug;
	title: string;
	type: "Static Page";
	related: "Global";
	publishStatus: "published" | "draft";
	seoStatus: CompanyPageSeoStatus;
	seoStatusNote: string;
	hasPreview: boolean;
}

export interface CompanyPageEditorSection {
	id: string;
	label: string;
	description: string;
}
