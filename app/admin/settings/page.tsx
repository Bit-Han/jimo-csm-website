import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminSettingsPage() {
	return (
		<AdminPlaceholderPage
			title="Settings"
			description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
			stageNote="This becomes the real settings form once Supabase and HubSpot are connected."
		/>
	);
}
