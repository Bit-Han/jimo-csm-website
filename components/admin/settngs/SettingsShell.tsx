
//@/components/admin/settngs/SettingsShell.tsx
"use client";

import { useState } from "react";
import { SettingsSectionSidebar } from "./SettingsSectionSidebar";
import { CompanyInfoSection } from "./sections/CompanyInfoSection";
import { WebsiteDefaultsSection } from "./sections/WebsiteDefaultsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { settingsSections } from "@/lib/data/admin/settings";
import type {
	CompanyInfoSettings,
	NotificationSettings,
	SettingsSection,
	WebsiteDefaultsSettings,
} from "@/lib/types/admin/settings";

export interface SettingsShellProps {
	companyInfo: CompanyInfoSettings;
	websiteDefaults: WebsiteDefaultsSettings;
	notifications: NotificationSettings;
}

export function SettingsShell({
	companyInfo,
	websiteDefaults,
	notifications,
}: SettingsShellProps) {
	const [activeSection, setActiveSection] = useState<SettingsSection>(
		"company-information",
	);

	return (
		<div className="flex flex-col gap-5 lg:flex-row lg:items-start">
			<SettingsSectionSidebar
				sections={settingsSections}
				activeSection={activeSection}
				onSelect={setActiveSection}
			/>

			<div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-6">
				{activeSection === "company-information" ? (
					<CompanyInfoSection initialData={companyInfo} />
				) : activeSection === "website-defaults" ? (
					<WebsiteDefaultsSection initialData={websiteDefaults} />
				) : (
					<NotificationsSection initialData={notifications} />
				)}
			</div>
		</div>
	);
}