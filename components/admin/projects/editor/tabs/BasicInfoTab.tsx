import { Plus, Trash2 } from "lucide-react";
import {
	EditorField,
	inputCls,
	selectCls,
} from "@/components/admin/ui/EditorField";
import type { ProjectEditorState } from "@/lib/types/admin/project-editor";

interface BasicInfoTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

export function BasicInfoTab({ state, onChange }: BasicInfoTabProps) {
	function updateOverview(index: number, value: string) {
		const next = [...state.overview];
		next[index] = value;
		onChange("overview", next);
	}

	function addOverviewParagraph() {
		onChange("overview", [...state.overview, ""]);
	}

	function removeOverviewParagraph(index: number) {
		onChange(
			"overview",
			state.overview.filter((_, i) => i !== index),
		);
	}

	function updateFact(id: string, field: "label" | "value", value: string) {
		onChange(
			"facts",
			state.facts.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2">
				<EditorField label="Project Name" required>
					<input
						type="text"
						value={state.name}
						onChange={(e) => onChange("name", e.target.value)}
						placeholder="e.g. Vatican Court"
						className={inputCls}
					/>
				</EditorField>

				<EditorField label="Location" required>
					<input
						type="text"
						value={state.location}
						onChange={(e) => onChange("location", e.target.value)}
						placeholder="e.g. Akoka, Yaba"
						className={inputCls}
					/>
				</EditorField>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<EditorField label="Status">
					<select
						value={state.status}
						onChange={(e) =>
							onChange("status", e.target.value as ProjectEditorState["status"])
						}
						className={selectCls}
					>
						<option value="under-development">Under-Development</option>
						<option value="completed">Completed</option>
					</select>
				</EditorField>

				<EditorField
					label="Status Label"
					hint="Shown on project cards and badges"
				>
					<input
						type="text"
						value={state.statusLabel}
						onChange={(e) => onChange("statusLabel", e.target.value)}
						className={inputCls}
					/>
				</EditorField>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<EditorField label="Developer Label" hint="Shown on image overlay">
					<input
						type="text"
						value={state.developerLabel}
						onChange={(e) => onChange("developerLabel", e.target.value)}
						className={inputCls}
					/>
				</EditorField>

				<EditorField
					label="Type Label"
					hint="e.g. Premium Residence, Serviced Apartment"
				>
					<input
						type="text"
						value={state.typeLabel}
						onChange={(e) => onChange("typeLabel", e.target.value)}
						className={inputCls}
					/>
				</EditorField>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<EditorField label="Category Label" hint="Shown in project hero">
					<input
						type="text"
						value={state.categoryLabel}
						onChange={(e) => onChange("categoryLabel", e.target.value)}
						className={inputCls}
					/>
				</EditorField>

				<EditorField label="Category">
					<div className="flex gap-4 py-2.5">
						{(["residential", "hospitality"] as const).map((cat) => (
							<label
								key={cat}
								className="flex cursor-pointer items-center gap-2 text-sm"
							>
								<input
									type="checkbox"
									checked={state.categories.includes(cat)}
									onChange={(e) => {
										const next = e.target.checked
											? [...state.categories, cat]
											: state.categories.filter((c) => c !== cat);
										onChange("categories", next);
									}}
									className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
								/>
								<span className="capitalize text-ink-950">{cat}</span>
							</label>
						))}
					</div>
				</EditorField>
			</div>

			<EditorField
				label="Short Description"
				hint="Shown on the project card (max 200 chars)"
			>
				<textarea
					value={state.description}
					onChange={(e) => onChange("description", e.target.value)}
					rows={3}
					maxLength={200}
					className={inputCls}
				/>
				<p className="mt-1 text-right text-xs text-stone-400">
					{state.description.length}/200
				</p>
			</EditorField>

			<div>
				<div className="mb-2 flex items-center justify-between">
					<label className="text-sm font-medium text-ink-950">
						Overview Paragraphs
					</label>
					<button
						type="button"
						onClick={addOverviewParagraph}
						className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Paragraph
					</button>
				</div>
				<div className="space-y-3">
					{state.overview.map((para, i) => (
						<div key={i} className="flex gap-2">
							<textarea
								value={para}
								onChange={(e) => updateOverview(i, e.target.value)}
								rows={3}
								placeholder={`Paragraph ${i + 1}`}
								className={inputCls}
							/>
							{state.overview.length > 1 ? (
								<button
									type="button"
									onClick={() => removeOverviewParagraph(i)}
									aria-label="Remove paragraph"
									className="shrink-0 self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							) : null}
						</div>
					))}
				</div>
			</div>

			<div>
				<p className="mb-3 text-sm font-medium text-ink-950">
					Project Facts (Sidebar)
				</p>
				<div className="space-y-2">
					{state.facts.map((fact) => (
						<div key={fact.id} className="grid grid-cols-[1fr_2fr] gap-2">
							<input
								type="text"
								value={fact.label}
								onChange={(e) => updateFact(fact.id, "label", e.target.value)}
								placeholder="Label"
								className={inputCls}
							/>
							<input
								type="text"
								value={fact.value}
								onChange={(e) => updateFact(fact.id, "value", e.target.value)}
								placeholder="Value"
								className={inputCls}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
