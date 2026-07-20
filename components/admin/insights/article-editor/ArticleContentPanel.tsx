// //@components/admin/insights/article-editor/ArticleContentPanel.tsx
// import { Plus, Trash2 } from "lucide-react";
// import { inputCls } from "@/components/admin/ui/EditorField";
// import type { ArticleEditorState } from "@/lib/types/admin/article";

// interface ArticleContentPanelProps {
//   state: ArticleEditorState;
//   onChange: <K extends keyof ArticleEditorState>(
//     key: K,
//     value: ArticleEditorState[K],
//   ) => void;
// }

// export function ArticleContentPanel({ state, onChange }: ArticleContentPanelProps) {
//   function updateParagraph(index: number, value: string) {
//     const next = [...state.body];
//     next[index] = value;
//     onChange("body", next);
//   }

//   function addParagraph() {
//     onChange("body", [...state.body, ""]);
//   }

//   function removeParagraph(index: number) {
//     onChange(
//       "body",
//       state.body.filter((_, i) => i !== index),
//     );
//   }

//   return (
//     <div className="flex flex-col gap-6 rounded-2xl border border-stone-200 bg-white p-6">
//       {/* Title */}
//       <div>
//         <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
//           Article Title <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           value={state.title}
//           onChange={(e) => onChange("title", e.target.value)}
//           placeholder="e.g. Why Yaba is Becoming Premium"
//           className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-xl font-bold text-ink-950 placeholder:text-stone-300 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
//         />
//       </div>

//       {/* Excerpt */}
//       <div>
//         <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
//           Excerpt
//           <span className="ml-2 font-normal normal-case text-stone-400">
//             — shown in article cards and meta description fallback
//           </span>
//         </label>
//         <textarea
//           value={state.excerpt}
//           onChange={(e) => onChange("excerpt", e.target.value)}
//           rows={3}
//           placeholder="A short summary that appears in the article listing..."
//           className={inputCls}
//         />
//         <p className="mt-1 text-right text-xs text-stone-400">
//           {state.excerpt.length} chars
//         </p>
//       </div>

//       {/* Cover Image */}
//       <div>
//         <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
//           Cover Image
//         </label>
//         {state.coverImageSrc ? (
//           <div className="relative mb-3 aspect-[16/7] overflow-hidden rounded-2xl">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={state.coverImageSrc}
//               alt={state.coverImageAlt || "Cover"}
//               className="h-full w-full object-cover"
//             />
//           </div>
//         ) : null}
//         <div className="grid gap-3 sm:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-xs font-medium text-stone-500">
//               Image URL
//             </label>
//             <input
//               type="url"
//               value={state.coverImageSrc}
//               onChange={(e) => onChange("coverImageSrc", e.target.value)}
//               placeholder="https://..."
//               className={inputCls}
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-xs font-medium text-stone-500">
//               Alt Text
//             </label>
//             <input
//               type="text"
//               value={state.coverImageAlt}
//               onChange={(e) => onChange("coverImageAlt", e.target.value)}
//               placeholder="Describe the image"
//               className={inputCls}
//             />
//           </div>
//         </div>
//         <p className="mt-1.5 text-xs text-stone-400">
//           Cloudinary upload available in the integration stage.
//         </p>
//       </div>

//       {/* Body paragraphs */}
//       <div>
//         <div className="mb-3 flex items-center justify-between">
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
//               Article Body
//             </label>
//             <p className="mt-0.5 text-xs text-stone-400">
//               Each block becomes a paragraph in the published article.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={addParagraph}
//             className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Add Paragraph
//           </button>
//         </div>

//         <div className="space-y-3">
//           {state.body.map((paragraph, index) => (
//             <div key={index} className="flex gap-2">
//               <div className="flex w-6 shrink-0 flex-col items-center gap-1 pt-2.5">
//                 <span className="text-[10px] font-medium text-stone-400">
//                   {index + 1}
//                 </span>
//               </div>
//               <textarea
//                 value={paragraph}
//                 onChange={(e) => updateParagraph(index, e.target.value)}
//                 rows={4}
//                 placeholder={`Paragraph ${index + 1}...`}
//                 className={`${inputCls} flex-1`}
//               />
//               {state.body.length > 1 ? (
//                 <button
//                   type="button"
//                   onClick={() => removeParagraph(index)}
//                   aria-label="Remove paragraph"
//                   className="self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               ) : null}
//             </div>
//           ))}
//         </div>

