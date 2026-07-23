
//@components/public/contact/ContactForm.tsx
"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { submitContactEnquiry } from "@/lib/actions/contact";
import {
	enquiryTypeOptions,
	projectOfInterestOptions,
} from "@/lib/data/contact";
import { Button } from "@/components/ui/Button";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import { FormField, formControlClassName } from "@/components/ui/FormField";
import type { ContactFormState } from "@/lib/types/contact";

const initialState: ContactFormState = {
	status: "idle",
	message: "",
	fieldErrors: {},
};

export interface ContactFormProps {
	defaultProjectSlug: string;
}

export function ContactForm({ defaultProjectSlug }: ContactFormProps) {
	const [state, formAction, isPending] = useActionState(
		submitContactEnquiry,
		initialState,
	);

	return (
		<form
			action={formAction}
			className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
		>
			<FormField label="Full Name" error={state.fieldErrors.fullName}>
				<input
					type="text"
					name="fullName"
					placeholder="Your full name"
					className={formControlClassName}
				/>
			</FormField>

			<FormField label="Phone Number" error={state.fieldErrors.phoneNumber}>
				{/* <input
					type="tel"
					name="phoneNumber"
					placeholder="Your phone number"
					className={formControlClassName}
				/> */}
				<PhoneNumberField
					name="phoneNumber"
					error={state.fieldErrors.phoneNumber}
				/>
			</FormField>

			<FormField label="Email Address" error={state.fieldErrors.email}>
				<input
					type="email"
					name="email"
					placeholder="you@example.com"
					className={formControlClassName}
				/>
			</FormField>

			<FormField label="Enquiry Type" error={state.fieldErrors.enquiryType}>
				<select
					name="enquiryType"
					defaultValue="buyer"
					className={formControlClassName}
				>
					{enquiryTypeOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</FormField>

			<FormField
				label="Project of Interest"
				error={state.fieldErrors.projectOfInterest}
			>
				<select
					name="projectOfInterest"
					defaultValue={defaultProjectSlug}
					className={formControlClassName}
				>
					{projectOfInterestOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</FormField>

			<FormField label="Message" error={state.fieldErrors.message}>
				<textarea
					name="message"
					rows={4}
					placeholder="Tell us what you would like to discuss"
					className={formControlClassName}
				/>
			</FormField>

			{state.status === "error" ? (
				<p role="alert" className="text-sm font-medium text-red-600">
					{state.message}
				</p>
			) : null}

			<Button
				type="submit"
				variant="accent"
				size="lg"
				className="w-full"
				disabled={isPending}
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Submit Enquiry
			</Button>
		</form>
	);
}
