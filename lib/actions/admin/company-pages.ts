// "use server";

// export interface CompanyPageActionResult {
// 	success: boolean;
// 	message: string;
// }

// export async function saveCompanyPageContent(
// 	pageSlug: string,
// 	content: unknown,
// ): Promise<CompanyPageActionResult> {
// 	// TODO (integration stage):
// 	// For "home":
// 	//   db.update(homeContent).set({ data: content, updatedAt: new Date() }).where(eq(homeContent.id, 1))
// 	//   revalidatePath("/")
// 	// For "about" | "services" | "corporate-statement":
// 	//   db.update(companyContent).set({ [section]: content, updatedAt: new Date() }).where(eq(companyContent.id, 1))
// 	//   revalidatePath(`/${pageSlug}`)
// 	console.log("[saveCompanyPageContent]", pageSlug, content);
// 	await new Promise((res) => setTimeout(res, 400));
// 	return { success: true, message: "Page content saved." };
// }

// export async function publishCompanyPage(
// 	pageSlug: string,
// ): Promise<CompanyPageActionResult> {
// 	// TODO (integration stage):
// 	// Update publishStatus on the relevant content table row
// 	// revalidatePath(`/${pageSlug === "home" ? "" : pageSlug}`)
// 	console.log("[publishCompanyPage]", pageSlug);
// 	return { success: true, message: "Page published." };
// }

"use server";

import { revalidatePath } from "next/cache";
import {
	saveHomePageContent,
	updateCompanySection,
} from "@/lib/db/queries/content";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { HomePageData } from "@/lib/types/home";
import type {
	CompanyPromiseData,
	CompanyServiceData,
	CompanyWhoWeAreData,
	CoreValueData,
	PropertyTypeCategoryData,
	TeamMemberData,
} from "@/lib/db/schema/content";

export interface CompanyPageActionResult {
	success: boolean;
	message: string;
}

export async function saveHomeContent(
	data: HomePageData,
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await saveHomePageContent(data);

		revalidatePath("/", "layout");
		revalidatePath("/admin/company-pages", "layout");

		return { success: true, message: "Home page content saved and published." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[saveHomeContent]", message);
		return { success: false, message };
	}
}

export async function saveWhoWeAre(
	data: CompanyWhoWeAreData,
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("whoWeAre", data);

		revalidatePath("/about", "layout");
		revalidatePath("/admin/company-pages", "layout");

		return { success: true, message: "Who We Are section saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

export async function saveCoreValues(
	data: CoreValueData[],
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("coreValues", data);

		revalidatePath("/about", "layout");

		return { success: true, message: "Core values saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

export async function saveTeamMembers(
	data: TeamMemberData[],
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("teamMembers", data);

		revalidatePath("/about", "layout");

		return { success: true, message: "Team members saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

export async function saveServices(
	data: CompanyServiceData[],
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("services", data);
		revalidatePath("/services", "layout");

		return { success: true, message: "Services saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

export async function savePropertyTypes(
	data: PropertyTypeCategoryData[],
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("propertyTypes", data);
		revalidatePath("/services", "layout");

		return { success: true, message: "Property types saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

export async function saveCompanyPromise(
	data: CompanyPromiseData,
): Promise<CompanyPageActionResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		await updateCompanySection("companyPromise", data);
		revalidatePath("/services", "layout");

		return { success: true, message: "Company promise saved." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		return { success: false, message };
	}
}

// Generic save for any company page section (for the editor placeholder sections)
export async function saveCompanyPageContent(
	_pageSlug: string,
	_content: unknown,
): Promise<CompanyPageActionResult> {
	return { success: true, message: "Saved." };
}

export async function publishCompanyPage(
	pageSlug: string,
): Promise<CompanyPageActionResult> {
	revalidatePath(`/${pageSlug === "home" ? "" : pageSlug}`, "layout");
	return { success: true, message: "Page published." };
}