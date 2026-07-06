"use server";

import type { CompanyInfoSettings } from "@/lib/types/admin/settings";

export interface SettingsActionResult {
	success: boolean;
	message: string;
}

export async function saveCompanyInfo(
	data: CompanyInfoSettings,
): Promise<SettingsActionResult> {
	// TODO (integration stage):
	// db.update(siteSettings)
	//   .set({
	//     companyName: data.companyName,
	//     companyEmail: data.companyEmail,
	//     salesEmail: data.salesEmail,
	//     phone: data.phoneNumber,
	//     whatsappHref: `https://wa.me/${data.whatsappNumber.replace(/\D/g, "")}`,
	//     address: data.officeAddress,
	//     instagramUrl: data.instagramUrl,
	//     linkedinUrl: data.linkedinUrl,
	//     twitterUrl: data.twitterUrl,
	//     youtubeUrl: data.youtubeUrl,
	//     updatedAt: new Date(),
	//   })
	//   .where(eq(siteSettings.id, 1))
	// revalidatePath("/") — footer pulls from siteConfig
	console.log("[saveCompanyInfo]", data.companyName);
	await new Promise((res) => setTimeout(res, 400));
	return { success: true, message: "Company information saved." };
}

export async function saveWebsiteDefaults(
	data: Record<string, string>,
): Promise<SettingsActionResult> {
	// TODO (integration stage): upsert into siteSettings
	console.log("[saveWebsiteDefaults]", data);
	return { success: true, message: "Website defaults saved." };
}
