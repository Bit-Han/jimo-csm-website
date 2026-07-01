import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminBrochuresPage() {
	return (
		<AdminPlaceholderPage
			title="Brochures"
			description="Upload, version, gate and attach project brochures to landing pages and project pages."
			stageNote="This becomes the brochures table once we wire it to Supabase Storage."
		/>
	);
}