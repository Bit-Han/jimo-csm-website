// //@app/admin/seo-center/page.tsx
// import type { Metadata } from "next";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { SeoHealthGauge } from "@/components/admin/seo-centre/SeoHealthGauge";
// import { SeoStatCards } from "@/components/admin/seo-centre/SeoStatCards";
// import { SeoIssuesTable } from "@/components/admin/seo-centre/SeoIssuesTable";
// import { SeoBottomCards } from "@/components/admin/seo-centre/SeoBottomCards";
// import { SeoAuditButtons } from "@/components/admin/seo-centre/SeoAuditButtons";
// import {
// 	mockSeoChecklist,
// 	mockSeoGlobalSettings,
// 	mockSeoHealthStats,
// 	mockSeoIssues,
// 	mockSeoScore,
// 	mockSitemapStats,
// } from "@/lib/data/admin/seo-centre";

// export const metadata: Metadata = {
// 	title: "SEO Centre | Jimo Command Centre",
// };

// export const dynamic = 'force-dynamic';

// export default function AdminSeoCentrePage() {
// 	return (
// 		<div className="space-y-6">
// 			<AdminPageHeader
// 				title="SEO Centre"
// 				description="Monitor page SEO health, missing metadata, alt text, sitemap and schema status."
// 				action={<SeoAuditButtons />}
// 			/>

// 			<div className="grid gap-5 lg:grid-cols-[auto_1fr]">
// 				<div className="rounded-2xl border border-stone-200 bg-white px-6 py-5">
// 					<SeoHealthGauge score={mockSeoScore} />
// 				</div>
// 				<SeoStatCards stats={mockSeoHealthStats} />
// 			</div>

// 			<SeoIssuesTable issues={mockSeoIssues} />

// 			<SeoBottomCards
// 				settings={mockSeoGlobalSettings}
// 				checklist={mockSeoChecklist}
// 				sitemap={mockSitemapStats}
// 			/>
// 		</div>
// 	);
// }

// app/admin/seo-centre/page.tsx
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeoHealthGauge } from "@/components/admin/seo-centre/SeoHealthGauge";
import { SeoStatCards } from "@/components/admin/seo-centre/SeoStatCards";
import { SeoIssuesTable } from "@/components/admin/seo-centre/SeoIssuesTable";
import { SeoBottomCards } from "@/components/admin/seo-centre/SeoBottomCards";
import { SeoAuditButtons } from "@/components/admin/seo-centre/SeoAuditButtons";
import {
	getAdminSeoIssues,
	getSeoChecklist,
	getSeoGlobalSettings,
	getSeoHealthStats,
	getSeoScore,
	getSitemapStats,
} from "@/lib/db/queries/seo-centre";
import { timed } from "@/lib/utils/timed";

export const metadata: Metadata = { title: "SEO Centre | Jimo Command Centre" };
export const dynamic = "force-dynamic";

export default async function AdminSeoCentrePage() {
	const [score, stats, issues, settings, checklist, sitemapStats] =
		await Promise.all([
			getSeoScore(),
			getSeoHealthStats(),
			getAdminSeoIssues(),
			getSeoGlobalSettings(),
			getSeoChecklist(),
			getSitemapStats(),
		]);

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="SEO Centre"
				description="Monitor page SEO health, missing metadata, alt text, sitemap and schema status."
				action={<SeoAuditButtons />}
			/>
			<div className="grid gap-5 lg:grid-cols-[auto_1fr]">
				<div className="rounded-2xl border border-stone-200 bg-white px-6 py-5">
					<SeoHealthGauge score={score} />
				</div>
				<SeoStatCards stats={stats} />
			</div>
			<SeoIssuesTable issues={issues} />
			<SeoBottomCards
				settings={settings}
				checklist={checklist}
				sitemap={sitemapStats}
			/>
		</div>
	);
}
