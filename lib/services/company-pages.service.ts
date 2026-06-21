// lib/services/company-pages.service.ts
import { db } from "@/lib/db";
import { companyPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { CompanyPage, CompanyPageSection } from "@/lib/types";

export async function getCompanyPages(): Promise<CompanyPage[]> {
	return db.select().from(companyPages).orderBy(companyPages.type);
}

export async function getCompanyPageById(
	id: string,
): Promise<CompanyPage | null> {
	const [page] = await db
		.select()
		.from(companyPages)
		.where(eq(companyPages.id, id))
		.limit(1);
	return page ?? null;
}

export async function getCompanyPageByType(
	type: CompanyPage["type"],
): Promise<CompanyPage | null> {
	const [page] = await db
		.select()
		.from(companyPages)
		.where(eq(companyPages.type, type))
		.limit(1);
	return page ?? null;
}

export async function updateCompanyPage(
	id: string,
	input: {
		sections?: CompanyPageSection[];
		status?: CompanyPage["status"];
		metaTitle?: string;
		metaDescription?: string;
		focusKeyword?: string;
	},
	editedBy: string,
): Promise<CompanyPage | null> {
	const [updated] = await db
		.update(companyPages)
		.set({ ...input, lastEditedBy: editedBy, updatedAt: new Date() })
		.where(eq(companyPages.id, id))
		.returning();
	return updated ?? null;
}

/** Seed default company pages — run once during initial setup */
export async function seedCompanyPages(): Promise<void> {
	const defaults: Array<{
		title: string;
		slug: string;
		type: CompanyPage["type"];
	}> = [
		{ title: "Home Page", slug: "home", type: "home" },
		{ title: "About Us", slug: "about-us", type: "about" },
		{ title: "Services", slug: "services", type: "services" },
		{
			title: "Corporate Statement",
			slug: "corporate-statement",
			type: "corporate_statement",
		},
		{ title: "Contact", slug: "contact", type: "contact" },
	];

	for (const page of defaults) {
		const existing = await getCompanyPageByType(page.type);
		if (!existing) {
			await db
				.insert(companyPages)
				.values({ ...page, status: "draft", sections: [] });
		}
	}
}
