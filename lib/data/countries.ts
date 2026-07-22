import {
	getCountries,
	getCountryCallingCode,
	type CountryCode,
} from "libphonenumber-js";

export interface CountryOption {
	code: CountryCode;
	name: string;
	dialCode: string;
	flag: string;
}

function flagFromCountryCode(code: string): string {
	return code
		.toUpperCase()
		.replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countryOptions: CountryOption[] = getCountries()
	.map((code) => ({
		code,
		name: regionNames.of(code) ?? code,
		dialCode: `+${getCountryCallingCode(code)}`,
		flag: flagFromCountryCode(code),
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

// Jimo is a Lagos-based developer — most enquiries will be Nigerian numbers.
export const DEFAULT_COUNTRY: CountryCode = "NG";
