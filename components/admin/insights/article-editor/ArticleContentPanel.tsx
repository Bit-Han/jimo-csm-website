// components/admin/insights/article-editor/ArticleContentPanel.tsx
"use client";

import { inputCls } from "@/components/admin/ui/EditorField";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
// import { RichTextEditor } from "./RichTextEditor";
import { extractPlainText } from "@/lib/utils/tiptap";
import type { ArticleEditorState } from "@/lib/types/admin/article";
import dynamic from "next/dynamic";


const RichTextEditor = dynamic(
	() => import("./RichTextEditor").then((mod) => mod.RichTextEditor),
	{
		ssr: false, // This blocks Turbopack from running Tiptap on the server
		loading: () => (
			<div className="flex min-h-[380px] items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
				<div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
			</div>
		),
	},
);


interface ArticleContentPanelProps {
  state: ArticleEditorState;
  onChange: <K extends keyof ArticleEditorState>(key: K, value: ArticleEditorState[K]) => void;
  onQueueImageDeletion: (url: string) => void;
}

export function ArticleContentPanel({ state, onChange, onQueueImageDeletion }: ArticleContentPanelProps) {
  function handleCoverImageChange(url: string, alt: string, previousUrl?: string) {
    if (previousUrl) onQueueImageDeletion(previousUrl);
    onChange("coverImageSrc", url);
    onChange("coverImageAlt", alt);
  }

  const wordCount = extractPlainText(state.content).split(/\s+/).filter(Boolean).length;

  return (
		<div className="flex flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-6">
			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Article Title <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					value={state.title}
					onChange={(e) => onChange("title", e.target.value)}
					placeholder="e.g. Why Yaba is Becoming Premium"
					className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-xl font-bold text-ink-950 placeholder:text-stone-300 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
					Excerpt
					<span className="ml-2 font-normal normal-case text-stone-400">
						— shown in article cards and meta description fallback
					</span>
				</label>
				<textarea
					value={state.excerpt}
					onChange={(e) => onChange("excerpt", e.target.value)}
					rows={3}
					placeholder="A short summary that appears in the article listing..."
					className={inputCls}
				/>
				<p className="mt-1 text-right text-xs text-stone-400">
					{state.excerpt.length} chars
				</p>
			</div>

			<ImageUploadField
				label="Cover Image"
				value={state.coverImageSrc}
				altValue={state.coverImageAlt}
				onChange={handleCoverImageChange}
				folder="jimo-property/insights"
				aspectClass="aspect-[16/7]"
				hint="Shown on the article card and at the top of the published article. Recommended: 1600×700px or wider."
			/>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
						Article Body
					</label>
					<p className="text-xs text-stone-400">
						~{Math.max(1, Math.round(wordCount / 200))} min read · {wordCount}{" "}
						words
					</p>
				</div>

				{/* <RichTextEditor
					content={state.content}
					onChange={(json) => onChange("content", json)}
					uploadFolder="insights-body"
				/> */}

				<RichTextEditor
					key={state.slug || "new-article"}
					content={state.content}
					onChange={(json) => onChange("content", json)}
					uploadFolder="insights-body"
				/>
			</div>
		</div>
	);
}