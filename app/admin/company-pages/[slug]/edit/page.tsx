import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminCompanyPageEditProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminCompanyPageEditPage({
	params,
}: AdminCompanyPageEditProps) {
	const { slug } = await params;

	return (
		<AdminPlaceholderPage
			title="Page Editor"
			description={`Editing page "${slug}" — configure sections, CTAs, media and SEO.`}
			stageNote="This becomes the section-by-section editor once we get to this stage."
		/>
	);
}
