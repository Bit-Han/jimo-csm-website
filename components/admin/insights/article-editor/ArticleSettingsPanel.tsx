import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { featuredProjects } from "@/lib/data/projects";
import { insightCategoryOptions } from "@/lib/data/insight-categories";
import type { ArticleEditorState } from "@/lib/types/admin/article";
import type { InsightCategory } from "@/lib/types/insight";

interface ArticleSettingsPanelProps {
	state: ArticleEditorState;
	onChange: <K extends keyof ArticleEditorState>(
		key: K,
		value: ArticleEditorState[K],
	) => void;
}

export function ArticleSettingsPanel({
	state,
	onChange,
}: ArticleSettingsPanelProps) {
	const titleLen = state.seoTitle.length;
	const descLen = state.seoDescription.length;

	return (
		<div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6">
			{/* Publish Status */}
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

			{/* Category */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Category
				</label>
				<select
					value={state.category}
					onChange={(e) => {
						const cat = e.target.value as InsightCategory;
						const found = insightCategoryOptions.find((o) => o.value === cat);
						onChange("category", cat);
						onChange("categoryLabel", found?.label ?? "");
					}}
					className={selectCls}
				>
					{insightCategoryOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* Related Project */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Related Project
				</label>
				<select
					value={state.relatedProjectSlug}
					onChange={(e) => {
						const slug = e.target.value;
						const project = featuredProjects.find((p) => p.slug === slug);
						onChange("relatedProjectSlug", slug);
						onChange("relatedProjectName", project?.name ?? "");
					}}
					className={selectCls}
				>
					<option value="">No related project</option>
					{featuredProjects.map((p) => (
						<option key={p.slug} value={p.slug}>
							{p.name}
						</option>
					))}
				</select>
			</div>

			{/* Published Date */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Published Date
				</label>
				<input
					type="date"
					value={state.publishedAt}
					onChange={(e) => onChange("publishedAt", e.target.value)}
					className={inputCls}
				/>
			</div>

			{/* Reading Time */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Read Time (minutes)
				</label>
				<input
					type="number"
					min={1}
					max={60}
					value={state.readTimeMinutes}
					onChange={(e) =>
						onChange("readTimeMinutes", parseInt(e.target.value, 10) || 1)
					}
					className={inputCls}
				/>
			</div>

			{/* Divider */}
			<div className="border-t border-stone-100 pt-1">
				<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
					SEO
				</p>
			</div>

			{/* SEO Title */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Meta Title
				</label>
				<input
					type="text"
					value={state.seoTitle}
					onChange={(e) => onChange("seoTitle", e.target.value)}
					placeholder="e.g. Why Yaba is Becoming Premium | Jimo"
					maxLength={70}
					className={inputCls}
				/>
				<p
					className={`mt-1 text-right text-xs ${
						titleLen > 60 ? "text-amber-600" : "text-stone-400"
					}`}
				>
					{titleLen}/60
				</p>
			</div>

			{/* Meta Description */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Meta Description
				</label>
				<textarea
					rows={3}
					value={state.seoDescription}
					onChange={(e) => onChange("seoDescription", e.target.value)}
					placeholder="Describe this article for search engines..."
					maxLength={180}
					className={inputCls}
				/>
				<p
					className={`mt-1 text-right text-xs ${
						descLen > 160 ? "text-amber-600" : "text-stone-400"
					}`}
				>
					{descLen}/160
				</p>
			</div>

			{/* Focus Keyword */}
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Focus Keyword
				</label>
				<input
					type="text"
					value={state.focusKeyword}
					onChange={(e) => onChange("focusKeyword", e.target.value)}
					placeholder="e.g. real estate Yaba Lagos"
					className={inputCls}
				/>
			</div>

			{/* Google preview */}
			{state.seoTitle || state.title ? (
				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
						Search Preview
					</p>
					<div className="rounded-xl border border-stone-200 bg-white p-4">
						<p className="truncate text-sm font-medium text-blue-700">
							{state.seoTitle || state.title}
						</p>
						<p className="mt-0.5 text-[10px] text-emerald-700">
							jimopropertydevelopment.com/insights/
							{(state.slug || state.title).toLowerCase().replace(/\s+/g, "-")}
						</p>
						<p className="mt-1 text-xs text-stone-600 line-clamp-2">
							{state.seoDescription || state.excerpt || "Meta description..."}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
