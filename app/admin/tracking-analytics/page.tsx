import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminTrackingAnalyticsPage() {
	return (
		<AdminPlaceholderPage
			title="Tracking & Analytics"
			description="Manage tracking setup, conversion events, pixels and campaign performance measurement."
			stageNote="This becomes the live conversion events dashboard once GA4, Meta Pixel and the rest are wired up."
		/>
	);
}
