import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InsightsExplorer } from "@/components/admin/insights/InsightsExplorer";
import { getAdminArticleRows } from "@/lib/data/admin/articles";

export const metadata: Metadata = {
	title: "News / Insights | Jimo Command Centre",
};

export default function AdminNewsInsightsPage() {
	const articles = getAdminArticleRows();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="News / Insights"
				description="Publish market insights, construction updates, investment education and project articles."
				action={
					<Link
						href="/admin/news-insights/new"
						className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
					>
						<Plus className="h-4 w-4" />
						New Article
					</Link>
				}
			/>
			<InsightsExplorer articles={articles} />
		</div>
	);
}
