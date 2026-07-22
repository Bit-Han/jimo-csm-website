import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export interface ProjectFieldSuggestions {
	locations: string[];
	developerLabels: string[];
	typeLabels: string[];
	categoryLabels: string[];
}

function distinctInOrder(values: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const v of values) {
		const trimmed = v.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		out.push(trimmed);
	}
	return out;
}

/**
 * Distinct, previously-used values for fields admins retype on every new
 * project. Ordered by recency (most recently updated project's value
 * comes first), so the freshest naming convention wins if the same field
 * has drifted over time (e.g. "Yaba" vs "Yaba, Lagos").
 */
export async function getProjectFieldSuggestions(): Promise<ProjectFieldSuggestions> {
	const rows = await db
		.select({
			location: projects.location,
			developerLabel: projects.developerLabel,
			typeLabel: projects.typeLabel,
			categoryLabel: projects.categoryLabel,
		})
		.from(projects)
		.orderBy(projects.updatedAt);

	return {
		locations: distinctInOrder(rows.map((r) => r.location)).reverse(),
		developerLabels: distinctInOrder(
			rows.map((r) => r.developerLabel),
		).reverse(),
		typeLabels: distinctInOrder(rows.map((r) => r.typeLabel)).reverse(),
		categoryLabels: distinctInOrder(rows.map((r) => r.categoryLabel)).reverse(),
	};
}
