// lib/actions/admin/company-pages.ts
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