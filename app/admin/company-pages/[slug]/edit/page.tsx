// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// interface AdminCompanyPageEditProps {
// 	params: Promise<{ slug: string }>;
// }

// export default async function AdminCompanyPageEditPage({
// 	params,
// }: AdminCompanyPageEditProps) {
// 	const { slug } = await params;

// 	return (
// 		<AdminPlaceholderPage
// 			title="Page Editor"
// 			description={`Editing page "${slug}" — configure sections, CTAs, media and SEO.`}
// 			stageNote="This becomes the section-by-section editor once we get to this stage."
// 		/>
// 	);
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyPageEditor } from "@/components/admin/company-pages/CompanyPageEditor";
import { getCompanyPageBySlug } from "@/lib/data/admin/company-pages";
import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";

interface AdminCompanyPageEditProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: AdminCompanyPageEditProps): Promise<Metadata> {
	const { slug } = await params;
	const page = getCompanyPageBySlug(slug);
	return {
		title: page
			? `Edit ${page.title} | Jimo Command Centre`
			: "Page Editor | Jimo Command Centre",
	};
}

const VALID_SLUGS: CompanyPageSlug[] = [
	"home",
	"about",
	"services",
	"corporate-statement",
];

const PREVIEW_HREFS: Record<CompanyPageSlug, string | null> = {
	home: "/",
	about: "/about",
	services: "/services",
	"corporate-statement": null,
};

export default async function AdminCompanyPageEditPage({
	params,
}: AdminCompanyPageEditProps) {
	const { slug } = await params;

	if (!VALID_SLUGS.includes(slug as CompanyPageSlug)) {
		notFound();
	}

	const page = getCompanyPageBySlug(slug);

	if (!page) {
		notFound();
	}

	const typedSlug = slug as CompanyPageSlug;

	return (
		<CompanyPageEditor
			slug={typedSlug}
			title={page.title}
			previewHref={PREVIEW_HREFS[typedSlug]}
		/>
	);
}