import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminMediaLibraryPage() {
	return (
		<AdminPlaceholderPage
			title="Media Library"
			description="Organize and manage project renders, construction photos, videos, brochures, logos, and documents."
			stageNote="This becomes the folder + grid view once we wire it to Supabase Storage."
		/>
	);
}
