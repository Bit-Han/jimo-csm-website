import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminProjectEditPageProps {
	params: Promise<{ slug: string }>;
}

export default async function AdminProjectEditPage({
	params,
}: AdminProjectEditPageProps) {
	const { slug } = await params;

	return (
		<AdminPlaceholderPage
			title="Edit Project"
			description={`Editing project "${slug}". Basic Info, Hero, Units & Pricing, Payment Plan, Gallery, Brochure, Enquiry, and SEO tabs land here.`}
			stageNote="This becomes the full tabbed project editor when we build the Projects module."
		/>
	);
}
