import { Building2, GripVertical, Home, Plus, Trash2 } from "lucide-react";
import { EditorField, inputCls } from "@/components/admin/ui/EditorField";
import { cn } from "@/lib/utils/helpers";
import type {
	EditorUnit,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";

interface UnitsTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

function generateUnitId() {
	return `unit-${Date.now()}`;
}

export function UnitsAndPricingTab({ state, onChange }: UnitsTabProps) {
	function addUnit() {
		const newUnit: EditorUnit = {
			id: generateUnitId(),
			name: "New Unit Type",
			icon: "home",
			priceLabel: "",
			availabilityLabel: "",
			ctaLabel: "Enquire",
			ctaHref: "",
		};
		onChange("units", [...state.units, newUnit]);
	}

	function updateUnit(id: string, field: keyof EditorUnit, value: string) {
		onChange(
			"units",
			state.units.map((u) => (u.id === id ? { ...u, [field]: value } : u)),
		);
	}

	function removeUnit(id: string) {
		onChange(
			"units",
			state.units.filter((u) => u.id !== id),
		);
	}

	function duplicateUnit(id: string) {
		const unit = state.units.find((u) => u.id === id);
		if (!unit) return;
		const dupe: EditorUnit = {
			...unit,
			id: generateUnitId(),
			name: `${unit.name} (Copy)`,
		};
		onChange("units", [...state.units, dupe]);
	}

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
					Section Header
				</p>
				<div className="mt-4 space-y-3">
					<EditorField label="Eyebrow">
						<input
							type="text"
							value={state.unitsSectionEyebrow}
							onChange={(e) => onChange("unitsSectionEyebrow", e.target.value)}
							className={inputCls}
						/>
					</EditorField>
					<EditorField label="Heading">
						<input
							type="text"
							value={state.unitsSectionHeading}
							onChange={(e) => onChange("unitsSectionHeading", e.target.value)}
							className={inputCls}
						/>
					</EditorField>
					<EditorField label="Description">
						<input
							type="text"
							value={state.unitsSectionDescription}
							onChange={(e) =>
								onChange("unitsSectionDescription", e.target.value)
							}
							className={inputCls}
						/>
					</EditorField>
				</div>
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold text-ink-950">
							Units & Pricing
						</p>
						<p className="text-xs text-stone-500">
							Manage available unit types, pricing and calls-to-action.
						</p>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
						>
							Reorder Units
						</button>
						<button
							type="button"
							onClick={addUnit}
							className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Unit
						</button>
					</div>
				</div>

				{state.units.length === 0 ? (
					<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
						<p className="text-sm text-stone-500">No units added yet.</p>
						<button
							type="button"
							onClick={addUnit}
							className="text-sm font-medium text-red-600 hover:text-red-700"
						>
							+ Add your first unit
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{state.units.map((unit) => {
							const Icon = unit.icon === "building" ? Building2 : Home;
							return (
								<div
									key={unit.id}
									className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
								>
									<div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-5 py-3">
										<div className="flex items-center gap-3">
											<GripVertical className="h-4 w-4 cursor-grab text-stone-300" />
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100">
												<Icon className="h-5 w-5 text-stone-500" />
											</div>
											<span className="text-sm font-semibold text-ink-950">
												{unit.name}
											</span>
											<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
												Active
											</span>
										</div>
										<div className="flex items-center gap-3 text-xs font-medium">
											<button
												type="button"
												onClick={() => duplicateUnit(unit.id)}
												className="text-stone-500 hover:text-ink-950"
											>
												Duplicate
											</button>
											<button
												type="button"
												className={cn("text-stone-500 hover:text-ink-950")}
											>
												Preview
											</button>
											<button
												type="button"
												onClick={() => removeUnit(unit.id)}
												className="flex items-center gap-1 text-red-500 hover:text-red-700"
											>
												<Trash2 className="h-3.5 w-3.5" />
												Remove
											</button>
										</div>
									</div>

									<div className="grid gap-3 p-5 sm:grid-cols-2">
										<EditorField label="Unit Name">
											<input
												type="text"
												value={unit.name}
												onChange={(e) =>
													updateUnit(unit.id, "name", e.target.value)
												}
												className={inputCls}
											/>
										</EditorField>
										<EditorField label="Icon">
											<select
												value={unit.icon}
												onChange={(e) =>
													updateUnit(unit.id, "icon", e.target.value)
												}
												className={inputCls}
											>
												<option value="home">Home</option>
												<option value="building">Building</option>
											</select>
										</EditorField>
										<EditorField label="Price Label">
											<input
												type="text"
												value={unit.priceLabel}
												onChange={(e) =>
													updateUnit(unit.id, "priceLabel", e.target.value)
												}
												placeholder="e.g. From ₦65,000,000"
												className={inputCls}
											/>
										</EditorField>
										<EditorField label="Availability Label">
											<input
												type="text"
												value={unit.availabilityLabel}
												onChange={(e) =>
													updateUnit(
														unit.id,
														"availabilityLabel",
														e.target.value,
													)
												}
												placeholder="e.g. 10 Available"
												className={inputCls}
											/>
										</EditorField>
										<EditorField label="CTA Label">
											<input
												type="text"
												value={unit.ctaLabel}
												onChange={(e) =>
													updateUnit(unit.id, "ctaLabel", e.target.value)
												}
												placeholder="e.g. Enquire About Studio"
												className={inputCls}
											/>
										</EditorField>
										<EditorField
											label="CTA Link"
											hint="Relative URL, e.g. /contact?unit=studio"
										>
											<input
												type="text"
												value={unit.ctaHref}
												onChange={(e) =>
													updateUnit(unit.id, "ctaHref", e.target.value)
												}
												placeholder="/contact?unit=..."
												className={inputCls}
											/>
										</EditorField>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