//         {/* Word count estimate */}
//         <p className="mt-3 text-right text-xs text-stone-400">
//           ~
//           {Math.round(
//             state.body.join(" ").split(/\s+/).filter(Boolean).length / 200,
//           )}{" "}
//           min read · {state.body.join(" ").split(/\s+/).filter(Boolean).length} words
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { inputCls } from "@/components/admin/ui/EditorField";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import type { ArticleEditorState } from "@/lib/types/admin/article";
import type { InsightBodyBlock } from "@/lib/types/insight";

interface ArticleContentPanelProps {
	state: ArticleEditorState;
	onChange: <K extends keyof ArticleEditorState>(
		key: K,
		value: ArticleEditorState[K],
	) => void;
	onQueueImageDeletion: (url: string) => void;
}

function newBlockId() {
	return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ArticleContentPanel({
	state,
	onChange,
	onQueueImageDeletion,
}: ArticleContentPanelProps) {
	function updateBlock(id: string, patch: Partial<InsightBodyBlock>) {
		onChange(
			"body",
			state.body.map((b) =>
				b.id === id ? ({ ...b, ...patch } as InsightBodyBlock) : b,
			),
		);
	}

	function addParagraph() {
		onChange("body", [
			...state.body,
			{ id: newBlockId(), type: "paragraph", text: "" },
		]);
	}

	function addImageBlock() {
		onChange("body", [
			...state.body,
			{ id: newBlockId(), type: "image", src: "", alt: "" },
		]);
	}

	function removeBlock(id: string) {
		const block = state.body.find((b) => b.id === id);
		if (block?.type === "image" && block.src) onQueueImageDeletion(block.src);
		onChange(
			"body",
			state.body.filter((b) => b.id !== id),
		);
	}

	function handleCoverImageChange(
		url: string,
		alt: string,
		previousUrl?: string,
	) {
		if (previousUrl) onQueueImageDeletion(previousUrl);
		onChange("coverImageSrc", url);
		onChange("coverImageAlt", alt);
	}

	const wordCount = state.body
		.filter(
			(b): b is Extract<InsightBodyBlock, { type: "paragraph" }> =>
				b.type === "paragraph",
		)
		.map((b) => b.text)
		.join(" ")
		.split(/\s+/)
		.filter(Boolean).length;

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
					<div>
						<label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
							Article Body
						</label>
						<p className="mt-0.5 text-xs text-stone-400">
							Add paragraphs and images in the order they should appear.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={addImageBlock}
							className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
						>
							<ImageIcon className="h-3.5 w-3.5" />
							Add Image
						</button>
						<button
							type="button"
							onClick={addParagraph}
							className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Paragraph
						</button>
					</div>
				</div>

				<div className="space-y-4">
					{state.body.map((block, index) => (
						<div key={block.id} className="flex gap-2">
							<span className="w-6 shrink-0 pt-2.5 text-center text-[10px] font-medium text-stone-400">
								{index + 1}
							</span>

							{block.type === "paragraph" ? (
								<textarea
									value={block.text}
									onChange={(e) =>
										updateBlock(block.id, { text: e.target.value })
									}
									rows={4}
									placeholder={`Paragraph ${index + 1}...`}
									className={`${inputCls} flex-1`}
								/>
							) : (
								<div className="flex-1 rounded-xl border border-dashed border-stone-200 bg-stone-50 p-4">
									<ImageUploadField
										label={`Image block ${index + 1}`}
										value={block.src}
										altValue={block.alt}
										onChange={(url, alt, previousUrl) => {
											if (previousUrl) onQueueImageDeletion(previousUrl);
											updateBlock(block.id, { src: url, alt });
										}}
										folder="jimo-property/insights-body"
										aspectClass="aspect-[16/9]"
										hint="Inserted inline in the article at this position."
									/>
								</div>
							)}

							<button
								type="button"
								onClick={() => removeBlock(block.id)}
								aria-label={
									block.type === "image"
										? "Remove image block"
										: "Remove paragraph"
								}
								className="self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					))}
					{state.body.length === 0 ? (
						<p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-6 text-center text-sm text-stone-400">
							No content yet — add a paragraph or image to get started.
						</p>
					) : null}
				</div>

				<p className="mt-3 text-right text-xs text-stone-400">
					~{Math.max(1, Math.round(wordCount / 200))} min read · {wordCount}{" "}
					words
				</p>
			</div>
		</div>
	);
}