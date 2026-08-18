import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Validates a phone number against international standard formats (E.164).
 * Expects the user to supply a country code prefix (e.g., +1, +234, etc.).
 */
export function validateAndFormatPhone(phoneNumber: string): {
	isValid: boolean;
	formatted?: string;
} {
	const trimmed = phoneNumber.trim();
	if (!trimmed) {
		return { isValid: false };
	}

	// parsePhoneNumberFromString requires an international prefix code "+" to evaluate accurately
	// without an explicit default fallback country code argument.
	const phoneNumberObj = parsePhoneNumberFromString(
		trimmed.startsWith("+") ? trimmed : `+${trimmed}`,
	);

	if (!phoneNumberObj || !phoneNumberObj.isValid()) {
		return { isValid: false };
	}

	return {
		isValid: true,
		formatted: phoneNumberObj.format("E.164"), // Standard clean output layout: +12345678900
	};
}
