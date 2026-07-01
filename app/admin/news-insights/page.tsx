import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminNewsInsightsPage() {
	return (
		<AdminPlaceholderPage
			title="News / Insights"
			description="Publish market insights, construction updates, investment education and project articles."
			stageNote="This becomes the articles table once we wire it to lib/data/insights.ts."
		/>
	);
}
