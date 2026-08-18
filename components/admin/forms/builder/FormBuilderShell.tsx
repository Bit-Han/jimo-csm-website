// "use client";

// import { useState, useTransition } from "react";
// import { Check, Loader2 } from "lucide-react";
// import { AvailableFieldsList } from "./AvailableFieldsList";
// import { FormPreviewPanel } from "./FormPreviewPanel";
// import { FieldSettingsPanel } from "./FieldSettingsPanel";
// import { saveForm } from "@/lib/actions/forms";
// import type {
// 	FormBuilderField,
// 	FormBuilderSaveStatus,
// 	FormBuilderState,
// 	FormFieldType,
// } from "@/lib/types/admin/form-builder";

// function makeField(type: FormFieldType): FormBuilderField {
// 	const labelMap: Record<FormFieldType, string> = {
// 		text: "Text Field",
// 		phone: "Phone Number",
// 		email: "Email Address",
// 		dropdown: "Dropdown",
// 		radio: "Radio Button",
// 		budget_range: "Budget Range",
// 		textarea: "Message",
// 		hidden: "Hidden Field",
// 		consent: "Consent",
// 	};

// 	return {
// 		id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
// 		type,
// 		label: labelMap[type],
// 		placeholder: "",
// 		required: type !== "hidden" && type !== "consent",
// 		crmMapping: "",
// 		options: [],
// 		width: type === "textarea" || type === "hidden" ? "full" : "full",
// 	};
// }

// export interface FormBuilderShellProps {
// 	initialState: FormBuilderState;
// }

// export function FormBuilderShell({ initialState }: FormBuilderShellProps) {
// 	const [state, setState] = useState<FormBuilderState>(initialState);
// 	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
// 	const [saveStatus, setSaveStatus] = useState<FormBuilderSaveStatus>("idle");
// 	const [isPending, startTransition] = useTransition();

// 	const selectedField =
// 		state.fields.find((f) => f.id === selectedFieldId) ?? null;

// 	function addField(type: FormFieldType) {
// 		const newField = makeField(type);
// 		setState((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
// 		setSelectedFieldId(newField.id);
// 		setSaveStatus("idle");
// 	}

// 	function updateField(id: string, updates: Partial<FormBuilderField>) {
// 		setState((prev) => ({
// 			...prev,
// 			fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
// 		}));
// 		setSaveStatus("idle");
// 	}

// 	function moveField(id: string, direction: "up" | "down") {
// 		const fields = [...state.fields];
// 		const index = fields.findIndex((f) => f.id === id);
// 		if (direction === "up" && index > 0) {
// 			const temp = fields[index - 1]!;
// 			fields[index - 1] = fields[index]!;
// 			fields[index] = temp;
// 		} else if (direction === "down" && index < fields.length - 1) {
// 			const temp = fields[index + 1]!;
// 			fields[index + 1] = fields[index]!;
// 			fields[index] = temp;
// 		}
// 		setState((prev) => ({ ...prev, fields }));
// 	}

// 	function removeField(id: string) {
// 		setState((prev) => ({
// 			...prev,
// 			fields: prev.fields.filter((f) => f.id !== id),
// 		}));
// 		if (selectedFieldId === id) {
// 			setSelectedFieldId(null);
// 		}
// 		setSaveStatus("idle");
// 	}

// 	function handleSave() {
// 		setSaveStatus("saving");
// 		startTransition(async () => {
// 			const result = await saveForm(state);
// 			setSaveStatus(result.success ? "saved" : "error");
// 		});
// 	}

// 	return (
// 		<div className="flex flex-col gap-0">
// 			{/* Top bar */}
// 			<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
// 				<div>
// 					<h1 className="text-2xl font-bold tracking-tight text-ink-950">
// 						Form Builder
// 					</h1>
// 					<p className="mt-0.5 text-sm text-stone-500">
// 						{state.title} · {state.fields.length} field
// 						{state.fields.length !== 1 ? "s" : ""}
// 					</p>
// 				</div>

// 				<div className="flex items-center gap-2.5">
// 					{saveStatus === "saved" ? (
// 						<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
// 							<Check className="h-3.5 w-3.5" />
// 							Saved
// 						</span>
// 					) : saveStatus === "error" ? (
// 						<span className="text-xs text-red-500">Save failed</span>
// 					) : null}

// 					<button
// 						type="button"
// 						onClick={handleSave}
// 						disabled={isPending}
// 						className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
// 					>
// 						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
// 						Save Form
// 					</button>
// 				</div>
// 			</div>

// 			{/* Description */}
// 			<p className="mb-5 text-sm text-stone-500">
// 				Create and customise lead capture forms for projects, brochures,
// 				investors, diaspora buyers, and realtors.
// 			</p>

// 			{/* Three-panel layout */}
// 			<div className="grid h-[680px] gap-5 lg:grid-cols-[240px_1fr_280px]">
// 				<AvailableFieldsList onAdd={addField} />

// 				<FormPreviewPanel
// 					state={state}
// 					selectedFieldId={selectedFieldId}
// 					onSelectField={setSelectedFieldId}
// 					onMoveUp={(id) => moveField(id, "up")}
// 					onMoveDown={(id) => moveField(id, "down")}
// 					onRemove={removeField}
// 				/>

