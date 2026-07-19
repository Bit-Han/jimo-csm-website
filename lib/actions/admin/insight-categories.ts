"use server";

import { db } from "@/lib/db";
import { insightCategories } from "@/lib/db/schema";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import type { InsightCategoryOption } from "@/lib/types/insight";

function slugify(label: string): string {
	return label
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export interface AddInsightCategoryResult {
	success: boolean;
	message: string;
	category?: InsightCategoryOption;
}

export async function addInsightCategory(
	label: string,
): Promise<AddInsightCategoryResult> {
	try {
		const adminUser = await getAdminUser();
		if (!adminUser) return { success: false, message: "Not authenticated." };

		const trimmed = label.trim();
		if (!trimmed)
			return { success: false, message: "Category name is required." };
		if (trimmed.length > 60)
			return { success: false, message: "Category name is too long." };

		const value = slugify(trimmed);
		if (!value)
			return {
				success: false,
				message: "Please use letters or numbers in the category name.",
			};

		const existing = await db.query.insightCategories.findFirst({
			where: (c, { eq }) => eq(c.value, value),
		});
		if (existing) {
			return {
				success: true,
				message: "Category already exists.",
				category: { value: existing.value, label: existing.label },
			};
		}

		const [row] = await db
			.insert(insightCategories)
			.values({ value, label: trimmed })
			.returning();
		if (!row) return { success: false, message: "Failed to create category." };

		return {
			success: true,
			message: "Category added.",
			category: { value: row.value, label: row.label },
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unexpected error.";
		console.error("[addInsightCategory]", message);
		return { success: false, message };
	}
}
