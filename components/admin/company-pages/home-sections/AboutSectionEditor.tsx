"use client";

import { useState } from "react";
import { inputCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { saveHomeAbout } from "@/lib/actions/admin/home-content";
import type { HomeAboutSection } from "@/lib/types/home";

export function AboutSectionEditor({ initial }: { initial: HomeAboutSection }) {
	const [data, setData] = useState<HomeAboutSection>(initial);

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
					rows={4}
					value={data.description}
					onChange={(e) =>
						setData((p) => ({ ...p, description: e.target.value }))
					}
					className={inputCls}
				/>
				<p className="mt-1 text-right text-xs text-stone-400">
					{data.description.length} chars
				</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				<div>
					<label className="mb-1.5 block text-xs font-medium text-stone-500">
						Link Label
					</label>
					<input
						type="text"
						value={data.cta.label}
						onChange={(e) =>
							setData((p) => ({
								...p,
								cta: { ...p.cta, label: e.target.value },
							}))
						}
						className={inputCls}
					/>
				</div>
				<div>
					<label className="mb-1.5 block text-xs font-medium text-stone-500">
						Link URL
					</label>
					<input
						type="text"
						value={data.cta.href}
						onChange={(e) =>
							setData((p) => ({
								...p,
								cta: { ...p.cta, href: e.target.value },
							}))
						}
						className={inputCls}
					/>
				</div>
			</div>
			<HomeSectionSaveButton onSave={() => saveHomeAbout(data)} />
		</div>
	);
}