// 				<FieldSettingsPanel field={selectedField} onUpdate={updateField} />
// 			</div>
// 		</div>
// 	);
// }



// components/admin/forms/FormBuilderShell.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { AvailableFieldsList } from "./AvailableFieldsList";
import { FormPreviewPanel } from "./FormPreviewPanel";
import { FieldSettingsPanel } from "./FieldSettingsPanel";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import { saveForm } from "@/lib/actions/forms";
import { FORM_TYPES } from "@/lib/types/forms";
import { DEFAULT_CRM_MAPPING_BY_TYPE } from "@/lib/constants/crm-mapping";
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
		crmMapping: DEFAULT_CRM_MAPPING_BY_TYPE[type] ?? "",
		options: [],
		width: "full",
	};
}

export interface FormBuilderShellProps {
	initialState: FormBuilderState;
	mode: "new" | "edit";
}

export function FormBuilderShell({ initialState, mode }: FormBuilderShellProps) {
	const router = useRouter();
	const [state, setState] = useState<FormBuilderState>(initialState);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [saveStatus, setSaveStatus] = useState<FormBuilderSaveStatus>("idle");
	const [saveMessage, setSaveMessage] = useState("");
	const [isPending, startTransition] = useTransition();

	const selectedField = state.fields.find((f) => f.id === selectedFieldId) ?? null;
	const hasNameMapping = state.fields.some((f) => f.crmMapping === "fullName");

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
			[fields[index - 1], fields[index]] = [fields[index]!, fields[index - 1]!];
		} else if (direction === "down" && index < fields.length - 1) {
			[fields[index + 1], fields[index]] = [fields[index]!, fields[index + 1]!];
		}
		setState((prev) => ({ ...prev, fields }));
	}

	function removeField(id: string) {
		setState((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.id !== id) }));
		if (selectedFieldId === id) setSelectedFieldId(null);
		setSaveStatus("idle");
	}

	function updateMeta<K extends keyof FormBuilderState>(key: K, value: FormBuilderState[K]) {
		setState((prev) => ({ ...prev, [key]: value }));
		setSaveStatus("idle");
	}

	function handleSave() {
		if (!state.title.trim()) {
			setSaveStatus("error");
			setSaveMessage("Give this form a title before saving.");
			return;
		}
		if (!hasNameMapping) {
			setSaveStatus("error");
			setSaveMessage('Add a field mapped to "Full Name" — leads need a name to be usable.');
			return;
		}
		setSaveStatus("saving");
		setSaveMessage("");
		startTransition(async () => {
			const result = await saveForm(state);
			if (result.success) {
				setSaveStatus("saved");
				setSaveMessage("Saved.");
				if (mode === "new" && result.id) {
					router.replace(`/admin/forms/${result.id}/edit`);
				}
			} else {
				setSaveStatus("error");
				setSaveMessage(result.message);
			}
		});
	}

	return (
		<div className="flex flex-col gap-0">
			<div className="mb-5 flex flex-col gap-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-ink-950">
							{mode === "new" ? "New Form" : "Form Builder"}
						</h1>
						<p className="mt-0.5 text-sm text-stone-500">
							{state.fields.length} field{state.fields.length !== 1 ? "s" : ""}
						</p>
					</div>

					<div className="flex items-center gap-2.5">
						{saveStatus === "saved" ? (
							<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
								<Check className="h-3.5 w-3.5" />
								{saveMessage || "Saved"}
							</span>
						) : saveStatus === "error" ? (
							<span className="text-xs font-medium text-red-500">{saveMessage || "Save failed"}</span>
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

				<div className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
					<div className="sm:col-span-2">
						<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
							Form Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={state.title}
							onChange={(e) => updateMeta("title", e.target.value)}
							placeholder="e.g. Yaba Residences — Brochure Request"
							className={inputCls}
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
							Form Type
						</label>
						<select
							value={state.formType}
							onChange={(e) => updateMeta("formType", e.target.value)}
							className={selectCls}
						>
							{FORM_TYPES.map((t) => (
								<option key={t.value} value={t.value}>{t.label}</option>
							))}
						</select>
					</div>
					<div className="sm:col-span-3">
						<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
							CRM Tag <span className="font-normal normal-case text-stone-400">— optional</span>
						</label>
						<input
							type="text"
							value={state.crmTag}
							onChange={(e) => updateMeta("crmTag", e.target.value)}
							placeholder="e.g. High Intent, Diaspora"
							className={inputCls}
						/>
					</div>
				</div>

				{!hasNameMapping ? (
					<div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
						<div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
						<p className="text-xs font-medium text-stone-700">
							This form has no field mapped to <strong>Full Name</strong>. Submissions will be
							rejected until one is added.
						</p>
					</div>
				) : null}
			</div>

			<p className="mb-5 text-sm text-stone-500">
				&quot;Brochure Request&quot; as the form type automatically emails the linked project&apos;s brochure and
				sends the visitor to the thank-you page on submit. Every other type saves the lead and shows
				an inline confirmation instead.
			</p>

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