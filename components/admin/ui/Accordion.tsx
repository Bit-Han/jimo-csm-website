"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function Accordion({
	title,
	description,
	defaultOpen = false,
	children,
}: {
	title: string;
	description?: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-stone-50"
			>
				<div>
					<p className="text-sm font-bold text-ink-950">{title}</p>
					{description ? (
						<p className="mt-0.5 text-xs text-stone-400">{description}</p>
					) : null}
				</div>
				{open ? (
					<ChevronDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform" />
				) : (
					<ChevronRight className="h-4 w-4 shrink-0 text-stone-400 transition-transform" />
				)}
			</button>
			{open ? (
				<div className="border-t border-stone-100 px-6 pb-6 pt-5">
					{children}
				</div>
			) : null}
		</div>
	);
}
