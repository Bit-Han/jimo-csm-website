
//@components/admin/projects/editor/tabs/BasicInfoTab.tsx
// import { Plus, Trash2 } from "lucide-react";
// import {
// 	EditorField,
// 	inputCls,
// 	selectCls,
// } from "@/components/admin/ui/EditorField";
// import { amenityIconOptions } from "@/lib/data/amenity-icons";
// import type {
// 	EditorAmenity,
// 	EditorChecklistItem,
// 	ProjectEditorState,
// } from "@/lib/types/admin/project-editor";
// import { SuggestInput } from "@/components/admin/ui/SuggestInput";
// import type { ProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";

// interface BasicInfoTabProps {
//   state: ProjectEditorState;
//   onChange: <K extends keyof ProjectEditorState>(key: K, value: ProjectEditorState[K]) => void;
//   suggestions: ProjectFieldSuggestions;
// }

// function makeAmenity(): EditorAmenity {
// 	return {
// 		id: `amenity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
// 		label: "",
// 		icon: "shield-check",
// 	};
// }

// function makeHighlight(): EditorChecklistItem {
// 	return {
// 		id: `highlight-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
// 		label: "",
// 	};
// }

// export function BasicInfoTab({ state, onChange, suggestions }: BasicInfoTabProps) {
// 	// ── Overview helpers ─────────────────────────────────────────────────────
// 	function updateOverview(index: number, value: string) {
// 		const next = [...state.overview];
// 		next[index] = value;
// 		onChange("overview", next);
// 	}

// 	function addOverviewParagraph() {
// 		onChange("overview", [...state.overview, ""]);
// 	}

// 	function removeOverviewParagraph(index: number) {
// 		onChange(
// 			"overview",
// 			state.overview.filter((_, i) => i !== index),
// 		);
// 	}

// 	// ── Facts helpers ────────────────────────────────────────────────────────
// 	function updateFact(id: string, field: "label" | "value", value: string) {
// 		onChange(
// 			"facts",
// 			state.facts.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
// 		);
// 	}

// 	// ── Investment highlights helpers ────────────────────────────────────────
// 	function addHighlight() {
// 		onChange("investmentHighlights", [...state.investmentHighlights, makeHighlight()]);
// 	}

// 	function updateHighlight(id: string, label: string) {
// 		onChange(
// 			"investmentHighlights",
// 			state.investmentHighlights.map((item) =>
// 				item.id === id ? { ...item, label } : item,
// 			),
// 		);
// 	}

// 	function removeHighlight(id: string) {
// 		onChange(
// 			"investmentHighlights",
// 			state.investmentHighlights.filter((item) => item.id !== id),
// 		);
// 	}

// 	// ── Amenities helpers ────────────────────────────────────────────────────
// 	function addAmenity() {
// 		onChange("amenities", [...state.amenities, makeAmenity()]);
// 	}

// 	function updateAmenity(
// 		id: string,
// 		field: keyof EditorAmenity,
// 		value: string,
// 	) {
// 		onChange(
// 			"amenities",
// 			state.amenities.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
// 		);
// 	}

// 	function removeAmenity(id: string) {
// 		onChange(
// 			"amenities",
// 			state.amenities.filter((a) => a.id !== id),
// 		);
// 	}

// 	return (
// 		<div className="space-y-6">
// 			{/* Name + Location */}
// 			<div className="grid gap-4 sm:grid-cols-2">
// 				<EditorField label="Project Name" required>
// 					<input
// 						type="text"
// 						value={state.name}
// 						onChange={(e) => onChange("name", e.target.value)}
// 						placeholder="e.g. Vatican Court"
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 				<EditorField label="Location" required>
// 					<SuggestInput
// 						listId="location-suggestions"
// 						value={state.location}
// 						onChange={(v) => onChange("location", v)}
// 						suggestions={suggestions.locations}
// 						placeholder="e.g. Akoka, Yaba"
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 			</div>

// 			{/* Status + Status Label */}
// 			<div className="grid gap-4 sm:grid-cols-2">
// 				<EditorField label="Status">
// 					<select
// 						value={state.status}
// 						onChange={(e) =>
// 							onChange("status", e.target.value as ProjectEditorState["status"])
// 						}
// 						className={selectCls}
// 					>
// 						<option value="under-development">Under-Development</option>
// 						<option value="completed">Completed</option>
// 					</select>
// 				</EditorField>
// 				<EditorField
// 					label="Status Label"
// 					hint="Shown on project cards and badges"
// 				>
// 					<input
// 						type="text"
// 						value={state.statusLabel}
// 						onChange={(e) => onChange("statusLabel", e.target.value)}
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 			</div>

