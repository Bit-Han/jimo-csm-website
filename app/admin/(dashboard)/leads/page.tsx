// //@/admin/(dashboard)/leads/page.tsx
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadsPageClient } from "@/components/admin/leads/LeadsPageClient";
import {
	getAssignableAdmins,
	getLeadFilterOptions,
	getLeadSummaryStats,
	getPaginatedLeads,
} from "@/lib/data/admin/leads";

export const metadata: Metadata = {
	title: "Leads & Enquiries | Jimo Command Centre",
};

// force-dynamic because every request must reflect the latest lead data.
// Caching even for 60 s would mean an admin sees stale rows.
export const dynamic = "force-dynamic";

interface AdminLeadsPageProps {
	searchParams: Promise<{
		page?: string;
		status?: string;
		source?: string;
		project?: string;
		landingPage?: string;
		search?: string;
		sort?: string;
	}>;
}

export default async function AdminLeadsPage({
	searchParams,
}: AdminLeadsPageProps) {
	const params = await searchParams;

	const filters = {
		page: Math.max(1, parseInt(params.page ?? "1", 10) || 1),
		status: params.status,
		source: params.source,
		projectSlug: params.project,
		landingPageSlug: params.landingPage,
		search: params.search,
		sort: (params.sort as "newest" | "oldest") ?? "newest",
	};

	// All four run in parallel:
	// - getPaginatedLeads: always fresh, never cached
	// - getLeadSummaryStats: fresh (counts change as leads come in)
	// - getAssignableAdmins: cached 5 min (admin roster rarely changes)
	// - getLeadFilterOptions: cached 60 s (project/landing-page list changes rarely)
	const [result, stats, admins, filterOptions] = await Promise.all([
		getPaginatedLeads(filters),
		getLeadSummaryStats(),
		getAssignableAdmins(),
		getLeadFilterOptions(),
	]);

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Leads & Enquiries"
				description="All enquiries from the contact form, brochure downloads, landing pages, and campaigns."
			/>
			<LeadsPageClient
				initialResult={result}
				currentFilters={filters}
				stats={stats}
				admins={admins}
				filterOptions={filterOptions}
			/>
		</div>
	);
}