import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminProjectsPage() {
	return (
		<AdminPlaceholderPage
			title="Projects"
			description="Manage Jimo development projects, pricing, images, brochures and visibility."
			stageNote="This becomes the full projects table once we wire it to lib/data/projects.ts and project-details.ts."
		/>
	);
}
