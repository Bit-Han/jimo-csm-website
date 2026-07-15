

// import type { Metadata } from "next";
// import Link from "next/link";
// import { Suspense } from "react";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { LeadsExplorer } from "@/components/admin/leads/LeadsExplorer";
// import { LeadSummaryCards } from "@/components/admin/leads/LeadSummaryCards";
// import { LeadsHeaderActions } from "@/components/admin/leads/LeadsHeaderActions";
// import {
//   getAdminLeadListRows,
//   getLeadSummaryStats,
// } from "@/lib/db/queries/leads";

// export const metadata: Metadata = {
//   title: "Leads & Enquiries | Jimo Command Centre",
// };

// // Always fetch fresh — no caching on this page
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function AdminLeadsPage() {
//   // Run both in parallel — never await sequentially
//   const [leads, stats] = await Promise.all([
//     getAdminLeadListRows(200),
//     getLeadSummaryStats(),
//   ]);

//   return (
//     <div className="space-y-6">
//       <AdminPageHeader
//         title="Leads & Enquiries"
//         description={`${stats.totalLeads} total lead${stats.totalLeads !== 1 ? "s" : ""} captured from the website. Manage, assign, and follow up.`}
//         action={<LeadsHeaderActions />}
//       />

//       {leads.length === 0 ? (
//         <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
//           <p className="text-sm font-semibold text-stone-500">
//             No leads yet
//           </p>
//           <p className="max-w-sm text-xs text-stone-400">
//             Leads will appear here as soon as someone submits the contact form
//             or requests a brochure on the public website.
//           </p>
//           <Link
//             href="/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
//           >
//             View Public Site →
//           </Link>
//         </div>
//       ) : (
//         <LeadsExplorer leads={leads} />
//       )}

//       <LeadSummaryCards stats={stats} />
//     </div>
//   );
// }


// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// export default function AdminLeadsPage() {
// 	return (
// 		<AdminPlaceholderPage
// 			title="Leads & Enquiries"
// 			description="View, qualify, assign, export and follow up on all website leads in one place."
// 			stageNote="We'll design this properly once we get here, like you said — including how it ties to the Contact and Brochure form submissions."
// 		/>
// 	);
// }

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadsExplorer } from "@/components/admin/leads/LeadsExplorer";
import { LeadSummaryCards } from "@/components/admin/leads/LeadSummaryCards";
import { LeadsHeaderActions } from "@/components/admin/leads/LeadsHeaderActions";
import { getLeadListRows, getLeadSummaryStats } from "@/lib/data/admin/leads";

export const metadata: Metadata = {
	title: "Leads & Enquiries | Jimo Command Centre",
};

export default function AdminLeadsPage() {
	const leads = getLeadListRows();
	const stats = getLeadSummaryStats();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Leads & Enquiries"
				description="View, qualify, assign, export and follow up on all website leads in one place."
				action={<LeadsHeaderActions />}
			/>
			<LeadsExplorer leads={leads} />
			<LeadSummaryCards stats={stats} />
		</div>
	);
}