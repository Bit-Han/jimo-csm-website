//@/lib/types/admin/settings.ts
export type SettingsSection =
	| "company-information"
	| "website-defaults"
	| "notifications";

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

export interface WebsiteDefaultsSettings {
	legalName: string;
	tagline: string;
	description: string;
	responseTimeNote: string;
}

export interface NotificationSettings {
	newLeadEmailEnabled: boolean;
	newLeadNotificationEmail: string;
}

// No longer used by this page — CRM/Email/Backup/API Keys sections were
// removed. Left here only in case something else still references them;
// safe to delete once you've confirmed nothing else does.
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