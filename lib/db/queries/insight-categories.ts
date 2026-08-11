//@/lib/db/queries/insight-categories
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { insightCategories } from "@/lib/db/schema";
import type { InsightCategoryOption } from "@/lib/types/insight";

// Only used if the table is somehow empty, so the editor never renders a
// dead-end category-less dropdown.
const FALLBACK_CATEGORIES: InsightCategoryOption[] = [
	{ value: "location-analysis", label: "Location Analysis" },
	{ value: "investment-education", label: "Investment Education" },
	{ value: "project-update", label: "Project Update" },
];

export async function getInsightCategories(): Promise<InsightCategoryOption[]> {
	console.info("[admin:getInsightCategories] Loading insight categories");
	try {
		const rows = await db.query.insightCategories.findMany({
			orderBy: [asc(insightCategories.position), asc(insightCategories.label)],
		});
		console.info(`[admin:getInsightCategories] Loaded ${rows.length} insight categories`);
		if (rows.length === 0) return FALLBACK_CATEGORIES;
		return rows.map((r) => ({ value: r.value, label: r.label }));
	} catch {
		return FALLBACK_CATEGORIES;
	}
}
