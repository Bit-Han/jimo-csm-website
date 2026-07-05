import { Plus, Trash2 } from "lucide-react";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import type {
	FormBuilderField,
	FormFieldOption,
} from "@/lib/types/admin/form-builder";

export interface FieldSettingsPanelProps {
	field: FormBuilderField | null;
	onUpdate: (id: string, updates: Partial<FormBuilderField>) => void;
}

function makeOption(): FormFieldOption {
	return { id: `opt-${Date.now()}`, label: "" };
}

export function FieldSettingsPanel({
	field,
	onUpdate,
}: FieldSettingsPanelProps) {
	if (!field) {
		return (
			<div className="flex h-full flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-5 text-center">
				<p className="text-sm font-semibold text-stone-400">Field Settings</p>
				<p className="mt-1 text-xs text-stone-400">
					Click a field in the preview to edit its settings.
				</p>
			</div>
		);
	}

	const hasOptions = field.type === "dropdown" || field.type === "radio";

	function update(updates: Partial<FormBuilderField>) {
		if (!field) return;
		onUpdate(field.id, updates);
	}

	function addOption() {
		if (!field) return;
		update({ options: [...field.options, makeOption()] });
	}

	function updateOption(id: string, label: string) {
		update({
			options: (field?.options || []).map((opt) =>
				opt.id === id ? { ...opt, label } : opt,
			),
		});
	}

	function removeOption(id: string) {
		if (!field) return;
		update({ options: field.options.filter((opt) => opt.id !== id) });
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5">
			<p className="text-sm font-bold text-ink-950">Field Settings</p>
			<p className="mt-0.5 text-xs font-semibold text-red-600">{field.label}</p>

			<div className="mt-4 flex-1 space-y-4">
				{/* Label */}
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						Label
					</label>
					<input
						type="text"
						value={field.label}
						onChange={(e) => update({ label: e.target.value })}
						className={inputCls}
					/>
				</div>

				{/* Field Type (read-only) */}
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						Field Type
					</label>
					<input
						type="text"
						value={field.type
							.replace(/_/g, " ")
							.replace(/\b\w/g, (c) => c.toUpperCase())}
						readOnly
						className={`${inputCls} cursor-not-allowed`}
					/>
				</div>

				{/* Placeholder */}
				{field.type !== "hidden" && field.type !== "consent" ? (
					<div>
						<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
							Placeholder
						</label>
						<input
							type="text"
							value={field.placeholder}
							onChange={(e) => update({ placeholder: e.target.value })}
							className={inputCls}
						/>
					</div>
				) : null}

				{/* Width */}
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						Width
					</label>
					<select
						value={field.width}
						onChange={(e) =>
							update({
								width: e.target.value as FormBuilderField["width"],
							})
						}
						className={selectCls}
					>
						<option value="full">Full width</option>
						<option value="half">Half width (pair)</option>
					</select>
				</div>

				{/* Required */}
				<label className="flex cursor-pointer items-center gap-2.5">
					<input
						type="checkbox"
						checked={field.required}
						onChange={(e) => update({ required: e.target.checked })}
						className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
					/>
					<span className="text-sm font-medium text-ink-950">
						Required field
					</span>
				</label>

				{/* CRM Mapping */}
				<div>
					<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
						CRM Mapping
					</label>
					<input
						type="text"
						value={field.crmMapping}
						onChange={(e) => update({ crmMapping: e.target.value })}
						placeholder="e.g. lead.full_name"
						className={inputCls}
					/>
				</div>

				{/* Options (dropdown / radio) */}
				{hasOptions ? (
					<div>
						<div className="mb-2 flex items-center justify-between">
							<label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
								Options
							</label>
							<button
								type="button"
								onClick={addOption}
								className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Option
							</button>
						</div>
						<div className="space-y-2">
							{field.options.map((option) => (
								<div key={option.id} className="flex items-center gap-2">
									<span className="text-stone-300">⠿</span>
									<input
										type="text"
										value={option.label}
										onChange={(e) => updateOption(option.id, e.target.value)}
										placeholder="Option label"
										className={`${inputCls} flex-1`}
									/>
									<button
										type="button"
										onClick={() => removeOption(option.id)}
										className="shrink-0 text-stone-400 hover:text-red-500"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							))}
							{field.options.length === 0 ? (
								<p className="text-xs text-stone-400">No options yet.</p>
							) : null}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
