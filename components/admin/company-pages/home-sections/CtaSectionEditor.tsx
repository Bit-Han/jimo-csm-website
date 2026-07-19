//@components/admin/company-pages/home-sections/AboutSectionEditor.tsx

"use client";

import { useState } from "react";
import { inputCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { saveHomeCta } from "@/lib/actions/admin/home-content";
import type { HomeCtaSection } from "@/lib/types/home";

export function CtaSectionEditor({ initial }: { initial: HomeCtaSection }) {
	const [data, setData] = useState<HomeCtaSection>(initial);

	return (
		<div className="space-y-4 pt-4">
			<div>
				<label className="mb-1.5 block text-xs font-medium text-stone-500">
					Eyebrow
				</label>
				<input
					type="text"
					value={data.eyebrow}
					onChange={(e) => setData((p) => ({ ...p, eyebrow: e.target.value }))}
					className={inputCls}
				/>
			</div>
			<div>
				<label className="mb-1.5 block text-xs font-medium text-stone-500">
					Heading
				</label>
				<input
					type="text"
					value={data.heading}
					onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))}
					className={inputCls}
				/>
			</div>
			<div>
				<label className="mb-1.5 block text-xs font-medium text-stone-500">
					Description
				</label>
				<textarea
					rows={3}
					value={data.description}
					onChange={(e) =>
						setData((p) => ({ ...p, description: e.target.value }))
					}
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
							setData((p) => ({
								...p,
								primaryCta: { ...p.primaryCta, label: e.target.value },
							}))
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
							setData((p) => ({
								...p,
								primaryCta: { ...p.primaryCta, href: e.target.value },
							}))
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
							setData((p) => ({
								...p,
								secondaryCta: { ...p.secondaryCta, label: e.target.value },
							}))
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
							setData((p) => ({
								...p,
								secondaryCta: { ...p.secondaryCta, href: e.target.value },
							}))
						}
						className={inputCls}
					/>
				</div>
			</div>
			<HomeSectionSaveButton onSave={() => saveHomeCta(data)} />
		</div>
	);
}
