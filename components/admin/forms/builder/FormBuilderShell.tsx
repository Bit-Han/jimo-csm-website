"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { AvailableFieldsList } from "./AvailableFieldsList";
import { FormPreviewPanel } from "./FormPreviewPanel";
import { FieldSettingsPanel } from "./FieldSettingsPanel";
import { saveForm } from "@/lib/actions/forms";
import type {
	FormBuilderField,
	FormBuilderSaveStatus,
	FormBuilderState,
	FormFieldType,
} from "@/lib/types/admin/form-builder";

function makeField(type: FormFieldType): FormBuilderField {
	const labelMap: Record<FormFieldType, string> = {
		text: "Text Field",
		phone: "Phone Number",
		email: "Email Address",
		dropdown: "Dropdown",
		radio: "Radio Button",
		budget_range: "Budget Range",
		textarea: "Message",
		hidden: "Hidden Field",
		consent: "Consent",
	};

	return {
		id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		type,
		label: labelMap[type],
		placeholder: "",
		required: type !== "hidden" && type !== "consent",
		crmMapping: "",
		options: [],
		width: type === "textarea" || type === "hidden" ? "full" : "full",
	};
}

export interface FormBuilderShellProps {
	initialState: FormBuilderState;
}

export function FormBuilderShell({ initialState }: FormBuilderShellProps) {
	const [state, setState] = useState<FormBuilderState>(initialState);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [saveStatus, setSaveStatus] = useState<FormBuilderSaveStatus>("idle");
	const [isPending, startTransition] = useTransition();

	const selectedField =
		state.fields.find((f) => f.id === selectedFieldId) ?? null;

	function addField(type: FormFieldType) {
		const newField = makeField(type);
		setState((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
		setSelectedFieldId(newField.id);
		setSaveStatus("idle");
	}

	function updateField(id: string, updates: Partial<FormBuilderField>) {
		setState((prev) => ({
			...prev,
			fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
		}));
		setSaveStatus("idle");
	}

	function moveField(id: string, direction: "up" | "down") {
		const fields = [...state.fields];
		const index = fields.findIndex((f) => f.id === id);
		if (direction === "up" && index > 0) {
			const temp = fields[index - 1]!;
			fields[index - 1] = fields[index]!;
			fields[index] = temp;
		} else if (direction === "down" && index < fields.length - 1) {
			const temp = fields[index + 1]!;
			fields[index + 1] = fields[index]!;
			fields[index] = temp;
		}
		setState((prev) => ({ ...prev, fields }));
	}

	function removeField(id: string) {
		setState((prev) => ({
			...prev,
			fields: prev.fields.filter((f) => f.id !== id),
		}));
		if (selectedFieldId === id) {
			setSelectedFieldId(null);
		}
		setSaveStatus("idle");
	}

	function handleSave() {
		setSaveStatus("saving");
		startTransition(async () => {
			const result = await saveForm(state);
			setSaveStatus(result.success ? "saved" : "error");
		});
	}

	return (
		<div className="flex flex-col gap-0">
			{/* Top bar */}
			<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-ink-950">
						Form Builder
					</h1>
					<p className="mt-0.5 text-sm text-stone-500">
						{state.title} · {state.fields.length} field
						{state.fields.length !== 1 ? "s" : ""}
					</p>
				</div>

				<div className="flex items-center gap-2.5">
					{saveStatus === "saved" ? (
						<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
							<Check className="h-3.5 w-3.5" />
							Saved
						</span>
					) : saveStatus === "error" ? (
						<span className="text-xs text-red-500">Save failed</span>
					) : null}

					<button
						type="button"
						onClick={handleSave}
						disabled={isPending}
						className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
					>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
						Save Form
					</button>
				</div>
			</div>

			{/* Description */}
			<p className="mb-5 text-sm text-stone-500">
				Create and customise lead capture forms for projects, brochures,
				investors, diaspora buyers, and realtors.
			</p>

			{/* Three-panel layout */}
			<div className="grid h-[680px] gap-5 lg:grid-cols-[240px_1fr_280px]">
				<AvailableFieldsList onAdd={addField} />

				<FormPreviewPanel
					state={state}
					selectedFieldId={selectedFieldId}
					onSelectField={setSelectedFieldId}
					onMoveUp={(id) => moveField(id, "up")}
					onMoveDown={(id) => moveField(id, "down")}
					onRemove={removeField}
				/>

				<FieldSettingsPanel field={selectedField} onUpdate={updateField} />
			</div>
		</div>
	);
}
