"use client";

import { useMemo, useState } from "react";
import {
	parsePhoneNumberFromString,
	type CountryCode,
} from "libphonenumber-js";
import { countryOptions, DEFAULT_COUNTRY } from "@/lib/data/countries";
import { cn } from "@/lib/utils/helpers";

export interface PhoneNumberFieldProps {
	/** Form field name the normalized E.164 value is submitted under. */
	name: string;
	defaultCountry?: CountryCode;
	defaultValue?: string;
	error?: string;
	required?: boolean;
}

export function PhoneNumberField({
	name,
	defaultCountry = DEFAULT_COUNTRY,
	defaultValue = "",
	error,
	required = true,
}: PhoneNumberFieldProps) {
	const [country, setCountry] = useState<CountryCode>(defaultCountry);
	const [rawNumber, setRawNumber] = useState(defaultValue);
	const [touched, setTouched] = useState(false);

	// Deliberately not live-reformatting the input as the person types
	// (e.g. via AsYouType) — that approach is well known to fight cursor
	// position and produce jarring UX. Instead: free-typed input, validated
	// and normalized on blur/submit, only ever submitted in one canonical
	// format (E.164) so the server never has to guess what shape it's in.
	const parsed = useMemo(
		() =>
			rawNumber.trim()
				? parsePhoneNumberFromString(rawNumber, country)
				: undefined,
		[rawNumber, country],
	);

	const isEmpty = rawNumber.trim() === "";
	const isValid = isEmpty ? !required : Boolean(parsed?.isValid());
	const showLocalError = touched && !isValid;
	const e164Value = parsed?.isValid() ? parsed.number : "";

	return (
		<div>
			<div
				className={cn(
					"flex overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-red-600/20",
					showLocalError || error
						? "border-red-400"
						: "border-stone-200 focus-within:border-red-600",
				)}
			>
				<select
					value={country}
					onChange={(e) => setCountry(e.target.value as CountryCode)}
					aria-label="Country code"
					className="shrink-0 border-r border-stone-200 bg-stone-50 pl-2 pr-1 text-sm text-stone-700 focus:outline-none"
				>
					{countryOptions.map((c) => (
						<option key={c.code} value={c.code}>
							{c.flag} {c.dialCode}
						</option>
					))}
				</select>
				<input
					type="tel"
					inputMode="tel"
					autoComplete="tel-national"
					value={rawNumber}
					onChange={(e) => setRawNumber(e.target.value)}
					onBlur={() => setTouched(true)}
					placeholder="Phone number"
					className="flex-1 border-0 px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:outline-none focus:ring-0"
				/>
			</div>

			{/* The only value the server ever sees — always normalized E.164
          (e.g. +2348012345678) or empty. If parsing fails this submits
          empty, which the server-side schema then correctly rejects as
          missing/invalid rather than silently accepting malformed input. */}
			<input type="hidden" name={name} value={e164Value} />

			{showLocalError ? (
				<p className="mt-1 text-xs font-medium text-red-500">
					Enter a valid phone number for{" "}
					{countryOptions.find((c) => c.code === country)?.name ?? country}.
				</p>
			) : null}
			{error ? (
				<p className="mt-1 text-xs font-medium text-red-500">{error}</p>
			) : null}
		</div>
	);
}
