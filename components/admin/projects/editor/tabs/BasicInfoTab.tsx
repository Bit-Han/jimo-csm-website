//@components/admin/projects/editor/tabs/BasicInfoTab.tsx
import { Plus, Trash2 } from "lucide-react";
import {
	EditorField,
	inputCls,
	selectCls,
} from "@/components/admin/ui/EditorField";
import { amenityIconOptions } from "@/lib/data/amenity-icons";
import type {
	EditorAmenity,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";
import { SuggestInput } from "@/components/admin/ui/SuggestInput";
import type { ProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";

// interface BasicInfoTabProps {
// 	state: ProjectEditorState;
// 	onChange: <K extends keyof ProjectEditorState>(
// 		key: K,
// 		value: ProjectEditorState[K],
// 	) => void;
// }
interface BasicInfoTabProps {
  state: ProjectEditorState;
  onChange: <K extends keyof ProjectEditorState>(key: K, value: ProjectEditorState[K]) => void;
  suggestions: ProjectFieldSuggestions;
}

function makeAmenity(): EditorAmenity {
	return {
		id: `amenity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		label: "",
		icon: "shield-check",
	};
}

export function BasicInfoTab({ state, onChange, suggestions }: BasicInfoTabProps) {
	// ── Overview helpers ─────────────────────────────────────────────────────
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

	// ── Facts helpers ────────────────────────────────────────────────────────
	function updateFact(id: string, field: "label" | "value", value: string) {
		onChange(
			"facts",
			state.facts.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
		);
	}

	// ── Amenities helpers ────────────────────────────────────────────────────
	function addAmenity() {
		onChange("amenities", [...state.amenities, makeAmenity()]);
	}

	function updateAmenity(
		id: string,
		field: keyof EditorAmenity,
		value: string,
	) {
		onChange(
			"amenities",
			state.amenities.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
		);
	}

	function removeAmenity(id: string) {
		onChange(
			"amenities",
			state.amenities.filter((a) => a.id !== id),
		);
	}

	return (
		<div className="space-y-6">
			{/* Name + Location */}
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
					<SuggestInput
						listId="location-suggestions"
						value={state.location}
						onChange={(v) => onChange("location", v)}
						suggestions={suggestions.locations}
						placeholder="e.g. Akoka, Yaba"
						className={inputCls}
					/>
				</EditorField>
			</div>

			{/* Status + Status Label */}
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

			{/* Developer + Type labels */}
			<div className="grid gap-4 sm:grid-cols-2">
				<EditorField label="Developer Label" hint="Shown on image overlay">
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
						placeholder="e.g. Premium Residence"
						className={inputCls}
					/>
				</EditorField>
			</div>

			{/* Category Label + checkboxes */}
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

			{/* Description */}
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

			{/* Overview */}
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

			{/* Facts */}
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

			{/* ── Amenities ─────────────────────────────────────────────────── */}
			<div>
				<div className="mb-3 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-ink-950">
							Features &amp; Amenities
						</p>
						<p className="mt-0.5 text-xs text-stone-400">
							Shown as tagged chips on the public project page.
						</p>
					</div>
					<button
						type="button"
						onClick={addAmenity}
						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Amenity
					</button>
				</div>

				{state.amenities.length === 0 ? (
					<div className="flex items-center justify-center rounded-xl border border-dashed border-stone-300 p-6 text-center">
						<p className="text-xs text-stone-400">
							No amenities yet. Click &quot;Add Amenity&quot; to add one.
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{state.amenities.map((amenity) => (
							<div key={amenity.id} className="flex items-center gap-2">
								{/* Icon picker */}
								<select
									value={amenity.icon}
									onChange={(e) =>
										updateAmenity(amenity.id, "icon", e.target.value)
									}
									className={`${selectCls} w-48 shrink-0`}
								>
									{amenityIconOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>

								{/* Label */}
								<input
									type="text"
									value={amenity.label}
									onChange={(e) =>
										updateAmenity(amenity.id, "label", e.target.value)
									}
									placeholder="e.g. Smart access"
									className={`${inputCls} flex-1`}
								/>

								{/* Remove */}
								<button
									type="button"
									onClick={() => removeAmenity(amenity.id)}
									aria-label="Remove amenity"
									className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}