//@components/admin/company-pages/home-sections/HowWeWorkSectionEditor.tsx

"use client";

import { useState } from "react";
import { inputCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { saveHomeHowWeWork } from "@/lib/actions/admin/home-content";
import type { HomeHowWeWorkSection } from "@/lib/types/home";

export function HowWeWorkSectionEditor({
	initial,
}: {
	initial: HomeHowWeWorkSection;
}) {
	const [data, setData] = useState<HomeHowWeWorkSection>(initial);

	function updateStep(id: string, title: string) {
		setData((p) => ({
			...p,
			steps: p.steps.map((s) => (s.id === id ? { ...s, title } : s)),
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
				Steps
			</p>
			{data.steps.map((step) => (
				<div key={step.id} className="flex items-center gap-3">
					<span className="w-8 shrink-0 text-center text-sm font-bold text-red-600">
						{step.number}
					</span>
					<input
						type="text"
						value={step.title}
						onChange={(e) => updateStep(step.id, e.target.value)}
						placeholder={`Step ${step.number} title`}
						className={`${inputCls} flex-1`}
					/>
				</div>
			))}
			<HomeSectionSaveButton onSave={() => saveHomeHowWeWork(data)} />
		</div>
	);
}
