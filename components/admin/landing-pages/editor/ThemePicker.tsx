// // components/admin/landing-pages/editor/ThemePicker.tsx
// "use client";

// import { Check } from "lucide-react";
// import { LANDING_HERO_THEMES } from "@/lib/types/landing-page";
// import type { LandingHeroTheme } from "@/lib/types/landing-page";
// import { cn } from "@/lib/utils/helpers";

// export function ThemePicker({
// 	value,
// 	onChange,
// }: {
// 	value: LandingHeroTheme;
// 	onChange: (theme: LandingHeroTheme) => void;
// }) {
// 	return (
// 		<div>
// 			<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
// 				Hero Theme
// 			</label>
// 			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
// 				{LANDING_HERO_THEMES.map((theme) => {
// 					const active = value === theme.id;
// 					return (
// 						<button
// 							key={theme.id}
// 							type="button"
// 							onClick={() => onChange(theme.id)}
// 							className={cn(
// 								"relative overflow-hidden rounded-xl border-2 p-3 text-left transition-colors",
// 								active ? "border-red-600" : "border-stone-200 hover:border-stone-300",
// 							)}
// 						>
// 							<div className={cn("h-16 w-full rounded-lg", theme.previewClassName)} />
// 							<p className="mt-2 text-xs font-semibold text-ink-950">{theme.label}</p>
// 							<p className="mt-0.5 text-[11px] text-stone-500">{theme.description}</p>
// 							{active ? (
// 								<span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
// 									<Check className="h-3 w-3" />
// 								</span>
// 							) : null}
// 						</button>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// }

// components/admin/landing-pages/editor/ThemePicker.tsx
"use client";

import { Check } from "lucide-react";
import { LANDING_HERO_THEMES } from "@/lib/types/landing-page";
import type { LandingHeroTheme } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils/helpers";

export function ThemePicker({
	value,
	onChange,
}: {
	value: LandingHeroTheme;
	onChange: (theme: LandingHeroTheme) => void;
}) {
	return (
		<div>
			<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
				Hero Theme
			</label>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{LANDING_HERO_THEMES.map((theme) => {
					const active = value === theme.id;
					return (
						<button
							key={theme.id}
							type="button"
							onClick={() => onChange(theme.id)}
							className={cn(
								"relative overflow-hidden rounded-xl border-2 p-3 text-left transition-colors",
								active ? "border-red-600" : "border-stone-200 hover:border-stone-300",
							)}
						>
							<div className={cn("h-20 w-full rounded-lg", theme.previewClassName)} />
							<p className="mt-2 text-xs font-semibold text-ink-950">{theme.label}</p>
							<p className="mt-0.5 text-[11px] text-stone-500">{theme.description}</p>
							{active ? (
								<span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
									<Check className="h-3 w-3" />
								</span>
							) : null}
						</button>
					);
				})}
			</div>
		</div>
	);
}