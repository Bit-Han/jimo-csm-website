// // import type { Metadata } from "next";
// // import { notFound } from "next/navigation";
// // import { CompanyPageEditor } from "@/components/admin/company-pages/CompanyPageEditor";
// // import { getCompanyPageBySlug } from "@/lib/data/admin/company-pages";
// // import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";

// // interface AdminCompanyPageEditProps {
// // 	params: Promise<{ slug: string }>;
// // }

// // export async function generateMetadata({
// // 	params,
// // }: AdminCompanyPageEditProps): Promise<Metadata> {
// // 	const { slug } = await params;
// // 	const page = getCompanyPageBySlug(slug);
// // 	return {
// // 		title: page
// // 			? `Edit ${page.title} | Jimo Command Centre`
// // 			: "Page Editor | Jimo Command Centre",
// // 	};
// // }

// // const VALID_SLUGS: CompanyPageSlug[] = [
// // 	"home",
// // 	"about",
// // 	"services",
// // 	"corporate-statement",
// // ];

// // const PREVIEW_HREFS: Record<CompanyPageSlug, string | null> = {
// // 	home: "/",
// // 	about: "/about",
// // 	services: "/services",
// // 	"corporate-statement": null,
// // };

// // export default async function AdminCompanyPageEditPage({
// // 	params,
// // }: AdminCompanyPageEditProps) {
// // 	const { slug } = await params;

// // 	if (!VALID_SLUGS.includes(slug as CompanyPageSlug)) {
// // 		notFound();
// // 	}

// // 	const page = getCompanyPageBySlug(slug);

// // 	if (!page) {
// // 		notFound();
// // 	}

// // 	const typedSlug = slug as CompanyPageSlug;

// // 	return (
// // 		<CompanyPageEditor
// // 			slug={typedSlug}
// // 			title={page.title}
// // 			previewHref={PREVIEW_HREFS[typedSlug]}
// // 		/>
// // 	);
// // }

// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { CompanyPageEditor } from "@/components/admin/company-pages/CompanyPageEditor";
// import { getCompanyPageBySlug } from "@/lib/data/admin/company-pages";
// import { getCompanyContent } from "@/lib/db/queries/content";
// import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";

// const VALID_SLUGS: CompanyPageSlug[] = [
// 	"home",
// 	"about",
// 	"services",
// 	"corporate-statement",
// ];

// const PREVIEW_HREFS: Record<CompanyPageSlug, string | null> = {
// 	home: "/",
// 	about: "/about",
// 	services: "/services",
// 	"corporate-statement": null,
// };

// interface AdminCompanyPageEditProps {
// 	params: Promise<{ slug: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: AdminCompanyPageEditProps): Promise<Metadata> {
// 	const { slug } = await params;
// 	const page = getCompanyPageBySlug(slug);
// 	return {
// 		title: page
// 			? `Edit ${page.title} | Jimo Command Centre`
// 			: "Page Editor | Jimo Command Centre",
// 	};
// }

// export default async function AdminCompanyPageEditPage({
// 	params,
// }: AdminCompanyPageEditProps) {
// 	const { slug } = await params;

// 	if (!VALID_SLUGS.includes(slug as CompanyPageSlug)) notFound();

// 	const page = getCompanyPageBySlug(slug);
// 	if (!page) notFound();

// 	// Fetch company content from DB for all editable sections
// 	const companyData = await getCompanyContent();
// 	const typedSlug = slug as CompanyPageSlug;

// 	return (
// 		<CompanyPageEditor
// 			slug={typedSlug}
// 			title={page.title}
// 			previewHref={PREVIEW_HREFS[typedSlug]}
// 			whoWeAreData={companyData?.whoWeAre}
// 			teamMembersData={companyData?.teamMembers}
// 			coreValuesData={companyData?.coreValues}
// 			servicesData={companyData?.services}
// 			propertyTypesData={companyData?.propertyTypes}
// 			companyPromiseData={companyData?.companyPromise}
// 		/>
// 	);
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyPageEditor } from "@/components/admin/company-pages/CompanyPageEditor";
import { getCompanyPageBySlug } from "@/lib/data/admin/company-pages";
import {
	getCompanyContent,
	getHomePageContent,
} from "@/lib/db/queries/content";
import type { CompanyPageSlug } from "@/lib/types/admin/company-pages";

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

export default async function AdminCompanyPageEditPage({
	params,
}: AdminCompanyPageEditProps) {
	const { slug } = await params;

	if (!VALID_SLUGS.includes(slug as CompanyPageSlug)) notFound();

	const page = getCompanyPageBySlug(slug);
	if (!page) notFound();

	const typedSlug = slug as CompanyPageSlug;

	// Fetch both company content and home content in parallel
	const [companyData, homeData] = await Promise.all([
		getCompanyContent(),
		typedSlug === "home" ? getHomePageContent() : Promise.resolve(null),
	]);

	return (
		<CompanyPageEditor
			slug={typedSlug}
			title={page.title}
			previewHref={PREVIEW_HREFS[typedSlug]}
			homePageData={homeData}
			whoWeAreData={companyData?.whoWeAre}
			teamMembersData={companyData?.teamMembers}
			coreValuesData={companyData?.coreValues}
			servicesData={companyData?.services}
			propertyTypesData={companyData?.propertyTypes}
			companyPromiseData={companyData?.companyPromise}
		/>
	);
}