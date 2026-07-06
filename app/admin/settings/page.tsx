// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// export default function AdminSettingsPage() {
// 	return (
// 		<AdminPlaceholderPage
// 			title="Settings"
// 			description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
// 			stageNote="This becomes the real settings form once Supabase and HubSpot are connected."
// 		/>
// 	);
// }


import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsShell } from "@/components/admin/settngs/SettingsShell";
import {
  mockCompanyInfoSettings,
  mockSystemStatus,
} from "@/lib/data/admin/settings";

export const metadata: Metadata = {
  title: "Settings | Jimo Command Centre",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
      />
      <SettingsShell
        companyInfo={mockCompanyInfoSettings}
        systemStatus={mockSystemStatus}
      />
    </div>
  );
}