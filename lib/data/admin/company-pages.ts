import type {
	AdminCompanyPageListRow,
	CompanyPageSlug,
} from "@/lib/types/admin/company-pages";

// TODO (integration stage):
// db.query.companyContent.findFirst() — reads the singleton row
// db.query.homeContent.findFirst()    — reads the home singleton row
// seo_configs table for per-page SEO status
export const mockCompanyPages: AdminCompanyPageListRow[] = [
	{
		slug: "home",
		title: "Home Page",
		type: "Static Page",
		related: "Global",
		publishStatus: "published",
		seoStatus: "good",
		seoStatusNote: "Good",
		hasPreview: true,
	},
	{
		slug: "about",
		title: "About Us",
		type: "Static Page",
		related: "Global",
		publishStatus: "published",
		seoStatus: "good",
		seoStatusNote: "Good",
		hasPreview: true,
	},
	{
		slug: "services",
		title: "Services",
		type: "Static Page",
		related: "Global",
		publishStatus: "published",
		seoStatus: "good",
		seoStatusNote: "Good",
		hasPreview: true,
	},
];

export function getCompanyPages(): AdminCompanyPageListRow[] {
	return mockCompanyPages;
}

export function getCompanyPageBySlug(
	slug: string,
): AdminCompanyPageListRow | undefined {
	return mockCompanyPages.find((p) => p.slug === slug);
}

// Each page has a different editing surface — this drives the editor label
export const companyPageEditorLabels: Record<CompanyPageSlug, string> = {
	home: "Edit Home Page content, hero image, stats, features, and CTA sections.",
	about: "Edit Who We Are copy, team members, core values, and mission/vision.",
	services:
		"Edit services list, what we develop categories, and the company promise.",
};
