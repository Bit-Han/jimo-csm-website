// // lib/utils/form-field-mapping.ts
// // Converts dynamic Form Builder field values (collected from the public site)
// // into a payload matching submitLeadSchema, using each field's crmMapping.
// import type { FormField } from "@/lib/types";

// function parseNairaShorthandToKobo(value: string): number | null {
// 	const match = value.replace(/[₦,\s]/g, "").match(/^([\d.]+)([MBK]?)$/i);
// 	if (!match) return null;
// 	const [, numStr, suffix] = match;
// 	const num = parseFloat(numStr);
// 	const multiplier =
// 		suffix.toUpperCase() === "B"
// 			? 1_000_000_000
// 			: suffix.toUpperCase() === "M"
// 				? 1_000_000
// 				: suffix.toUpperCase() === "K"
// 					? 1_000
// 					: 1;
// 	return Math.round(num * multiplier * 100); // → kobo
// }

// function parseBudgetRangeLabel(label: string): { min?: number; max?: number } {
// 	const parts = label.split(/[–-]/).map((p) => p.trim());
// 	if (parts.length === 2) {
// 		return {
// 			min: parseNairaShorthandToKobo(parts[0]) ?? undefined,
// 			max: parseNairaShorthandToKobo(parts[1]) ?? undefined,
// 		};
// 	}
// 	if (label.includes("+")) {
// 		return {
// 			min: parseNairaShorthandToKobo(label.replace("+", "")) ?? undefined,
// 		};
// 	}
// 	return {};
// }

// export function buildLeadPayloadFromFields(
// 	fields: FormField[],
// 	values: Record<string, string>,
// ): Record<string, unknown> {
// 	const payload: Record<string, unknown> = {};
// 	const extraData: Record<string, string> = {};

// 	for (const field of fields) {
// 		const raw =
// 			field.type === "hidden"
// 				? (field.hiddenValue ?? "")
// 				: (values[field.id] ?? "");
// 		if (!raw) continue;

// 		switch (field.crmMapping) {
// 			case "lead.full_name":
// 				payload.name = raw;
// 				break;
// 			case "lead.email":
// 				payload.email = raw;
// 				break;
// 			case "lead.phone":
// 				payload.phone = raw;
// 				break;
// 			case "lead.interested_unit":
// 				payload.unitInterest = raw;
// 				break;
// 			case "lead.buying_purpose":
// 				payload.buyingPurpose = raw;
// 				break;
// 			case "lead.preferred_plan":
// 				payload.preferredPlan = raw;
// 				break;
// 			case "lead.message":
// 				payload.message = raw;
// 				break;
// 			case "lead.country":
// 				payload.countryOfResidence = raw;
// 				break;
// 			case "lead.budget_range": {
// 				const { min, max } = parseBudgetRangeLabel(raw);
// 				if (min !== undefined) payload.budgetMinKobo = min;
// 				if (max !== undefined) payload.budgetMaxKobo = max;
// 				extraData.budget_range_label = raw;
// 				break;
// 			}
// 			default:
// 				extraData[field.crmMapping ?? field.id] = raw;
// 		}
// 	}

// 	if (Object.keys(extraData).length > 0) payload.extraData = extraData;
// 	return payload;
// }
