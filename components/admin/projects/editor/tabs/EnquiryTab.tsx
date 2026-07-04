import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

interface EnquiryTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

export function EnquiryTab({ state, onChange }: EnquiryTabProps) {
	return (
		<div className="space-y-5">
			<p className="text-xs text-stone-500">
				These fields control the dark CTA banner at the bottom of the project
				detail page.
			</p>

			<EditorField label="CTA Heading" required>
				<input
					type="text"
					value={state.contactCtaTitle}
					onChange={(e) => onChange("contactCtaTitle", e.target.value)}
					placeholder="e.g. Secure your interest in Vatican Court"
					className={inputCls}
				/>
			</EditorField>

			<EditorField label="CTA Description">
				<textarea
					rows={3}
					value={state.contactCtaDescription}
					onChange={(e) => onChange("contactCtaDescription", e.target.value)}
					placeholder="Speak with our team to confirm price, availability..."
					className={inputCls}
				/>
			</EditorField>

			<div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
					CTA Buttons
				</p>
				<p className="mt-1.5 text-xs text-stone-400">
					Primary: Register Interest → links to /contact?project=[slug]
					<br />
					Secondary: Speak With Our Team → links to /contact
					<br />
					These links are generated automatically from the project slug.
				</p>
			</div>
		</div>
	);
}
