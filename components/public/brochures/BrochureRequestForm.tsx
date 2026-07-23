//@components/public/brochure/BrochureRequestForm.tsx
"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { submitBrochureRequest } from "@/lib/actions/brochure";
import { Button } from "@/components/ui/Button";
import { FormField, formControlClassName } from "@/components/ui/FormField";
import { cn } from "@/lib/utils/helpers";
import type { BrochureLeadFormState } from "@/lib/types/brochure";

const initialState: BrochureLeadFormState = {
	status: "idle",
	message: "",
	fieldErrors: {},
};

export interface BrochureRequestFormProps {
	projectSlug: string;
	className?: string;
}

export function BrochureRequestForm({
	projectSlug,
	className,
}: BrochureRequestFormProps) {
	const [state, formAction, isPending] = useActionState(
		submitBrochureRequest,
		initialState,
	);

	return (
		<form
			action={formAction}
			className={cn(
				"space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8",
				className,
			)}
		>
			<input type="hidden" name="projectSlug" value={projectSlug} />

			<FormField label="Full Name" error={state.fieldErrors.fullName}>
				<input
					type="text"
					name="fullName"
					placeholder="Your full name"
					className={formControlClassName}
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

			<FormField label="Phone Number" error={state.fieldErrors.phoneNumber}>
				<input
					type="tel"
					name="phoneNumber"
					placeholder="Your phone number"
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
				Download Brochure
			</Button>
		</form>
	);
}
