import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type {
	FormBuilderField,
	FormBuilderState,
} from "@/lib/types/admin/form-builder";

export interface FormPreviewPanelProps {
	state: FormBuilderState;
	selectedFieldId: string | null;
	onSelectField: (id: string) => void;
	onMoveUp: (id: string) => void;
	onMoveDown: (id: string) => void;
	onRemove: (id: string) => void;
}

function FieldPlaceholder({ field }: { field: FormBuilderField }) {
	const base =
		"w-full rounded-lg border border-stone-200 bg-cream-50 px-3 py-2 text-sm text-stone-400 pointer-events-none";

	if (field.type === "textarea") {
		return <div className={cn(base, "h-20")} />;
	}

	if (field.type === "consent") {
		return (
			<div className="flex items-center gap-2 text-xs text-stone-400">
				<div className="h-4 w-4 shrink-0 rounded border border-stone-300 bg-cream-50" />
				<span>{field.placeholder || "I agree to the terms"}</span>
			</div>
		);
	}

	if (field.type === "hidden") {
		return (
			<div className="flex h-8 items-center rounded-lg border border-dashed border-stone-200 bg-stone-50 px-3">
				<span className="text-xs text-stone-400">
					Hidden field: {field.crmMapping || "not mapped"}
				</span>
			</div>
		);
	}

	return <div className={base}>{field.placeholder}</div>;
}

export function FormPreviewPanel({
	state,
	selectedFieldId,
	onSelectField,
	onMoveUp,
	onMoveDown,
	onRemove,
}: FormPreviewPanelProps) {
	// Group consecutive half-width fields into pairs for layout
	type Row =
		| { type: "full"; field: FormBuilderField }
		| { type: "pair"; fields: [FormBuilderField, FormBuilderField] }
		| { type: "half-solo"; field: FormBuilderField };

	const rows: Row[] = [];
	let i = 0;

	while (i < state.fields.length) {
		const field = state.fields[i]!;
		if (field.width === "half") {
			const next = state.fields[i + 1];
			if (next?.width === "half") {
				rows.push({ type: "pair", fields: [field, next] });
				i += 2;
				continue;
			}
			rows.push({ type: "half-solo", field });
		} else {
			rows.push({ type: "full", field });
		}
		i++;
	}

	function FieldWrapper({
		field,
		colSpan = "full",
	}: {
		field: FormBuilderField;
		colSpan?: "full" | "half";
	}) {
		const isSelected = field.id === selectedFieldId;
		const fieldIndex = state.fields.findIndex((f) => f.id === field.id);

		return (
			<div
				role="button"
				tabIndex={0}
				onClick={() => onSelectField(field.id)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onSelectField(field.id);
					}
				}}
				className={cn(
					"group relative cursor-pointer rounded-xl border-2 p-3 transition-colors",
					colSpan === "half" ? "flex-1" : "w-full",
					isSelected
						? "border-red-400 bg-red-50/40"
						: "border-transparent hover:border-stone-200",
				)}
			>
				<label className="mb-1.5 block text-xs font-medium text-stone-700">
					{field.label}
					{field.required ? <span className="ml-1 text-red-500">*</span> : null}
				</label>
				<FieldPlaceholder field={field} />

				{/* Hover controls */}
				<div
					className={cn(
						"absolute -right-2 -top-2 flex items-center gap-1 transition-opacity",
						isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
					)}
				>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onMoveUp(field.id);
						}}
						disabled={fieldIndex === 0}
						aria-label="Move field up"
						className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:bg-stone-50 disabled:opacity-30"
					>
						<ArrowUp className="h-3 w-3" />
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onMoveDown(field.id);
						}}
						disabled={fieldIndex === state.fields.length - 1}
						aria-label="Move field down"
						className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:bg-stone-50 disabled:opacity-30"
					>
						<ArrowDown className="h-3 w-3" />
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onRemove(field.id);
						}}
						aria-label="Remove field"
						className="flex h-6 w-6 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 shadow-sm hover:bg-red-50"
					>
						<Trash2 className="h-3 w-3" />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5">
			<p className="text-sm font-bold text-ink-950">Form Preview</p>

			<div className="mt-4 flex-1 overflow-y-auto rounded-2xl border border-stone-200 bg-cream-50 p-5">
				<p className="text-center text-xs font-semibold text-red-600">
					{state.title}
				</p>
				<h3 className="mt-1 text-center text-xl font-bold text-ink-950">
					Register Your Interest
				</h3>
				<div className="mt-1 mx-auto h-0.5 w-8 rounded bg-red-600" />

				{state.fields.length === 0 ? (
					<div className="mt-10 flex flex-col items-center gap-2 text-center">
						<p className="text-sm text-stone-400">
							No fields yet. Click a field type on the left to add it.
						</p>
					</div>
				) : (
					<div className="mt-5 space-y-3">
						{rows.map((row, rowIndex) => {
							if (row.type === "pair") {
								return (
									<div key={`row-${rowIndex}`} className="flex gap-3">
										<FieldWrapper field={row.fields[0]} colSpan="half" />
										<FieldWrapper field={row.fields[1]} colSpan="half" />
									</div>
								);
							}
							if (row.type === "half-solo") {
								return (
									<div key={`row-${rowIndex}`} className="flex gap-3">
										<FieldWrapper field={row.field} colSpan="half" />
									</div>
								);
							}
							return (
								<FieldWrapper
									key={`row-${rowIndex}`}
									field={row.field}
									colSpan="full"
								/>
							);
						})}
					</div>
				)}

				{state.fields.length > 0 ? (
					<div className="mt-5">
						<div className="w-full rounded-xl bg-ink-950 py-3 text-center text-sm font-semibold text-white">
							Submit Enquiry
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
