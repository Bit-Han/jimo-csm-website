// //@/lib/actions/admin/settings.ts

// "use server";

// import type { CompanyInfoSettings } from "@/lib/types/admin/settings";

// export interface SettingsActionResult {
// 	success: boolean;
// 	message: string;
// }

// export async function saveCompanyInfo(
// 	data: CompanyInfoSettings,
// ): Promise<SettingsActionResult> {
// 	// TODO (integration stage):
// 	// db.update(siteSettings)
// 	//   .set({
// 	//     companyName: data.companyName,
// 	//     companyEmail: data.companyEmail,
// 	//     salesEmail: data.salesEmail,
// 	//     phone: data.phoneNumber,
// 	//     whatsappHref: `https://wa.me/${data.whatsappNumber.replace(/\D/g, "")}`,
// 	//     address: data.officeAddress,
// 	//     instagramUrl: data.instagramUrl,
// 	//     linkedinUrl: data.linkedinUrl,
// 	//     twitterUrl: data.twitterUrl,
// 	//     youtubeUrl: data.youtubeUrl,
// 	//     updatedAt: new Date(),
// 	//   })
// 	//   .where(eq(siteSettings.id, 1))
// 	// revalidatePath("/") — footer pulls from siteConfig
// 	console.log("[saveCompanyInfo]", data.companyName);
// 	await new Promise((res) => setTimeout(res, 400));
// 	return { success: true, message: "Company information saved." };
// }

// export async function saveWebsiteDefaults(
// 	data: Record<string, string>,
// ): Promise<SettingsActionResult> {
// 	// TODO (integration stage): upsert into siteSettings
// 	console.log("[saveWebsiteDefaults]", data);
// 	return { success: true, message: "Website defaults saved." };
// }


// lib/actions/admin/settings.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { DEFAULT_SITE_SETTINGS } from "@/lib/db/queries/site-settings";
import type {
	CompanyInfoSettings,
	NotificationSettings,
	WebsiteDefaultsSettings,
} from "@/lib/types/admin/settings";

export interface SettingsActionResult {
	success: boolean;
	message: string;
}

function digitsOnly(value: string): string {
	return value.replace(/\D/g, "");
}

function deriveInstagramHandle(url: string): string {
	if (!url.trim()) return "";
	const last = url.replace(/\/+$/, "").split("/").pop() ?? "";
	return last ? `@${last}` : "";
}

async function getExistingRow() {
	return db.query.siteSettings.findFirst({ where: eq(siteSettings.id, 1) });
}

export async function saveCompanyInfo(
	data: CompanyInfoSettings,
): Promise<SettingsActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (!data.companyName.trim()) {
			return { success: false, message: "Company name is required." };
		}
		if (!data.companyEmail.trim()) {
			return { success: false, message: "Company email is required." };
		}

		const whatsappHref = data.whatsappNumber.trim()
			? `https://wa.me/${digitsOnly(data.whatsappNumber)}`
			: DEFAULT_SITE_SETTINGS.whatsappHref;

		const existing = await getExistingRow();

		const companyFields = {
			companyName: data.companyName.trim(),
			companyEmail: data.companyEmail.trim(),
			salesEmail: data.salesEmail.trim() || null,
			phone: data.phoneNumber.trim(),
			whatsappNumber: data.whatsappNumber.trim() || null,
			whatsappHref,
			address: data.officeAddress.trim(),
			instagramUrl: data.instagramUrl.trim() || null,
			instagramHandle: deriveInstagramHandle(data.instagramUrl) || null,
			linkedinUrl: data.linkedinUrl.trim() || null,
			twitterUrl: data.twitterUrl.trim() || null,
			youtubeUrl: data.youtubeUrl.trim() || null,
			updatedAt: new Date(),
		};

		if (existing) {
			await db.update(siteSettings).set(companyFields).where(eq(siteSettings.id, 1));
		} else {
			// First-ever save — fill every other NOT NULL column with a sane
			// default so this insert doesn't fail waiting on Website Defaults
			// to be saved first.
			await db.insert(siteSettings).values({
				id: 1,
				...companyFields,
				legalName: DEFAULT_SITE_SETTINGS.legalName,
				responseTimeNote: DEFAULT_SITE_SETTINGS.responseTimeNote,
				newLeadEmailEnabled: DEFAULT_SITE_SETTINGS.newLeadEmailEnabled,
				newLeadNotificationEmail: data.salesEmail.trim() || null,
			});
		}

		revalidatePath("/", "layout");
		revalidatePath("/admin/settings");
		return { success: true, message: "Company information saved." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveCompanyInfo]", message);
		return { success: false, message };
	}
}

export async function saveWebsiteDefaults(
	data: WebsiteDefaultsSettings,
): Promise<SettingsActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (!data.legalName.trim()) {
			return { success: false, message: "Legal name is required." };
		}
		if (!data.responseTimeNote.trim()) {
			return { success: false, message: "Response time note is required." };
		}

		const existing = await getExistingRow();

		const values = {
			legalName: data.legalName.trim(),
			responseTimeNote: data.responseTimeNote.trim(),
			updatedAt: new Date(),
		};

		if (existing) {
			await db.update(siteSettings).set(values).where(eq(siteSettings.id, 1));
		} else {
			await db.insert(siteSettings).values({
				id: 1,
				...values,
				companyName: DEFAULT_SITE_SETTINGS.companyName,
				companyEmail: DEFAULT_SITE_SETTINGS.companyEmail,
				phone: DEFAULT_SITE_SETTINGS.phone,
				whatsappHref: DEFAULT_SITE_SETTINGS.whatsappHref,
				address: DEFAULT_SITE_SETTINGS.address,
				newLeadEmailEnabled: DEFAULT_SITE_SETTINGS.newLeadEmailEnabled,
			});
		}

		revalidatePath("/", "layout");
		revalidatePath("/admin/settings");
		return { success: true, message: "Website defaults saved." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveWebsiteDefaults]", message);
		return { success: false, message };
	}
}

export async function saveNotificationSettings(
	data: NotificationSettings,
): Promise<SettingsActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		if (data.newLeadEmailEnabled && !data.newLeadNotificationEmail.trim()) {
			return {
				success: false,
				message: "Add a notification email address, or turn this notification off.",
			};
		}

		const existing = await getExistingRow();

		const values = {
			newLeadEmailEnabled: data.newLeadEmailEnabled,
			newLeadNotificationEmail: data.newLeadNotificationEmail.trim() || null,
			updatedAt: new Date(),
		};

		if (existing) {
			await db.update(siteSettings).set(values).where(eq(siteSettings.id, 1));
		} else {
			await db.insert(siteSettings).values({
				id: 1,
				...values,
				companyName: DEFAULT_SITE_SETTINGS.companyName,
				companyEmail: DEFAULT_SITE_SETTINGS.companyEmail,
				phone: DEFAULT_SITE_SETTINGS.phone,
				whatsappHref: DEFAULT_SITE_SETTINGS.whatsappHref,
				address: DEFAULT_SITE_SETTINGS.address,
				legalName: DEFAULT_SITE_SETTINGS.legalName,
				responseTimeNote: DEFAULT_SITE_SETTINGS.responseTimeNote,
			});
		}

		revalidatePath("/admin/settings");
		return { success: true, message: "Notification settings saved." };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveNotificationSettings]", message);
		return { success: false, message };
	}
}