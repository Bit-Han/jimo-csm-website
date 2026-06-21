// lib/utils/company-page-content.ts
import type { CompanyPage } from "@/lib/types";

/** Pulls a typed section's content out of a CompanyPage by section type. */
export function getSectionContent<T>(
	page: CompanyPage | null,
	sectionType: string,
): T | null {
	const section = page?.sections.find(
		(s) => s.type === sectionType && s.status === "published",
	);
	return (section?.content as T) ?? null;
}
