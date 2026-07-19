//@components/admin/company-pages/home-sections/HeroSectionEditor.tsx

"use client";

import { useState } from "react";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import { saveHomeHero } from "@/lib/actions/admin/home-content";
import { homeIconOptions } from "@/lib/data/home-icons";
import type { HomeHeroSection } from "@/lib/types/home";

export function HeroSectionEditor({ initial }: { initial: HomeHeroSection }) {
	const [data, setData] = useState<HomeHeroSection>(initial);

	function set(key: keyof HomeHeroSection, value: unknown) {
		setData((prev) => ({ ...prev, [key]: value }));
	}

	return (
		<div className="space-y-5 pt-4">
			{/* Image */}
			<ImageUploadField
				label="Hero Image"
				value={data.image.src}
				altValue={data.image.alt}
				onChange={(src, alt) => set("image", { src, alt })}
				folder="jimo-property/site-images"
				aspectClass="aspect-[16/7]"
				hint="The main image shown in the hero section. Recommended: 1920×800px or wider."
				required
			/>

			<div className="border-t border-stone-100 pt-4">
				<p className="mb-4 text-xs font-semibold uppercase tracking-wide text-stone-400">
					Text Content
				</p>

				<div className="space-y-4">
					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Eyebrow
							</label>
							<input
								type="text"
								value={data.eyebrow}
								onChange={(e) => set("eyebrow", e.target.value)}
								className={inputCls}
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Project Focus Label
							</label>
							<input
								type="text"
								value={data.projectFocusLabel}
								onChange={(e) => set("projectFocusLabel", e.target.value)}
								placeholder="e.g. Residential · Hospitality · Investment"
								className={inputCls}
							/>
						</div>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-medium text-stone-500">
							Main Heading *
						</label>
						<input
							type="text"
							value={data.heading}
							onChange={(e) => set("heading", e.target.value)}
							className={inputCls}
						/>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-medium text-stone-500">
							Description *
						</label>
						<textarea
							rows={3}
							value={data.description}
							onChange={(e) => set("description", e.target.value)}
							className={inputCls}
						/>
						<p className="mt-1 text-right text-xs text-stone-400">
							{data.description.length} chars
						</p>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-medium text-stone-500">
							&quot;Built For&quot; Label
						</label>
						<input
							type="text"
							value={data.builtForLabel}
							onChange={(e) => set("builtForLabel", e.target.value)}
							placeholder="e.g. Buyers, Investors & Partners"
							className={inputCls}
						/>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Primary Button Label
							</label>
							<input
								type="text"
								value={data.primaryCta.label}
								onChange={(e) =>
									set("primaryCta", {
										...data.primaryCta,
										label: e.target.value,
									})
								}
								className={inputCls}
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Primary Button URL
							</label>
							<input
								type="text"
								value={data.primaryCta.href}
								onChange={(e) =>
									set("primaryCta", {
										...data.primaryCta,
										href: e.target.value,
									})
								}
								className={inputCls}
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Secondary Button Label
							</label>
							<input
								type="text"
								value={data.secondaryCta.label}
								onChange={(e) =>
									set("secondaryCta", {
										...data.secondaryCta,
										label: e.target.value,
									})
								}
								className={inputCls}
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-stone-500">
								Secondary Button URL
							</label>
							<input
								type="text"
								value={data.secondaryCta.href}
								onChange={(e) =>
									set("secondaryCta", {
										...data.secondaryCta,
										href: e.target.value,
									})
								}
								className={inputCls}
							/>
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-medium text-stone-500">Stats Row</p>
						{data.stats.map((stat, i) => (
							<div
								key={stat.id}
								className="mb-2 grid grid-cols-[160px_1fr] gap-2"
							>
								<select
									value={stat.icon}
									onChange={(e) => {
										const next = [...data.stats];
										next[i] = {
											...stat,
											icon: e.target.value as typeof stat.icon,
										};
										set("stats", next);
									}}
									className={selectCls}
								>
									{homeIconOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
								<input
									type="text"
									value={stat.label}
									onChange={(e) => {
										const next = [...data.stats];
										next[i] = { ...stat, label: e.target.value };
										set("stats", next);
									}}
									placeholder="Stat label"
									className={inputCls}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<HomeSectionSaveButton onSave={() => saveHomeHero(data)} />
		</div>
	);
}
