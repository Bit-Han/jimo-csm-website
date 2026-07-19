//company-pages/page.tsx

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompanyPagesExplorer } from "@/components/admin/company-pages/CompanyPagesExplorer";
import { getCompanyPages } from "@/lib/data/admin/company-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Company Pages | Jimo Command Centre",
};

export default function AdminCompanyPagesPage() {
	const pages = getCompanyPages();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Company Pages"
				description="Edit home, about, services, corporate statement, contact and legal pages."
			/>
			<CompanyPagesExplorer pages={pages} />
		</div>
	);
}
