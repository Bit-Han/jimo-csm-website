// lib/db/queries/site-settings.ts
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import type { SiteSettingsRow } from "@/lib/db/schema/settings";

// cache() here is React's per-request memoization — unrelated to timeouts.
// It just avoids the same row being fetched twice if both an admin page
// and a public component call this in one request tree. Remove it if you'd
// rather this file be a single plain function with no wrapper at all.

// Sane fallbacks — used only:
//  1. To fill NOT NULL columns outside whichever section is being saved,
//     the very first time this singleton row is ever created.
//  2. On the public site, if the row doesn't exist yet at all.
export const DEFAULT_SITE_SETTINGS = {
	companyName: "Jimo Property Development Limited",
	legalName: "Jimo Property Development Limited",
	companyEmail: "info@jimopropertydevelopment.com",
	tagline: "Property Development",
	description:
		"Premium residential, hospitality, and investment-led real estate developments built with structure, insight, and long-term value.",
	salesEmail: "",
	phone: "+234 000 000 0000",
	whatsappNumber: "+234 000 000 0000",
	whatsappHref: "https://wa.me/234000000000",
	instagramHandle: "@Jimopropertydevelopment",
	address: "32 Sholanke Street, Akoka, Lagos",
	responseTimeNote: "We aim to respond within 24 hours.",
	newLeadEmailEnabled: true,
} as const;

/** Raw row for the admin Settings page — null if never saved before. */
export const getAdminSiteSettings = cache(
	async (): Promise<SiteSettingsRow | null> => {
		console.info("[admin:getAdminSiteSettings] Loading admin site settings");
		const row = await db.query.siteSettings.findFirst({
			where: eq(siteSettings.id, 1),
		});
		console.info(
			`[admin:getAdminSiteSettings] ${row ? "Loaded site settings row" : "No site settings row found"}`,
		);
		return row ?? null;
	},
);

export interface PublicSiteSettings {
	name: string;
	legalName: string;
	tagline: string;
	description: string;
	email: string;
	salesEmail: string;
	phone: string;
	phoneHref: string;
	whatsappHref: string;
	instagramHandle: string;
	instagramUrl: string;
	linkedinUrl: string;
	twitterUrl: string;
	youtubeUrl: string;
	address: string;
	responseTimeNote: string;
}

function toPhoneHref(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	return digits ? `tel:+${digits}` : "tel:";
}

/** What the public site reads — always fully populated. DB values are
 * layered over defaults so a blank field in the admin never breaks a
 * public page (an empty href, a missing address line, etc). */
export const getPublicSiteSettings = cache(
	async (): Promise<PublicSiteSettings> => {
		const row = await getAdminSiteSettings();

		return {
			name: row?.companyName || DEFAULT_SITE_SETTINGS.companyName,
			legalName: row?.legalName || DEFAULT_SITE_SETTINGS.legalName,
			tagline: row?.tagline || DEFAULT_SITE_SETTINGS.tagline,
			description: row?.description || DEFAULT_SITE_SETTINGS.description,
			email: row?.companyEmail || DEFAULT_SITE_SETTINGS.companyEmail,
			salesEmail: row?.salesEmail || DEFAULT_SITE_SETTINGS.salesEmail,
			phone: row?.phone || DEFAULT_SITE_SETTINGS.phone,
			phoneHref: toPhoneHref(row?.phone || DEFAULT_SITE_SETTINGS.phone),
			whatsappHref: row?.whatsappHref || DEFAULT_SITE_SETTINGS.whatsappHref,
			instagramHandle:
				row?.instagramHandle || DEFAULT_SITE_SETTINGS.instagramHandle,
			instagramUrl: row?.instagramUrl || "",
			linkedinUrl: row?.linkedinUrl || "",
			twitterUrl: row?.twitterUrl || "",
			youtubeUrl: row?.youtubeUrl || "",
			address: row?.address || DEFAULT_SITE_SETTINGS.address,
			responseTimeNote:
				row?.responseTimeNote || DEFAULT_SITE_SETTINGS.responseTimeNote,
		};
	},
);
