import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

interface SeoTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

export function SeoTab({ state, onChange }: SeoTabProps) {
	const titleLen = state.seoTitle.length;
	const descLen = state.seoDescription.length;

	return (
		<div className="space-y-5">
			<EditorField
				label="SEO / Meta Title"
				hint="Optimal length: 50–60 characters"
			>
				<input
					type="text"
					value={state.seoTitle}
					onChange={(e) => onChange("seoTitle", e.target.value)}
					placeholder="e.g. Vatican Court Apartments | Jimo Property Development"
					maxLength={70}
					className={inputCls}
				/>
				<p
					className={`mt-1 text-right text-xs ${titleLen > 60 ? "text-amber-600" : "text-stone-400"}`}
				>
					{titleLen}/60
				</p>
			</EditorField>

			<EditorField
				label="Meta Description"
				hint="Optimal length: 140–160 characters"
			>
				<textarea
					rows={3}
					value={state.seoDescription}
					onChange={(e) => onChange("seoDescription", e.target.value)}
					placeholder="Describe this project page for search engines..."
					maxLength={180}
					className={inputCls}
				/>
				<p
					className={`mt-1 text-right text-xs ${descLen > 160 ? "text-amber-600" : "text-stone-400"}`}
				>
					{descLen}/160
				</p>
			</EditorField>

			<EditorField
				label="Focus Keyword"
				hint="Primary keyword for this project page"
			>
				<input
					type="text"
					value={state.focusKeyword}
					onChange={(e) => onChange("focusKeyword", e.target.value)}
					placeholder="e.g. apartments in Yaba Lagos"
					className={inputCls}
				/>
			</EditorField>

			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="noindex"
					checked={state.noIndex}
					onChange={(e) => onChange("noIndex", e.target.checked)}
					className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
				/>
				<label htmlFor="noindex" className="text-sm font-medium text-ink-950">
					No-index this page
					<span className="ml-2 text-xs font-normal text-stone-500">
						(hides the page from Google — use only for draft/test pages)
					</span>
				</label>
			</div>

			{state.seoTitle || state.seoDescription ? (
				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
						Google Search Preview
					</p>
					<div className="rounded-xl border border-stone-200 bg-white p-4">
						<p className="truncate text-base font-medium text-blue-700">
							{state.seoTitle || state.name}
						</p>
						<p className="mt-0.5 text-xs text-emerald-700">
							jimopropertydevelopment.com/projects/
							{state.name.toLowerCase().replace(/\s+/g, "-")}
						</p>
						<p className="mt-1 text-sm text-stone-600 line-clamp-2">
							{state.seoDescription || state.description}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