// 			{/* Developer + Type labels */}
// 			<div className="grid gap-4 sm:grid-cols-2">
// 				<EditorField label="Developer Label" hint="Shown on image overlay">
// 					<input
// 						type="text"
// 						value={state.developerLabel}
// 						onChange={(e) => onChange("developerLabel", e.target.value)}
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 				<EditorField label="Type Label">
// 					<input
// 						type="text"
// 						value={state.typeLabel}
// 						onChange={(e) => onChange("typeLabel", e.target.value)}
// 						placeholder="e.g. Premium Residence"
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 			</div>

// 			{/* Category Label + checkboxes */}
// 			<div className="grid gap-4 sm:grid-cols-2">
// 				<EditorField label="Category Label" hint="Shown in project hero">
// 					<input
// 						type="text"
// 						value={state.categoryLabel}
// 						onChange={(e) => onChange("categoryLabel", e.target.value)}
// 						className={inputCls}
// 					/>
// 				</EditorField>
// 				<EditorField label="Category">
// 					<div className="flex gap-4 py-2.5">
// 						{(["residential", "hospitality"] as const).map((cat) => (
// 							<label
// 								key={cat}
// 								className="flex cursor-pointer items-center gap-2 text-sm"
// 							>
// 								<input
// 									type="checkbox"
// 									checked={state.categories.includes(cat)}
// 									onChange={(e) => {
// 										const next = e.target.checked
// 											? [...state.categories, cat]
// 											: state.categories.filter((c) => c !== cat);
// 										onChange("categories", next);
// 									}}
// 									className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
// 								/>
// 								<span className="capitalize text-ink-950">{cat}</span>
// 							</label>
// 						))}
// 					</div>
// 				</EditorField>
// 			</div>

// 			{/* Description */}
// 			<EditorField
// 				label="Short Description"
// 				hint="Shown on the project card (max 200 chars)"
// 			>
// 				<textarea
// 					value={state.description}
// 					onChange={(e) => onChange("description", e.target.value)}
// 					rows={3}
// 					maxLength={200}
// 					className={inputCls}
// 				/>
// 				<p className="mt-1 text-right text-xs text-stone-400">
// 					{state.description.length}/200
// 				</p>
// 			</EditorField>

// 			{/* Overview */}
// 			<div>
// 				<div className="mb-2 flex items-center justify-between">
// 					<label className="text-sm font-medium text-ink-950">
// 						Overview Paragraphs
// 					</label>
// 					<button
// 						type="button"
// 						onClick={addOverviewParagraph}
// 						className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
// 					>
// 						<Plus className="h-3.5 w-3.5" />
// 						Add Paragraph
// 					</button>
// 				</div>
// 				<div className="space-y-3">
// 					{state.overview.map((para, i) => (
// 						<div key={i} className="flex gap-2">
// 							<textarea
// 								value={para}
// 								onChange={(e) => updateOverview(i, e.target.value)}
// 								rows={3}
// 								placeholder={`Paragraph ${i + 1}`}
// 								className={inputCls}
// 							/>
// 							{state.overview.length > 1 ? (
// 								<button
// 									type="button"
// 									onClick={() => removeOverviewParagraph(i)}
// 									aria-label="Remove paragraph"
// 									className="shrink-0 self-start rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
// 								>
// 									<Trash2 className="h-4 w-4" />
// 								</button>
// 							) : null}
// 						</div>
// 					))}
// 				</div>
// 			</div>

// 			{/* Facts */}
// 			<div>
// 				<p className="mb-3 text-sm font-medium text-ink-950">
// 					Project Facts (Sidebar)
// 				</p>
// 				<div className="space-y-2">
// 					{state.facts.map((fact) => (
// 						<div key={fact.id} className="grid grid-cols-[1fr_2fr] gap-2">
// 							<input
// 								type="text"
// 								value={fact.label}
// 								onChange={(e) => updateFact(fact.id, "label", e.target.value)}
// 								placeholder="Label"
// 								className={inputCls}
// 							/>
// 							<input
// 								type="text"
// 								value={fact.value}
// 								onChange={(e) => updateFact(fact.id, "value", e.target.value)}
// 								placeholder="Value"
// 								className={inputCls}
// 							/>
// 						</div>
// 					))}
// 				</div>
// 			</div>

