import type { ReactNode } from "react";

export interface EditorFieldProps {
	label: string;
	hint?: string;
	required?: boolean;
	children: ReactNode;
}

export const inputCls =
	"w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-60";

export const selectCls =
	"w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-950 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export function EditorField({
	label,
	hint,
	required,
	children,
}: EditorFieldProps) {
	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-ink-950">
				{label}
				{required ? <span className="ml-1 text-red-500">*</span> : null}
			</label>
			{children}
			{hint ? <p className="mt-1.5 text-xs text-stone-500">{hint}</p> : null}
		</div>
	);
}
