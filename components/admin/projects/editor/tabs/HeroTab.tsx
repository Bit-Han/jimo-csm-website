
// //@components/admin/projects/editor/tabs/HeroTab.tsx



import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import { ImageUploadField } from "@/components/admin/media/ImageUploadField";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

interface HeroTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
	onQueueImageDeletion: (url: string) => void;
}

export function HeroTab({
	state,
	onChange,
	onQueueImageDeletion,
}: HeroTabProps) {
	return (
		<div className="space-y-6">
			<ImageUploadField
				label="Cover Image"
				value={state.coverImageSrc}
				altValue={state.coverImageAlt}
				onChange={(src, alt, previousUrl) => {
					if (previousUrl) onQueueImageDeletion(previousUrl);
					onChange("coverImageSrc", src);
					onChange("coverImageAlt", alt);
				}}
				folder="jimo-property/project-renders"
				aspectClass="aspect-[16/9]"
				hint="Shown as the main hero image on the project page. Recommended: 1600×900px or larger."
				required
			/>

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
