// import type { Metadata } from "next";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { SettingsShell } from "@/components/admin/settngs/SettingsShell";
// import {
//   mockCompanyInfoSettings,
//   mockSystemStatus,
// } from "@/lib/data/admin/settings";

// export const metadata: Metadata = {
//   title: "Settings | Jimo Command Centre",
// };

// export default function AdminSettingsPage() {
//   return (
//     <div className="space-y-6">
//       <AdminPageHeader
//         title="Settings"
//         description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
//       />
//       <SettingsShell
//         companyInfo={mockCompanyInfoSettings}
//         systemStatus={mockSystemStatus}
//       />
//     </div>
//   );
// }

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsShell } from "@/components/admin/settngs/SettingsShell";
import { getSiteSettings } from "@/lib/db/queries/content";
import { mockSystemStatus } from "@/lib/data/admin/settings";
import type { CompanyInfoSettings } from "@/lib/types/admin/settings";

export const metadata: Metadata = {
	title: "Settings | Jimo Command Centre",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
	const settings = await getSiteSettings();

	// Map DB row to the form shape (with fallbacks if not yet seeded)
	const companyInfo: CompanyInfoSettings = {
		companyName: settings?.companyName ?? "Jimo Property Development Limited",
		companyEmail: settings?.companyEmail ?? "info@jimopropertydevelopment.com",
		salesEmail: settings?.salesEmail ?? "sales@jimopropertydevelopment.com",
		phoneNumber: settings?.phone ?? "+234 000 000 0000",
		whatsappNumber: settings?.phone ?? "+234 000 000 0000",
		officeAddress: settings?.address ?? "32 Sholanke Street, Akoka, Lagos",
		instagramUrl: settings?.instagramUrl ?? "",
		linkedinUrl: settings?.linkedinUrl ?? "",
		twitterUrl: settings?.twitterUrl ?? "",
		youtubeUrl: settings?.youtubeUrl ?? "",
	};

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Settings"
				description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
			/>
			<SettingsShell
				companyInfo={companyInfo}
				systemStatus={mockSystemStatus}
			/>
		</div>
	);
}