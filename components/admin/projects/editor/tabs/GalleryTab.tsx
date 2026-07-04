import { ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import {
	EditorField,
	inputCls,
	selectCls,
} from "@/components/admin/ui/EditorField";
import type {
	EditorMediaItem,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";

interface GalleryTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

function makeMediaItem(): EditorMediaItem {
	return {
		id: `media-${Date.now()}`,
		type: "image",
		src: "",
		alt: "",
	};
}

export function GalleryTab({ state, onChange }: GalleryTabProps) {
	function addItem() {
		onChange("media", [...state.media, makeMediaItem()]);
	}

	function updateItem(id: string, field: keyof EditorMediaItem, value: string) {
		onChange(
			"media",
			state.media.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
		);
	}

	function removeItem(id: string) {
		onChange(
			"media",
			state.media.filter((m) => m.id !== id),
		);
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold text-ink-950">Gallery Media</p>
					<p className="text-xs text-stone-500">
						Images and videos shown in the carousel on the project detail page.
					</p>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
					>
						<Upload className="h-3.5 w-3.5" />
						Upload
						<span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-700">
							TODO
						</span>
					</button>
					<button
						type="button"
						onClick={addItem}
						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add URL
					</button>
				</div>
			</div>

			{state.media.length === 0 ? (
				<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
					<ImageIcon className="h-8 w-8 text-stone-300" />
					<p className="text-sm text-stone-500">No gallery media yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{state.media.map((item, index) => (
						<div
							key={item.id}
							className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
						>
							<div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2.5">
								<span className="text-xs font-semibold text-stone-500">
									Item {index + 1}
								</span>
								<button
									type="button"
									onClick={() => removeItem(item.id)}
									className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Remove
								</button>
							</div>
							<div className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_1fr]">
								<EditorField label="Type">
									<select
										value={item.type}
										onChange={(e) =>
											updateItem(item.id, "type", e.target.value)
										}
										className={selectCls}
									>
										<option value="image">Image</option>
										<option value="video">Video</option>
									</select>
								</EditorField>
								<EditorField label="URL">
									<input
										type="url"
										value={item.src}
										onChange={(e) => updateItem(item.id, "src", e.target.value)}
										placeholder="https://..."
										className={inputCls}
									/>
								</EditorField>
								<EditorField label="Alt Text">
									<input
										type="text"
										value={item.alt}
										onChange={(e) => updateItem(item.id, "alt", e.target.value)}
										placeholder="Describe the image"
										className={inputCls}
									/>
								</EditorField>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
