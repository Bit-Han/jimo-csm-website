// //@/app/admin/(dashboard)/settings/page.tsx
// import type { Metadata } from "next";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { SettingsShell } from "@/components/admin/settngs/SettingsShell";
// import { getSiteSettings } from "@/lib/db/queries/content";
// import { mockSystemStatus } from "@/lib/data/admin/settings";
// import type { CompanyInfoSettings } from "@/lib/types/admin/settings";

// export const metadata: Metadata = {
// 	title: "Settings | Jimo Command Centre",
// };

// export const dynamic = "force-dynamic";

// export default async function AdminSettingsPage() {
// 	const settings = await getSiteSettings();

// 	// Map DB row to the form shape (with fallbacks if not yet seeded)
// 	const companyInfo: CompanyInfoSettings = {
// 		companyName: settings?.companyName ?? "Jimo Property Development Limited",
// 		companyEmail: settings?.companyEmail ?? "info@jimopropertydevelopment.com",
// 		salesEmail: settings?.salesEmail ?? "sales@jimopropertydevelopment.com",
// 		phoneNumber: settings?.phone ?? "+234 000 000 0000",
// 		whatsappNumber: settings?.phone ?? "+234 000 000 0000",
// 		officeAddress: settings?.address ?? "32 Sholanke Street, Akoka, Lagos",
// 		instagramUrl: settings?.instagramUrl ?? "",
// 		linkedinUrl: settings?.linkedinUrl ?? "",
// 		twitterUrl: settings?.twitterUrl ?? "",
// 		youtubeUrl: settings?.youtubeUrl ?? "",
// 	};

// 	return (
// 		<div className="space-y-6">
// 			<AdminPageHeader
// 				title="Settings"
// 				description="Manage company information, CRM integration, email notifications, security, API keys and website defaults."
// 			/>
// 			<SettingsShell
// 				companyInfo={companyInfo}
// 				systemStatus={mockSystemStatus}
// 			/>
// 		</div>
// 	);
// }


//@/app/admin/(dashboard)/settings/page.tsx
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsShell } from "@/components/admin/settngs/SettingsShell";
import { getAdminSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db/queries/site-settings";
import type {
	CompanyInfoSettings,
	NotificationSettings,
	WebsiteDefaultsSettings,
} from "@/lib/types/admin/settings";

export const metadata: Metadata = {
	title: "Settings | Jimo Command Centre",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
	const settings = await getAdminSiteSettings();

	const companyInfo: CompanyInfoSettings = {
		companyName: settings?.companyName ?? DEFAULT_SITE_SETTINGS.companyName,
		companyEmail: settings?.companyEmail ?? DEFAULT_SITE_SETTINGS.companyEmail,
		salesEmail: settings?.salesEmail ?? "",
		phoneNumber: settings?.phone ?? DEFAULT_SITE_SETTINGS.phone,
		whatsappNumber: settings?.whatsappNumber ?? DEFAULT_SITE_SETTINGS.whatsappNumber,
		officeAddress: settings?.address ?? DEFAULT_SITE_SETTINGS.address,
		instagramUrl: settings?.instagramUrl ?? "",
		linkedinUrl: settings?.linkedinUrl ?? "",
		twitterUrl: settings?.twitterUrl ?? "",
		youtubeUrl: settings?.youtubeUrl ?? "",
	};

	const websiteDefaults: WebsiteDefaultsSettings = {
		legalName: settings?.legalName ?? DEFAULT_SITE_SETTINGS.legalName,
		responseTimeNote: settings?.responseTimeNote ?? DEFAULT_SITE_SETTINGS.responseTimeNote,
	};

	const notifications: NotificationSettings = {
		newLeadEmailEnabled: settings?.newLeadEmailEnabled ?? DEFAULT_SITE_SETTINGS.newLeadEmailEnabled,
		newLeadNotificationEmail:
			settings?.newLeadNotificationEmail ?? settings?.salesEmail ?? "",
	};

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Settings"
				description="Manage company information, website defaults, and lead notification preferences."
			/>
			<SettingsShell
				companyInfo={companyInfo}
				websiteDefaults={websiteDefaults}
				notifications={notifications}
			/>
		</div>
	);
}