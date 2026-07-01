import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminArticleEditPageProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminArticleEditPage({
	params,
}: AdminArticleEditPageProps) {
	const { slug } = await params;

	return (
		<AdminPlaceholderPage
			title="Article Editor"
			description={`Editing article "${slug}".`}
			stageNote="This becomes the SEO-ready article editor once we get to this stage."
		/>
	);
}
