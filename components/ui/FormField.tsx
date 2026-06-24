import type { ReactNode } from "react";

export interface FormFieldProps {
	label: string;
	error?: string;
	children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
	return (
		<div>
			<label className="text-sm font-medium text-ink-950">
				{label}
				<div className="mt-2">{children}</div>
			</label>
			{error ? (
				<p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
			) : null}
		</div>
	);
}

export const formControlClassName =
	"w-full rounded-xl border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";
