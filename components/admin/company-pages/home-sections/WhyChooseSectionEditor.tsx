//@components/admin/company-pages/home-sections/WhyChooseSectionEditor.tsx

"use client";

import { useState } from "react";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { saveHomeWhyChoose } from "@/lib/actions/admin/home-content";
import { homeIconOptions } from "@/lib/data/home-icons";
import type { HomeWhyChooseSection } from "@/lib/types/home";

export function WhyChooseSectionEditor({
	initial,
}: {
	initial: HomeWhyChooseSection;
}) {
	const [data, setData] = useState<HomeWhyChooseSection>(initial);

	function updateFeature(id: string, field: string, value: string) {
		setData((p) => ({
			...p,
			features: p.features.map((f) =>
				f.id === id ? { ...f, [field]: value } : f,
			),
		}));
	}

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
					rows={2}
					value={data.description}
					onChange={(e) =>
						setData((p) => ({ ...p, description: e.target.value }))
					}
					className={inputCls}
				/>
			</div>

			<p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
				Feature Cards
			</p>
			{data.features.map((feature) => (
				<div
					key={feature.id}
					className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3"
				>
					<div className="grid gap-3 sm:grid-cols-[160px_1fr]">
						<div>
							<label className="mb-1 block text-xs text-stone-500">Icon</label>
							<select
								value={feature.icon}
								onChange={(e) =>
									updateFeature(feature.id, "icon", e.target.value)
								}
								className={selectCls}
							>
								{homeIconOptions.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs text-stone-500">
								Card Title
							</label>
							<input
								type="text"
								value={feature.title}
								onChange={(e) =>
									updateFeature(feature.id, "title", e.target.value)
								}
								className={inputCls}
							/>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-xs text-stone-500">
							Card Description
						</label>
						<textarea
							rows={2}
							value={feature.description}
							onChange={(e) =>
								updateFeature(feature.id, "description", e.target.value)
							}
							className={inputCls}
						/>
					</div>
				</div>
			))}
			<HomeSectionSaveButton onSave={() => saveHomeWhyChoose(data)} />
		</div>
	);
}
