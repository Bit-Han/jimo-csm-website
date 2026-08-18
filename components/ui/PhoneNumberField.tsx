// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
// 	parsePhoneNumberFromString,
// 	type CountryCode,
// } from "libphonenumber-js";
// import { countryOptions, DEFAULT_COUNTRY } from "@/lib/data/countries";
// import { cn } from "@/lib/utils/helpers";

// export interface PhoneNumberFieldProps {
// 	/** Form field name the normalized E.164 value is submitted under. */
// 	name: string;
// 	defaultCountry?: CountryCode;
// 	defaultValue?: string;
// 	error?: string;
// 	required?: boolean;
// 	// NEW — optional, only used by controlled-state forms like
// 	// DynamicFormRenderer. Your BrochureRequestForm ignores this entirely
// 	// and keeps working exactly as-is off the hidden input.
// 	onValueChange?: (e164Value: string, isValid: boolean) => void;
// }

// export function PhoneNumberField({
// 	name,
// 	defaultCountry = DEFAULT_COUNTRY,
// 	defaultValue = "",
// 	error,
// 	required = true,
// 	onValueChange,
// }: PhoneNumberFieldProps) {
// 	const [country, setCountry] = useState<CountryCode>(defaultCountry);
// 	const [rawNumber, setRawNumber] = useState(defaultValue);
// 	const [touched, setTouched] = useState(false);

// 	// Deliberately not live-reformatting the input as the person types
// 	// (e.g. via AsYouType) — that approach is well known to fight cursor
// 	// position and produce jarring UX. Instead: free-typed input, validated
// 	// and normalized on blur/submit, only ever submitted in one canonical
// 	// format (E.164) so the server never has to guess what shape it's in.
// 	const parsed = useMemo(
// 		() =>
// 			rawNumber.trim()
// 				? parsePhoneNumberFromString(rawNumber, country)
// 				: undefined,
// 		[rawNumber, country],
// 	);

// 	const isEmpty = rawNumber.trim() === "";
// 	const isValid = isEmpty ? !required : Boolean(parsed?.isValid());
// 	const showLocalError = touched && !isValid;
// 	const e164Value = parsed?.isValid() ? parsed.number : "";

// 	useEffect(() => {
// 		if (onValueChange) {
// 			onValueChange(e164Value, isValid);
// 		}
// 	}, [e164Value, isValid, onValueChange]);

// 	return (
// 		<div>
// 			<div
// 				className={cn(
// 					"flex overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-red-600/20",
// 					showLocalError || error
// 						? "border-red-400"
// 						: "border-stone-200 focus-within:border-red-600",
// 				)}
// 			>
// 				<select
// 					value={country}
// 					onChange={(e) => setCountry(e.target.value as CountryCode)}
// 					aria-label="Country code"
// 					className="shrink-0 border-r border-stone-200 bg-stone-50 pl-2 pr-1 text-sm text-stone-700 focus:outline-none"
// 				>
// 					{countryOptions.map((c) => (
// 						<option key={c.code} value={c.code}>
// 							{c.flag} {c.dialCode}
// 						</option>
// 					))}
// 				</select>
// 				<input
// 					type="tel"
// 					inputMode="tel"
// 					autoComplete="tel-national"
// 					value={rawNumber}
// 					onChange={(e) => setRawNumber(e.target.value)}
// 					onBlur={() => setTouched(true)}
// 					placeholder="Phone number"
// 					className="flex-1 border-0 px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:outline-none focus:ring-0"
// 				/>
// 			</div>

// 			{/* The only value the server ever sees — always normalized E.164
//           (e.g. +2348012345678) or empty. If parsing fails this submits
//           empty, which the server-side schema then correctly rejects as
//           missing/invalid rather than silently accepting malformed input. */}
// 			<input type="hidden" name={name} value={e164Value} />

// 			{showLocalError ? (
// 				<p className="mt-1 text-xs font-medium text-red-500">
// 					Enter a valid phone number for{" "}
// 					{countryOptions.find((c) => c.code === country)?.name ?? country}.
// 				</p>
// 			) : null}
// 			{error ? (
// 				<p className="mt-1 text-xs font-medium text-red-500">{error}</p>
// 			) : null}
// 		</div>
// 	);
// }


// components/ui/PhoneNumberField.tsx
"use client";

import { useMemo, useState } from "react";
import {
	parsePhoneNumberFromString,
	type CountryCode,
} from "libphonenumber-js/min"; // /min — smaller client bundle; server keeps the full import
import { countryOptions, DEFAULT_COUNTRY } from "@/lib/data/countries";
import { cn } from "@/lib/utils/helpers";

export interface PhoneNumberFieldProps {
	/** Form field name the normalized E.164 value is submitted under. */
	name: string;
	defaultCountry?: CountryCode;
	defaultValue?: string;
	error?: string;
	required?: boolean;
	// Optional — only DynamicFormRenderer (controlled-state forms) uses
	// this. BrochureRequestForm reads the hidden input via FormData and
	// ignores this prop entirely, so nothing changes for it.
	onValueChange?: (e164Value: string, isValid: boolean) => void;
}

// Pure helper, not a hook — used both for the value shown on screen and
// inside the handlers below, so there's exactly one place that decides
// what counts as valid. Kept outside the component so it isn't recreated
// every render.
function deriveState(raw: string, country: CountryCode, required: boolean) {
	const trimmed = raw.trim();
	if (!trimmed) return { isValid: !required, e164Value: "" };
	const parsed = parsePhoneNumberFromString(raw, country);
	return {
		isValid: Boolean(parsed?.isValid()),
		e164Value: parsed?.isValid() ? parsed.number : "",
	};
}

export function PhoneNumberField({
	name,
	defaultCountry = DEFAULT_COUNTRY,
	defaultValue = "",
	error,
	required = true,
	onValueChange,
}: PhoneNumberFieldProps) {
	const [country, setCountry] = useState<CountryCode>(defaultCountry);
	const [rawNumber, setRawNumber] = useState(defaultValue);
	const [touched, setTouched] = useState(false);

	// Deliberately not live-reformatting the input as the person types
	// (e.g. via AsYouType) — validated and normalized on change/blur,
	// submitted in one canonical format (E.164) so the server never has
	// to guess what shape it's in.
	const { isValid, e164Value } = useMemo(
		() => deriveState(rawNumber, country, required),
		[rawNumber, country, required],
	);

	const showLocalError = touched && !isValid;

	// Notified directly from the two handlers that can change the value —
	// NOT from a useEffect. An Effect syncing to a parent on every derived
	// value change re-fires whenever the parent re-renders and hands back
	// a new inline callback (as DynamicFormRenderer does) — parent
	// setState → re-render → new callback → effect fires → setState →
	// loop, which is the "Maximum update depth exceeded" you hit. Calling
	// onValueChange straight from the handler means it only ever runs
	// once per real keystroke/selection — never as a side effect of a
	// render that already happened.
	function handleNumberChange(next: string) {
		setRawNumber(next);
		const nextState = deriveState(next, country, required);
		onValueChange?.(nextState.e164Value, nextState.isValid);
	}

	function handleCountryChange(next: CountryCode) {
		setCountry(next);
		const nextState = deriveState(rawNumber, next, required);
		onValueChange?.(nextState.e164Value, nextState.isValid);
	}

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
					onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
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
					onChange={(e) => handleNumberChange(e.target.value)}
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