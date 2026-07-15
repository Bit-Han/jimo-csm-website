"use client";

import { useState } from "react";
import { inputCls } from "@/components/admin/ui/EditorField";
import { HomeSectionSaveButton } from "./HomeSectionSaveButton";
import { saveHomeFeatured } from "@/lib/actions/admin/home-content";
import type { HomeFeaturedSection } from "@/lib/types/home";

export function FeaturedSectionEditor({
	initial,
}: {
	initial: HomeFeaturedSection;
}) {
	const [data, setData] = useState<HomeFeaturedSection>(initial);

	return (
		<div className="space-y-4 pt-4">
			<p className="text-xs text-stone-400">
				Projects shown in this section are pulled from published projects in the
				database — edit the order by setting &quot;featured&quot; in the Projects editor.
			</p>
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
					Section Heading
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
					Section Description
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
			<HomeSectionSaveButton onSave={() => saveHomeFeatured(data)} />
		</div>
	);
}
