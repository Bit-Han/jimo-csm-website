"use server";

import { revalidatePath } from "next/cache";
import {
	getHomePageContent,
	saveHomePageContent,
} from "@/lib/db/queries/content";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type {
	HomeAboutSection,
	HomeCtaSection,
	HomeFeaturedSection,
	HomeHeroSection,
	HomeHowWeWorkSection,
	HomeWhyChooseSection,
} from "@/lib/types/home";

export interface HomeSectionActionResult {
	success: boolean;
	message: string;
}

async function mergeAndSave(
	section: string,
	data: unknown,
): Promise<HomeSectionActionResult> {
	const adminUser = await getAdminUser();
	if (!adminUser) return { success: false, message: "Not authenticated." };

	try {
		const current = await getHomePageContent();
		const updated = { ...current, [section]: data };
		await saveHomePageContent(updated);
		revalidatePath("/", "layout");
		return { success: true, message: "Section saved and live on the website." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error(`[saveHome${section}]`, message);
		return { success: false, message };
	}
}

export async function saveHomeHero(data: HomeHeroSection) {
	return mergeAndSave("hero", data);
}
export async function saveHomeAbout(data: HomeAboutSection) {
	return mergeAndSave("about", data);
}
export async function saveHomeFeatured(data: HomeFeaturedSection) {
	return mergeAndSave("featured", data);
}
export async function saveHomeWhyChoose(data: HomeWhyChooseSection) {
	return mergeAndSave("whyChoose", data);
}
export async function saveHomeHowWeWork(data: HomeHowWeWorkSection) {
	return mergeAndSave("howWeWork", data);
}
export async function saveHomeCta(data: HomeCtaSection) {
	return mergeAndSave("cta", data);
}
