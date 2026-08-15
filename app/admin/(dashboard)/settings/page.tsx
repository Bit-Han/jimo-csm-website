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
		tagline: settings?.tagline ?? DEFAULT_SITE_SETTINGS.tagline,
		description: settings?.description ?? DEFAULT_SITE_SETTINGS.description,
		responseTimeNote:
			settings?.responseTimeNote ?? DEFAULT_SITE_SETTINGS.responseTimeNote,
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