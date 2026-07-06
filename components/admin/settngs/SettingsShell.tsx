"use client";

import { useState } from "react";
import { SettingsSectionSidebar } from "./SettingsSectionSidebar";
import { CompanyInfoSection } from "./sections/CompanyInfoSection";
import { PlaceholderSection } from "./sections/PlaceholderSection";
import { settingsSections } from "@/lib/data/admin/settings";
import type {
	CompanyInfoSettings,
	SettingsSection,
	SystemServiceItem,
} from "@/lib/types/admin/settings";

export interface SettingsShellProps {
	companyInfo: CompanyInfoSettings;
	systemStatus: SystemServiceItem[];
}

export function SettingsShell({
	companyInfo,
	systemStatus,
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
					<CompanyInfoSection
						initialData={companyInfo}
						systemStatus={systemStatus}
					/>
				) : (
					<PlaceholderSection sectionId={activeSection} />
				)}
			</div>
		</div>
	);
}
