

// app/admin/(dashboard)/news-insights/page.tsx
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InsightsExplorer } from "@/components/admin/insights/InsightsExplorer";
import { NewArticleLink } from "@/components/admin/insights/NewArticleLink";
import { getAdminArticleRows } from "@/lib/db/queries/insights";

export const metadata: Metadata = {
  title: "News / Insights | Jimo Command Centre",
};
export const dynamic = "force-dynamic";

export default async function AdminNewsInsightsPage() {
  const articles = await getAdminArticleRows();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="News / Insights"
        description="Publish market insights, construction updates, investment education and project articles."
        action={<NewArticleLink />}
      />
      <InsightsExplorer articles={articles} />
    </div>
  );
}