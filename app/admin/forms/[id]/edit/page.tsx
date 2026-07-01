import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminFormEditPageProps {
	params: Promise<{ id: string }>;
}

export default async function AdminFormEditPage({
	params,
}: AdminFormEditPageProps) {
	const { id } = await params;

	return (
		<AdminPlaceholderPage
			title="Form Builder"
			description={`Editing form "${id}".`}
			stageNote="This becomes the drag-and-drop field builder once we get to this stage."
		/>
	);
}
