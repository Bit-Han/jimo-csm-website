// components/admin/landing-pages/editor/ColorSchemePicker.tsx
"use client";

import { Check } from "lucide-react";
import { COLOR_SCHEMES } from "@/lib/types/landing-page";
import type { LandingColorScheme } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils/helpers";

export function ColorSchemePicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (scheme: LandingColorScheme) => void;
}) {
	return (
		<div>
			<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
				Color Scheme
			</label>
			<div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
				{COLOR_SCHEMES.map((scheme) => {
					const active = value === scheme.id;
					return (
						<button
							key={scheme.id}
							type="button"
							onClick={() => onChange(scheme.id)}
							title={scheme.label}
							className={cn(
								"relative aspect-square rounded-xl bg-gradient-to-br transition-transform hover:scale-105",
								scheme.gradientClassName,
								active
									? "ring-2 ring-red-600 ring-offset-2"
									: "ring-1 ring-stone-200",
							)}
						>
							{active ? (
								<span className="absolute inset-0 flex items-center justify-center">
									<Check className="h-4 w-4 text-white drop-shadow" />
								</span>
							) : null}
						</button>
					);
				})}
			</div>
			<p className="mt-1.5 text-xs text-stone-400">
				{COLOR_SCHEMES.find((s) => s.id === value)?.label ??
					"Choose a color scheme"}
			</p>
		</div>
	);
}
