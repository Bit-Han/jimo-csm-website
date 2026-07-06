import type {
	CompanyInfoSettings,
	SettingsSectionMeta,
	SystemServiceItem,
} from "@/lib/types/admin/settings";

// TODO (integration stage):
// db.query.siteSettings.findFirst()
export const mockCompanyInfoSettings: CompanyInfoSettings = {
	companyName: "Jimo Property Development Limited",
	companyEmail: "hello@jimo.ng",
	salesEmail: "sales@jimo.ng",
	phoneNumber: "+234 803 123 4567",
	whatsappNumber: "+234 803 123 4567",
	officeAddress: "2nd Floor, Jimo Building, Victoria Island, Lagos, Nigeria.",
	instagramUrl: "https://instagram.com/jimoproperty",
	linkedinUrl: "https://linkedin.com/company/jimoproperty",
	twitterUrl: "https://x.com/jimoproperty",
	youtubeUrl: "https://youtube.com/@jimoproperty",
};

export const settingsSections: SettingsSectionMeta[] = [
	{
		id: "company-information",
		label: "Company Information",
		description: "Basic company and contact details",
	},
	{
		id: "website-defaults",
		label: "Website Defaults",
		description: "Configure website global settings",
	},
	{
		id: "crm-integration",
		label: "CRM Integration",
		description: "Connect and configure your CRM",
	},
	{
		id: "email-settings",
		label: "Email Settings",
		description: "Configure outgoing email",
	},
	{
		id: "notifications",
		label: "Notifications",
		description: "Manage system notifications",
	},
	{
		id: "security",
		label: "Security",
		description: "Password and 2FA",
	},
	{
		id: "backup",
		label: "Backup",
		description: "Backups and restore",
	},
	{
		id: "api-keys",
		label: "API Keys",
		description: "Manage API keys",
	},
];

export const mockSystemStatus: SystemServiceItem[] = [
	{
		id: "crm",
		label: "CRM",
		detail: "Connected to HubSpot",
		status: "connected",
	},
	{
		id: "email",
		label: "Email",
		detail: "SMTP via SendGrid",
		status: "active",
	},
	{
		id: "backup",
		label: "Backup",
		detail: "Daily at 02:00 WAT",
		status: "scheduled",
	},
];
