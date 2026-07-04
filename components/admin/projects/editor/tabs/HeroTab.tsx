import { ImageIcon, Upload } from "lucide-react";
import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

interface HeroTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

export function HeroTab({ state, onChange }: HeroTabProps) {
	return (
		<div className="space-y-6">
			<div>
				<p className="mb-3 text-sm font-medium text-ink-950">Cover Image</p>
				{state.coverImageSrc ? (
					<div className="relative overflow-hidden rounded-2xl">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={state.coverImageSrc}
							alt={state.coverImageAlt || "Cover"}
							className="aspect-[16/9] w-full object-cover"
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
							<span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink-950">
								Replace Image
							</span>
						</div>
					</div>
				) : (
					<div className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50">
						<ImageIcon className="h-10 w-10 text-stone-300" />
						<p className="mt-2 text-sm font-medium text-stone-500">
							No cover image
						</p>
					</div>
				)}
				<button
					type="button"
					className="mt-3 flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-stone-50"
				>
					<Upload className="h-4 w-4" />
					Upload via Cloudinary
					<span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
						TODO
					</span>
				</button>
			</div>

			<EditorField
				label="Cover Image Alt Text"
				hint="Describe the image for accessibility and SEO"
				required
			>
				<input
					type="text"
					value={state.coverImageAlt}
					onChange={(e) => onChange("coverImageAlt", e.target.value)}
					placeholder="e.g. Vatican Court apartment building exterior"
					className={inputCls}
				/>
			</EditorField>

			<EditorField
				label="Cover Image URL"
				hint="Will be replaced by Cloudinary upload in integration stage"
			>
				<input
					type="url"
					value={state.coverImageSrc}
					onChange={(e) => onChange("coverImageSrc", e.target.value)}
					placeholder="https://images.unsplash.com/..."
					className={inputCls}
				/>
			</EditorField>

			<div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
					Image Overlay Text
				</p>
				<p className="mt-1 text-xs text-stone-400">
					Appears on the cover image in the project hero section.
				</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					<EditorField label="Developer Label">
						<input
							type="text"
							value={state.developerLabel}
							onChange={(e) => onChange("developerLabel", e.target.value)}
							className={inputCls}
						/>
					</EditorField>
					<EditorField label="Type Label">
						<input
							type="text"
							value={state.typeLabel}
							onChange={(e) => onChange("typeLabel", e.target.value)}
							className={inputCls}
						/>
					</EditorField>
				</div>
			</div>
		</div>
	);
}
