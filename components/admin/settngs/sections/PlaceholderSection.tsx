import { Construction } from "lucide-react";
import type { SettingsSection } from "@/lib/types/admin/settings";

const SECTION_NOTES: Record<SettingsSection, string> = {
	"company-information": "",
	"website-defaults":
		"Global defaults: default meta title template, favicon, theme colour, footer links. Wired to siteSettings table in the integration stage.",
	"crm-integration":
		"HubSpot API key, pipeline mapping, contact sync settings. Connected once the HubSpot integration stage is reached.",
	"email-settings":
		"SMTP / SendGrid / Resend configuration for transactional emails: lead auto-responses, brochure delivery, invite emails.",
	notifications:
		"Slack webhook, email digest, in-app alert preferences per admin role.",
	security:
		"Password change, 2FA setup (TOTP), active session management, IP allowlist.",
	backup:
		"Daily automated backup schedule, manual backup trigger, restore points. Managed via Supabase database backups.",
	"api-keys":
		"Generate and revoke API keys for headless integrations, partner portals, or external marketing tools.",
};

export function PlaceholderSection({
	sectionId,
}: {
	sectionId: SettingsSection;
}) {
	const note = SECTION_NOTES[sectionId];

	return (
		<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
			<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-500">
				<Construction className="h-6 w-6" />
			</span>
			<p className="text-sm font-semibold text-ink-950">
				Coming in the integration stage
			</p>
			{note ? <p className="max-w-md text-sm text-stone-500">{note}</p> : null}
		</div>
	);
}
