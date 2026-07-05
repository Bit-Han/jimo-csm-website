import { GripVertical } from "lucide-react";
import { AVAILABLE_FIELD_TYPES } from "@/lib/types/admin/form-builder";
import type { FormFieldType } from "@/lib/types/admin/form-builder";

export interface AvailableFieldsListProps {
	onAdd: (type: FormFieldType) => void;
}

export function AvailableFieldsList({ onAdd }: AvailableFieldsListProps) {
	return (
		<div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5">
			<p className="text-sm font-bold text-ink-950">Add Fields</p>
			<p className="mt-0.5 text-xs text-stone-500">
				Click a field type to add it to your form.
			</p>

			<div className="mt-4 flex-1 space-y-2 overflow-y-auto">
				{AVAILABLE_FIELD_TYPES.map((fieldType) => (
					<button
						key={fieldType.type}
						type="button"
						onClick={() => onAdd(fieldType.type)}
						className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
					>
						<GripVertical className="h-4 w-4 shrink-0 text-stone-300" />
						<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white text-xs font-bold text-stone-600 shadow-sm">
							{fieldType.shortCode}
						</span>
						<span className="font-medium text-ink-950">{fieldType.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}
