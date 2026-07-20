// //lib/db/queries/content.ts
// import { eq } from "drizzle-orm";
// import { db } from "@/lib/db";
// import { companyContent, homeContent, siteSettings } from "@/lib/db/schema";
// import type { HomePageData } from "@/lib/types/home";
// import type {
// 	CompanyContentRow,
// 	CompanyPromiseData,
// 	CompanyServiceData,
// 	CompanyWhoWeAreData,
// 	CoreValueData,
// 	PropertyTypeCategoryData,
// 	TeamMemberData,
// } from "@/lib/db/schema/content";
// import type { SiteSettingsRow } from "@/lib/db/schema/settings";
// import { homePageData as fallbackHomeData } from "@/lib/data/home";

// // ─── Home content ─────────────────────────────────────────────────────────

// export async function getHomePageContent(): Promise<HomePageData> {
// 	try {
// 		const row = await db.query.homeContent.findFirst({
// 			where: eq(homeContent.id, 1),
// 		});
// 		return (row?.data as HomePageData) ?? fallbackHomeData;
// 	} catch {
// 		return fallbackHomeData;
// 	}
// }

// export async function saveHomePageContent(data: HomePageData): Promise<void> {
// 	await db
// 		.insert(homeContent)
// 		.values({ id: 1, data, updatedAt: new Date() })
// 		.onConflictDoUpdate({
// 			target: homeContent.id,
// 			set: { data, updatedAt: new Date() },
// 		});
// }

// // ─── Company content ──────────────────────────────────────────────────────

// export async function getCompanyContent(): Promise<CompanyContentRow | null> {
// 	try {
// 		return (
// 			(await db.query.companyContent.findFirst({
// 				where: eq(companyContent.id, 1),
// 			})) ?? null
// 		);
// 	} catch {
// 		return null;
// 	}
// }

// export async function updateCompanySection(
// 	section: "whoWeAre",
// 	data: CompanyWhoWeAreData,
// ): Promise<void>;
// export async function updateCompanySection(
// 	section: "coreValues",
// 	data: CoreValueData[],
// ): Promise<void>;
// export async function updateCompanySection(
// 	section: "services",
// 	data: CompanyServiceData[],
// ): Promise<void>;
// export async function updateCompanySection(
// 	section: "propertyTypes",
// 	data: PropertyTypeCategoryData[],
// ): Promise<void>;
// export async function updateCompanySection(
// 	section: "companyPromise",
// 	data: CompanyPromiseData,
// ): Promise<void>;
// export async function updateCompanySection(
// 	section: "teamMembers",
// 	data: TeamMemberData[],
// ): Promise<void>;
// // Implementation
// export async function updateCompanySection(
// 	section: keyof Omit<CompanyContentRow, "id" | "updatedAt">,
// 	data: unknown,
// ): Promise<void> {
// 	await db
// 		.update(companyContent)
// 		.set({ [section]: data, updatedAt: new Date() })
// 		.where(eq(companyContent.id, 1));
// }

// // ─── Site settings ────────────────────────────────────────────────────────

// export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
// 	try {
// 		return (
// 			(await db.query.siteSettings.findFirst({
// 				where: eq(siteSettings.id, 1),
// 			})) ?? null
// 		);
// 	} catch {
// 		return null;
// 	}
// }

// export async function saveSiteSettings(
// 	data: Partial<Omit<SiteSettingsRow, "id" | "updatedAt">>,
// ): Promise<void> {
// 	await db
// 		.update(siteSettings)
// 		.set({ ...data, updatedAt: new Date() })
// 		.where(eq(siteSettings.id, 1));
// }

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { companyContent, homeContent, siteSettings } from "@/lib/db/schema";
import type { HomePageData } from "@/lib/types/home";
import type {
	CompanyContentRow,
	CompanyPromiseData,
	CompanyServiceData,
	CompanyWhoWeAreData,
	CoreValueData,
	PropertyTypeCategoryData,
	TeamMemberData,
} from "@/lib/db/schema/content";
import type { SiteSettingsRow } from "@/lib/db/schema/settings";
import { homePageData as fallbackHomeData } from "@/lib/data/home";

// ─── Home content ─────────────────────────────────────────────────────────

/**
 * Merges a saved section against its fallback so a field added to the type
 * after a row was already saved (schema drift in JSONB, which Postgres does
 * not enforce) never surfaces as a missing key at render time. One level
 * deep is correct here — every field on these section types is a direct
 * property (including `image`), so a shallow merge fills gaps without
 * needing to guess how to merge nested arrays like `stats` or `features`.
 */
function mergeSection<T extends object>(
	fallback: T,
	saved: Partial<T> | undefined | null,
): T {
	if (!saved) return fallback;
	return { ...fallback, ...saved };
}

export async function getHomePageContent(): Promise<HomePageData> {
	try {
		const row = await db.query.homeContent.findFirst({
			where: eq(homeContent.id, 1),
		});
		const saved = row?.data as Partial<HomePageData> | undefined;
		if (!saved) return fallbackHomeData;

		return {
			hero: mergeSection(fallbackHomeData.hero, saved.hero),
			about: mergeSection(fallbackHomeData.about, saved.about),
			featured: mergeSection(fallbackHomeData.featured, saved.featured),
			whyChoose: mergeSection(fallbackHomeData.whyChoose, saved.whyChoose),
			howWeWork: mergeSection(fallbackHomeData.howWeWork, saved.howWeWork),
			cta: mergeSection(fallbackHomeData.cta, saved.cta),
		};
	} catch {
		return fallbackHomeData;
	}
}

export async function saveHomePageContent(data: HomePageData): Promise<void> {
	await db
		.insert(homeContent)
		.values({ id: 1, data, updatedAt: new Date() })
		.onConflictDoUpdate({
			target: homeContent.id,
			set: { data, updatedAt: new Date() },
		});
}

// ─── Company content ──────────────────────────────────────────────────────

export async function getCompanyContent(): Promise<CompanyContentRow | null> {
	try {
		return (
			(await db.query.companyContent.findFirst({
				where: eq(companyContent.id, 1),
			})) ?? null
		);
	} catch {
		return null;
	}
}

export async function updateCompanySection(
	section: "whoWeAre",
	data: CompanyWhoWeAreData,
): Promise<void>;
export async function updateCompanySection(
	section: "coreValues",
	data: CoreValueData[],
): Promise<void>;
export async function updateCompanySection(
	section: "services",
	data: CompanyServiceData[],
): Promise<void>;
export async function updateCompanySection(
	section: "propertyTypes",
	data: PropertyTypeCategoryData[],
): Promise<void>;
export async function updateCompanySection(
	section: "companyPromise",
	data: CompanyPromiseData,
): Promise<void>;
export async function updateCompanySection(
	section: "teamMembers",
	data: TeamMemberData[],
): Promise<void>;
// Implementation
export async function updateCompanySection(
	section: keyof Omit<CompanyContentRow, "id" | "updatedAt">,
	data: unknown,
): Promise<void> {
	await db
		.update(companyContent)
		.set({ [section]: data, updatedAt: new Date() })
		.where(eq(companyContent.id, 1));
}

// ─── Site settings ────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
	try {
		return (
			(await db.query.siteSettings.findFirst({
				where: eq(siteSettings.id, 1),
			})) ?? null
		);
	} catch {
		return null;
	}
}

export async function saveSiteSettings(
	data: Partial<Omit<SiteSettingsRow, "id" | "updatedAt">>,
): Promise<void> {
	await db
		.update(siteSettings)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(siteSettings.id, 1));
}