// 			{/* ── Investment Highlights ─────────────────────────────────────── */}
// 			<div>
// 				<div className="mb-3 flex items-center justify-between">
// 					<div>
// 						<p className="text-sm font-medium text-ink-950">
// 							Investment Highlights
// 						</p>
// 						<p className="mt-0.5 text-xs text-stone-400">
// 							Shown as a checklist in the &quot;Investment Highlights&quot;
// 							section on the public project page.
// 						</p>
// 					</div>
// 					<button
// 						type="button"
// 						onClick={addHighlight}
// 						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
// 					>
// 						<Plus className="h-3.5 w-3.5" />
// 						Add Highlight
// 					</button>
// 				</div>

// 				{state.investmentHighlights.length === 0 ? (
// 					<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-8 text-center">
// 						<p className="text-xs text-stone-400">
// 							No investment highlights yet. Click &quot;Add Highlight&quot; to
// 							add one.
// 						</p>
// 					</div>
// 				) : (
// 					<div className="space-y-2">
// 						{state.investmentHighlights.map((item) => (
// 							<div key={item.id} className="flex items-center gap-2">
// 								<input
// 									type="text"
// 									value={item.label}
// 									onChange={(e) => updateHighlight(item.id, e.target.value)}
// 									placeholder="e.g. Completed property with immediate ownership potential"
// 									className={inputCls}
// 								/>
// 								<button
// 									type="button"
// 									onClick={() => removeHighlight(item.id)}
// 									aria-label="Remove investment highlight"
// 									className="shrink-0 rounded-lg border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:text-red-500"
// 								>
// 									<Trash2 className="h-4 w-4" />
// 								</button>
// 							</div>
// 						))}
// 					</div>
// 				)}
// 			</div>

// 			{/* ── Amenities ─────────────────────────────────────────────────── */}
// 			<div>
// 				<div className="mb-3 flex items-center justify-between">
// 					<div>
// 						<p className="text-sm font-medium text-ink-950">
// 							Features &amp; Amenities
// 						</p>
// 						<p className="mt-0.5 text-xs text-stone-400">
// 							Shown as tagged chips on the public project page.
// 						</p>
// 					</div>
// 					<button
// 						type="button"
// 						onClick={addAmenity}
// 						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
// 					>
// 						<Plus className="h-3.5 w-3.5" />
// 						Add Amenity
// 					</button>
// 				</div>

// 				{state.amenities.length === 0 ? (
// 					<div className="flex items-center justify-center rounded-xl border border-dashed border-stone-300 p-6 text-center">
// 						<p className="text-xs text-stone-400">
// 							No amenities yet. Click &quot;Add Amenity&quot; to add one.
// 						</p>
// 					</div>
// 				) : (
// 					<div className="space-y-2">
// 						{state.amenities.map((amenity) => (
// 							<div key={amenity.id} className="flex items-center gap-2">
// 								{/* Icon picker */}
// 								<select
// 									value={amenity.icon}
// 									onChange={(e) =>
// 										updateAmenity(amenity.id, "icon", e.target.value)
// 									}
// 									className={`${selectCls} w-48 shrink-0`}
// 								>
// 									{amenityIconOptions.map((opt) => (
// 										<option key={opt.value} value={opt.value}>
// 											{opt.label}
// 										</option>
// 									))}
// 								</select>

// 								{/* Label */}
// 								<input
// 									type="text"
// 									value={amenity.label}
// 									onChange={(e) =>
// 										updateAmenity(amenity.id, "label", e.target.value)
// 									}
// 									placeholder="e.g. Smart access"
// 									className={`${inputCls} flex-1`}
// 								/>

// 								{/* Remove */}
// 								<button
// 									type="button"
// 									onClick={() => removeAmenity(amenity.id)}
// 									aria-label="Remove amenity"
// 									className="shrink-0 rounded-lg border border-stone-200 p-2 text-stone-400 hover:border-red-200 hover:text-red-500"
// 								>
// 									<Trash2 className="h-4 w-4" />
// 								</button>
// 							</div>
// 						))}
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }


