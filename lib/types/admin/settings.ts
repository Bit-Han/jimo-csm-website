export type SettingsSection =
	| "company-information"
	| "website-defaults"
	| "crm-integration"
	| "email-settings"
	| "notifications"
	| "security"
	| "backup"
	| "api-keys";

export interface SettingsSectionMeta {
	id: SettingsSection;
	label: string;
	description: string;
}

export interface CompanyInfoSettings {
	companyName: string;
	companyEmail: string;
	salesEmail: string;
	phoneNumber: string;
	whatsappNumber: string;
	officeAddress: string;
	instagramUrl: string;
	linkedinUrl: string;
	twitterUrl: string;
	youtubeUrl: string;
}

export type SystemServiceStatus =
	| "connected"
	| "active"
	| "scheduled"
	| "disconnected";

export interface SystemServiceItem {
	id: string;
	label: string;
	detail: string;
	status: SystemServiceStatus;
}
