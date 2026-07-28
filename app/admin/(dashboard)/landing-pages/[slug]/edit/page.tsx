// //@app/admin/(dasahboard)/landing-pages/[slug]/edit/page.tsx
// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// interface AdminLandingPageEditProps {
// 	params: Promise<{ slug: string }>;
// }

// export default async function AdminLandingPageEditPage({
// 	params,
// }: AdminLandingPageEditProps) {
// 	const { slug } = await params;

// 	return (
// 		<AdminPlaceholderPage
// 			title="Landing Page Builder"
// 			description={`Editing landing page "${slug}".`}
// 			stageNote="This becomes the drag-and-drop section builder once we get to this stage."
// 		/>
// 	);
// }



// app/admin/(dashboard)/landing-pages/[slug]/edit/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageEditorShell } from "@/components/admin/landing-pages/editor/LandingPageEditorShell";
import {
	getFormOptionsForPicker,
	getProjectOptionsForPicker,
	getLandingPageEditorState,
} from "@/lib/db/queries/landing-pages";
import { timed } from "@/lib/utils/timed";
import type { LandingPageEditorState } from "@/lib/types/admin/landing-page";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const row = await getLandingPageEditorState(slug);
	return { title: row ? `Edit: ${row.title} | Jimo Command Centre` : "Landing Page Builder" };
}

export const dynamic = "force-dynamic";

export default async function AdminEditLandingPagePage({ params }: Props) {
	const { slug } = await params;

	const [row, forms, projects] = await Promise.all([
		timed("getLandingPageEditorState", getLandingPageEditorState(slug)),
		timed("getFormOptionsForPicker", getFormOptionsForPicker()),
		timed("getProjectOptionsForPicker", getProjectOptionsForPicker()),
	]);

	if (!row) notFound();

	const state: LandingPageEditorState = {
		id: row.id,
		slug: row.slug,
		title: row.title,
		campaignType: row.campaignType ?? "",
		audience: row.audience ?? "",
		crmTag: row.crmTag ?? "",
		linkedProjectSlug: row.linkedProjectSlug ?? "",
		linkedProjectName: "",
		hero: row.hero,
		publishStatus: row.publishStatus as "draft" | "published",
	};

	return (
		<LandingPageEditorShell initialState={state} mode="edit" forms={forms} projects={projects} />
	);
}