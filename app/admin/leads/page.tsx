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