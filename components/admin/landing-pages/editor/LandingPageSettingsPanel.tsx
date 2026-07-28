// components/admin/landing-pages/editor/LandingPageSettingsPanel.tsx
"use client";

import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import type { LandingPageEditorState } from "@/lib/types/admin/landing-page";
import type { ProjectPickerOption } from "@/lib/types/admin/landing-page";

interface LandingPageSettingsPanelProps {
	state: LandingPageEditorState;
	onChange: <K extends keyof LandingPageEditorState>(
		key: K,
		value: LandingPageEditorState[K],
	) => void;
	projects: ProjectPickerOption[];
	slugManuallyEdited: boolean;
	onSlugManualEdit: () => void;
}

export function LandingPageSettingsPanel({
	state,
	onChange,
	projects,
	slugManuallyEdited,
	onSlugManualEdit,
}: LandingPageSettingsPanelProps) {
	return (
		<div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6">
			<div>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
					Status
				</p>
				<div className="flex gap-2">
					{(["draft", "published"] as const).map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => onChange("publishStatus", s)}
							className={`flex-1 rounded-lg border py-2 text-xs font-semibold capitalize transition-colors ${
								state.publishStatus === s
									? "border-red-600 bg-red-600 text-white"
									: "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
							}`}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Internal Title <span className="text-red-500">*</span>
					<span className="ml-2 font-normal normal-case text-stone-400">
						— never shown publicly
					</span>
				</label>
				<input
					type="text"
					value={state.title}
					onChange={(e) => {
						onChange("title", e.target.value);
						// Auto-suggest the slug from the title until the admin
						// deliberately edits the slug field themselves — after
						// that, title edits never overwrite their chosen slug.
						if (!slugManuallyEdited) {
							onChange(
								"slug",
								e.target.value
									.toLowerCase()
									.replace(/[^a-z0-9]+/g, "-")
									.replace(/^-|-$/g, ""),
							);
						}
					}}
					placeholder="e.g. Yaba Diaspora Investment Campaign"
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					URL Slug <span className="text-red-500">*</span>
				</label>
				<div className="flex items-center gap-2">
					<span className="text-xs text-stone-400">/lp/</span>
					<input
						type="text"
						value={state.slug}
						onChange={(e) => {
							onSlugManualEdit();
							onChange(
								"slug",
								e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
							);
						}}
						placeholder="yaba-diaspora-campaign"
						className={`${inputCls} flex-1`}
					/>
				</div>
				<p className="mt-1 text-[11px] text-stone-400">
					This is the exact link to paste into ad platforms — changing it after
					an ad is live will break that ad&apos;s link.
				</p>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Campaign Type
				</label>
				<input
					type="text"
					value={state.campaignType}
					onChange={(e) => onChange("campaignType", e.target.value)}
					placeholder="e.g. Investment Campaign"
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Audience
				</label>
				<input
					type="text"
					value={state.audience}
					onChange={(e) => onChange("audience", e.target.value)}
					placeholder="e.g. Diaspora Investors"
					className={inputCls}
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Linked Project
				</label>
				<select
					value={state.linkedProjectSlug}
					onChange={(e) => {
						const slug = e.target.value;
						const project = projects.find((p) => p.slug === slug);
						onChange("linkedProjectSlug", slug);
						onChange("linkedProjectName", project?.name ?? "");
					}}
					className={selectCls}
				>
					<option value="">No linked project</option>
					{projects.map((p) => (
						<option key={p.slug} value={p.slug}>
							{p.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					CRM Tag
				</label>
				<input
					type="text"
					value={state.crmTag}
					onChange={(e) => onChange("crmTag", e.target.value)}
					placeholder="e.g. Shortlet Investor, High Intent"
					className={inputCls}
				/>
			</div>
		</div>
	);
}