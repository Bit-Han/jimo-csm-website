//@app/admin/(dasahboard)/landing-pages/[slug]/edit/page.tsx
import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminLandingPageEditProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminLandingPageEditPage({
	params,
}: AdminLandingPageEditProps) {
	const { slug } = await params;

	return (
		<AdminPlaceholderPage
			title="Landing Page Builder"
			description={`Editing landing page "${slug}".`}
			stageNote="This becomes the drag-and-drop section builder once we get to this stage."
		/>
	);
}