"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { EditorField, inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { SuggestInput } from "@/components/admin/ui/SuggestInput";
import { amenityIconMap, amenityIconOptions } from "@/lib/data/amenity-icons";
import type { ProjectAmenityIcon } from "@/lib/types/amenity";
import type {
	EditorAmenity,
	EditorChecklistItem,
	EditorFact,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";
import type { ProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";

interface BasicInfoTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
	suggestions?: ProjectFieldSuggestions;
}

// ─── Small helpers ─────────────────────────────────────────────────────────

function newId(prefix: string) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Fact row ──────────────────────────────────────────────────────────────

function FactRow({
	fact,
	onUpdate,
	onRemove,
	removable,
}: {
	fact: EditorFact;
	onUpdate: (patch: Partial<EditorFact>) => void;
	onRemove: () => void;
	removable: boolean;
}) {
	return (
		<div className="flex items-center gap-2">
			<input
				type="text"
				value={fact.label}
				onChange={(e) => onUpdate({ label: e.target.value })}
				placeholder="Label"
				className={cn(inputCls, "w-36 shrink-0")}
			/>
			<input
				type="text"
				value={fact.value}
				onChange={(e) => onUpdate({ value: e.target.value })}
				placeholder="Value"
				className={cn(inputCls, "flex-1")}
			/>
			{removable ? (
				<button
					type="button"
					onClick={onRemove}
					className="shrink-0 rounded-lg border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:text-red-500"
				>
					<Trash2 className="h-4 w-4" />
				</button>
			) : null}
		</div>
	);
}

// ─── Investment highlight / payment plan row ───────────────────────────────

function ChecklistRow({
	item,
	onUpdate,
	onRemove,
	placeholder,
}: {
	item: EditorChecklistItem;
	onUpdate: (label: string) => void;
	onRemove: () => void;
	placeholder: string;
}) {
	return (
		<div className="flex items-center gap-2">
			<input
				type="text"
				value={item.label}
				onChange={(e) => onUpdate(e.target.value)}
				placeholder={placeholder}
				className={cn(inputCls, "flex-1")}
			/>
			<button
				type="button"
				onClick={onRemove}
				className="shrink-0 rounded-lg border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:text-red-500"
			>
				<Trash2 className="h-4 w-4" />
			</button>
		</div>
	);
}

// ─── Amenity picker ────────────────────────────────────────────────────────
// The FIX: when an amenity is toggled on, BOTH icon AND label are taken
// from amenityIconOptions — label is never an empty string because it
// never comes from a free-text field. The admin simply taps to
// select/deselect. The DB then stores a complete { icon, label } pair.

function AmenityPicker({
	amenities,
	onChange,
}: {
	amenities: EditorAmenity[];
	onChange: (next: EditorAmenity[]) => void;
}) {
	const selectedIcons = new Set(amenities.map((a) => a.icon));

	function toggle(option: { value: ProjectAmenityIcon; label: string }) {
		if (selectedIcons.has(option.value)) {
			onChange(amenities.filter((a) => a.icon !== option.value));
		} else {
			onChange([
				...amenities,
				{
					// Stable id derived from the icon key — prevents duplicate
					// entries if the toggle is clicked rapidly.
					id: `amenity-${option.value}`,
					icon: option.value,
					// ← THE FIX: label comes directly from the options list,
					//   never from user input that could be left empty.
					label: option.label,
				},
			]);
		}
	}

	return (
		<div>
			<p className="mb-2 text-xs text-stone-500">
				Tap to select. Selected amenities appear on the public project page.
			</p>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{amenityIconOptions.map((option) => {
					const Icon = amenityIconMap[option.value];
					const selected = selectedIcons.has(option.value);

					return (
						<button
							key={option.value}
							type="button"
							onClick={() => toggle(option)}
							className={cn(
								"flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
								selected
									? "border-red-600 bg-red-50 text-red-700"
									: "border-stone-200 bg-white text-stone-600 hover:border-red-300 hover:bg-red-50",
							)}
						>
							<Icon className="h-4 w-4 shrink-0" />
							<span className="truncate">{option.label}</span>
						</button>
					);
				})}
			</div>
			{amenities.length > 0 ? (
				<p className="mt-2 text-xs font-medium text-stone-500">
					{amenities.length} amenit{amenities.length === 1 ? "y" : "ies"} selected
				</p>
			) : null}
		</div>
	);
}

// ─── Main tab ─────────────────────────────────────────────────────────────

export function BasicInfoTab({
	state,
	onChange,
	suggestions,
}: BasicInfoTabProps) {
	// ── Facts helpers ──
	function updateFact(id: string, patch: Partial<EditorFact>) {
		onChange(
			"facts",
			state.facts.map((f) => (f.id === id ? { ...f, ...patch } : f)),
		);
	}
	function removeFact(id: string) {
		onChange(
			"facts",
			state.facts.filter((f) => f.id !== id),
		);
	}
	function addFact() {
		onChange("facts", [
			...state.facts,
			{ id: newId("fact"), label: "", value: "" },
		]);
	}

	// ── Overview helpers ──
	function updateOverview(index: number, value: string) {
		const next = [...state.overview];
		next[index] = value;
		onChange("overview", next);
	}
	function removeOverview(index: number) {
		onChange(
			"overview",
			state.overview.filter((_, i) => i !== index),
		);
	}
	function addOverview() {
		onChange("overview", [...state.overview, ""]);
	}

	// ── Highlights helpers ──
	function updateHighlight(id: string, label: string) {
		onChange(
			"investmentHighlights",
			state.investmentHighlights.map((h) =>
				h.id === id ? { ...h, label } : h,
			),
		);
	}
	function removeHighlight(id: string) {
		onChange(
			"investmentHighlights",
			state.investmentHighlights.filter((h) => h.id !== id),
		);
	}
	function addHighlight() {
		onChange("investmentHighlights", [
			...state.investmentHighlights,
			{ id: newId("highlight"), label: "" },
		]);
	}

	return (
		<div className="space-y-6">
			{/* ── Core identity ── */}
			<section className="space-y-4">
				<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
					Core Info
				</h3>

				<EditorField label="Project Name" required>
					<input
						type="text"
						value={state.name}
						onChange={(e) => onChange("name", e.target.value)}
						placeholder="e.g. Vatican Court"
						className={inputCls}
					/>
				</EditorField>

				<div className="grid gap-3 sm:grid-cols-2">
					<EditorField label="Location">
						{suggestions ? (
							<SuggestInput
								listId="location-suggestions"
								value={state.location}
								onChange={(v) => onChange("location", v)}
								suggestions={suggestions.locations}
								placeholder="e.g. Akoka, Yaba"
								className={inputCls}
							/>
						) : (
							<input
								type="text"
								value={state.location}
								onChange={(e) => onChange("location", e.target.value)}
								placeholder="e.g. Akoka, Yaba"
								className={inputCls}
							/>
						)}
					</EditorField>

					<EditorField label="Developer Label">
						{suggestions ? (
							<SuggestInput
								listId="developer-label-suggestions"
								value={state.developerLabel}
								onChange={(v) => onChange("developerLabel", v)}
								suggestions={suggestions.developerLabels}
								placeholder="e.g. Jimo Development"
								className={inputCls}
							/>
						) : (
							<input
								type="text"
								value={state.developerLabel}
								onChange={(e) => onChange("developerLabel", e.target.value)}
								placeholder="e.g. Jimo Development"
								className={inputCls}
							/>
						)}
					</EditorField>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<EditorField label="Status">
						<select
							value={state.status}
							onChange={(e) => {
								const v = e.target.value as ProjectEditorState["status"];
								onChange("status", v);
								onChange(
									"statusLabel",
									v === "completed" ? "Completed" : "Under-Development",
								);
							}}
							className={selectCls}
						>
							<option value="under-development">Under Development</option>
							<option value="completed">Completed</option>
						</select>
					</EditorField>

					<EditorField label="Type Label">
						{suggestions ? (
							<SuggestInput
								listId="type-label-suggestions"
								value={state.typeLabel}
								onChange={(v) => onChange("typeLabel", v)}
								suggestions={suggestions.typeLabels}
								placeholder="e.g. Premium Residence"
								className={inputCls}
							/>
						) : (
							<input
								type="text"
								value={state.typeLabel}
								onChange={(e) => onChange("typeLabel", e.target.value)}
								placeholder="e.g. Premium Residence"
								className={inputCls}
							/>
						)}
					</EditorField>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<EditorField label="Categories">
						<div className="flex flex-wrap gap-2 pt-1">
							{(
								["residential", "hospitality"] as Array<
									"residential" | "hospitality"
								>
							).map((cat) => {
								const checked = state.categories.includes(cat);
								return (
									<label
										key={cat}
										className={cn(
											"flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
											checked
												? "border-red-600 bg-red-50 text-red-700"
												: "border-stone-200 text-stone-600 hover:bg-stone-50",
										)}
									>
										<input
											type="checkbox"
											checked={checked}
											onChange={() => {
												const next = checked
													? state.categories.filter((c) => c !== cat)
													: [...state.categories, cat];
												onChange("categories", next);
											}}
											className="sr-only"
										/>
										{cat.charAt(0).toUpperCase() + cat.slice(1)}
									</label>
								);
							})}
						</div>
					</EditorField>

					<EditorField label="Category Label">
						{suggestions ? (
							<SuggestInput
								listId="category-label-suggestions"
								value={state.categoryLabel}
								onChange={(v) => onChange("categoryLabel", v)}
								suggestions={suggestions.categoryLabels}
								placeholder="e.g. Residential"
								className={inputCls}
							/>
						) : (
							<input
								type="text"
								value={state.categoryLabel}
								onChange={(e) => onChange("categoryLabel", e.target.value)}
								placeholder="e.g. Residential"
								className={inputCls}
							/>
						)}
					</EditorField>
				</div>
			</section>

			{/* ── Description ── */}
			<section className="space-y-3">
				<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
					Description
				</h3>
				<EditorField
					label="Short Description"
					hint="Shown on project cards and in metadata. Keep under 200 characters."
					required
				>
					<textarea
						rows={3}
						value={state.description}
						onChange={(e) => onChange("description", e.target.value)}
						placeholder="Spacious 3-bedroom apartments with secure access..."
						className={inputCls}
					/>
					<p
						className={cn(
							"mt-1 text-right text-xs",
							state.description.length > 200
								? "text-red-500"
								: "text-stone-400",
						)}
					>
						{state.description.length}/200
					</p>
				</EditorField>
			</section>

			{/* ── Overview paragraphs ── */}
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
						Project Overview
					</h3>
					<button
						type="button"
						onClick={addOverview}
						className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add paragraph
					</button>
				</div>
				<p className="text-xs text-stone-500">
					Shown in the full project detail page overview section.
				</p>
				{state.overview.map((para, i) => (
					<div key={i} className="flex gap-2">
						<textarea
							rows={3}
							value={para}
							onChange={(e) => updateOverview(i, e.target.value)}
							placeholder={`Paragraph ${i + 1}...`}
							className={cn(inputCls, "flex-1")}
						/>
						{state.overview.length > 1 ? (
							<button
								type="button"
								onClick={() => removeOverview(i)}
								className="self-start rounded-lg border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:text-red-500"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						) : null}
					</div>
				))}
			</section>

			{/* ── Project facts ── */}
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
						Project Facts
					</h3>
					<button
						type="button"
						onClick={addFact}
						className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add fact
					</button>
				</div>
				<p className="text-xs text-stone-500">
					Shown in the &quot;Project Facts&quot; card on the detail page sidebar.
				</p>
				{state.facts.map((fact) => (
					<FactRow
						key={fact.id}
						fact={fact}
						onUpdate={(patch) => updateFact(fact.id, patch)}
						onRemove={() => removeFact(fact.id)}
						removable={state.facts.length > 1}
					/>
				))}
			</section>

			{/* ── Features & amenities ── */}
			<section className="space-y-3">
				<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
					Features & Amenities
				</h3>
				<AmenityPicker
					amenities={state.amenities}
					onChange={(next) => onChange("amenities", next)}
				/>
			</section>

			{/* ── Investment highlights ── */}
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
						Investment Highlights
					</h3>
					<button
						type="button"
						onClick={addHighlight}
						className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add item
					</button>
				</div>
				<p className="text-xs text-stone-500">
					Bullet points in the &quot;Investment Highlights&quot; section on the public
					page.
				</p>
				{state.investmentHighlights.length === 0 ? (
					<button
						type="button"
						onClick={addHighlight}
						className="w-full rounded-xl border border-dashed border-stone-300 py-4 text-sm text-stone-400 hover:border-red-300 hover:text-red-600"
					>
						+ Add first investment highlight
					</button>
				) : (
					state.investmentHighlights.map((item) => (
						<ChecklistRow
							key={item.id}
							item={item}
							onUpdate={(label) => updateHighlight(item.id, label)}
							onRemove={() => removeHighlight(item.id)}
							placeholder="e.g. Outright purchase available"
						/>
					))
				)}
			</section>
		</div>
	);
}