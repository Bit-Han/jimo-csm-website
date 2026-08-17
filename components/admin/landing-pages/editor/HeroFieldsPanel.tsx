// components/admin/landing-pages/editor/HeroFieldsPanel.tsx
"use client";

import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import { ThemePicker } from "./ThemePicker";
import { ColorSchemePicker } from "./ColorSchemePicker";
import { getThemeMeta } from "@/lib/types/landing-page";
import type {
	LandingColorScheme,
	LandingHeroContent,
	LandingHeroTheme,
} from "@/lib/types/landing-page";
import type { FormPickerOption } from "@/lib/types/admin/landing-page";

interface HeroFieldsPanelProps {
	hero: LandingHeroContent;
	onChange: (hero: LandingHeroContent) => void;
	forms: FormPickerOption[];
	onQueueImageDeletion: (url: string) => void;
}

const CTA_PRESENTATION_OPTIONS = [
	{ value: "modal-center", label: "Center Modal", hint: "Click a button, form pops up centered." },
	{ value: "modal-side", label: "Side Drawer", hint: "Click a button, form slides in from the right." },
	{ value: "inline-card", label: "Always Visible", hint: "Form is shown on the page immediately, no click needed." },
] as const;

export function HeroFieldsPanel({ hero, onChange, forms, onQueueImageDeletion }: HeroFieldsPanelProps) {
	const themeMeta = getThemeMeta(hero.theme);

	function set<K extends keyof LandingHeroContent>(key: K, value: LandingHeroContent[K]) {
		onChange({ ...hero, [key]: value });
	}

	function handleThemeChange(theme: LandingHeroTheme) {
		const meta = getThemeMeta(theme);
		if (!meta.requiresBackgroundImage && hero.backgroundImageUrl) {
			onQueueImageDeletion(hero.backgroundImageUrl);
			onChange({ ...hero, theme, backgroundImageUrl: null, backgroundImageAlt: "" });
			return;
		}
		set("theme", theme);
	}

	function handleImageChange(url: string, alt: string, previousUrl?: string) {
		if (previousUrl) onQueueImageDeletion(previousUrl);
		onChange({ ...hero, backgroundImageUrl: url, backgroundImageAlt: alt });
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-6">
			<ThemePicker value={hero.theme} onChange={handleThemeChange} />

			{themeMeta.requiresBackgroundImage ? (
				<ImageUploadField
					label="Background Image"
					value={hero.backgroundImageUrl ?? ""}
					altValue={hero.backgroundImageAlt}
					onChange={handleImageChange}
					folder="jimo-property/landing-pages"
					aspectClass="aspect-[4/5]"
					hint="Fills the image area of this layout. Recommended: tall orientation, 1000×1250px or similar."
				/>
			) : (
				<p className="rounded-lg border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-500">
					This theme doesn&apos;t use a photo — its look comes entirely from the
					color scheme below.
				</p>
			)}

			<ColorSchemePicker
				value={hero.accentColor}
				onChange={(scheme: LandingColorScheme) => set("accentColor", scheme)}
			/>

			<div>
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Text Color
				</label>
				<div className="flex gap-2">
					{(["light", "dark"] as const).map((c) => (
						<button
							key={c}
							type="button"
							onClick={() => set("textColor", c)}
							className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
								hero.textColor === c
									? "border-red-600 bg-red-600 text-white"
									: "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
							}`}
						>
							{c === "light" ? "Light text" : "Dark text"}
						</button>
					))}
				</div>
				<p className="mt-1 text-[11px] text-stone-400">
					Use dark text only if your image or gradient choice is light enough
					for it to stay readable.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						Eyebrow
					</label>
					<input
						type="text"
						value={hero.eyebrow}
						onChange={(e) => set("eyebrow", e.target.value)}
						placeholder="e.g. JIMO Residences"
						className={inputCls}
					/>
				</div>
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						Badge Text
					</label>
					<input
						type="text"
						value={hero.badgeText}
						onChange={(e) => set("badgeText", e.target.value)}
						placeholder="e.g. YABA, LAGOS"
						className={inputCls}
					/>
				</div>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Headline <span className="text-red-500">*</span>
				</label>
				<textarea
					value={hero.headline}
					onChange={(e) => set("headline", e.target.value)}
					rows={2}
					placeholder="Invest in a Premium Hospitality-Managed Shortlet Project in Yaba"
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Subheadline
				</label>
				<textarea
					value={hero.subheadline}
					onChange={(e) => set("subheadline", e.target.value)}
					rows={2}
					placeholder="Earn passive income from expertly managed shortlets in the heart of Lagos' vibrant commercial hub."
					className={inputCls}
				/>
			</div>

			<div className="border-t border-stone-100 pt-5">
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Form Presentation
				</label>
				<div className="grid gap-2 sm:grid-cols-3">
					{CTA_PRESENTATION_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => set("ctaPresentation", opt.value)}
							className={`rounded-lg border p-3 text-left transition-colors ${
								hero.ctaPresentation === opt.value
									? "border-red-600 bg-red-50"
									: "border-stone-200 bg-white hover:bg-stone-50"
							}`}
						>
							<p className="text-xs font-semibold text-ink-950">{opt.label}</p>
							<p className="mt-0.5 text-[11px] text-stone-500">{opt.hint}</p>
						</button>
					))}
				</div>
			</div>

			<div className="border-t border-stone-100 pt-5">
				<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
					Primary CTA <span className="text-red-500">*</span>
				</p>
				<div className="grid gap-3 sm:grid-cols-2">
					<input
						type="text"
						value={hero.primaryCta.label}
						onChange={(e) => set("primaryCta", { ...hero.primaryCta, label: e.target.value })}
						placeholder="Register Interest"
						className={inputCls}
					/>
					<select
						value={hero.primaryCta.formId}
						onChange={(e) => set("primaryCta", { ...hero.primaryCta, formId: e.target.value })}
						className={selectCls}
					>
						<option value="">Select a form...</option>
						{forms.map((f) => (
							<option key={f.id} value={f.id}>{f.title}</option>
						))}
					</select>
				</div>
			</div>

			<div className="border-t border-stone-100 pt-5">
				<div className="mb-3 flex items-center justify-between">
					<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Secondary CTA</p>
					{hero.secondaryCta ? (
						<button
							type="button"
							onClick={() => onChange({ ...hero, secondaryCta: null })}
							className="text-xs font-medium text-red-500 hover:text-red-600"
						>
							Remove
						</button>
					) : (
						<button
							type="button"
							onClick={() => onChange({ ...hero, secondaryCta: { label: "Learn More", formId: "" } })}
							className="text-xs font-medium text-red-600 hover:text-red-700"
						>
							+ Add secondary CTA
						</button>
					)}
				</div>

				{hero.secondaryCta ? (
					<div className="grid gap-3 sm:grid-cols-2">
						<input
							type="text"
							value={hero.secondaryCta.label}
							onChange={(e) =>
								onChange({ ...hero, secondaryCta: { ...hero.secondaryCta!, label: e.target.value } })
							}
							placeholder="Watch Video"
							className={inputCls}
						/>
						<select
							value={hero.secondaryCta.formId}
							onChange={(e) =>
								onChange({ ...hero, secondaryCta: { ...hero.secondaryCta!, formId: e.target.value } })
							}
							className={selectCls}
						>
							<option value="">Select a form...</option>
							{forms.map((f) => (
								<option key={f.id} value={f.id}>{f.title}</option>
							))}
						</select>
					</div>
				) : null}
			</div>
		</div>
	);
}