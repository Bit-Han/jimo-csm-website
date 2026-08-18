// // components/public/landing/DynamicFormRenderer.tsx
// "use client";

// import { useState } from "react";
// import type { PublicFormField } from "@/lib/types/landing-page";

// interface DynamicFormRendererProps {
// 	fields: PublicFormField[];
// 	onSubmit: (values: Record<string, string>) => void;
// 	submitLabel: string;
// 	submitting: boolean;
// }

// const inputCls =
// 	"w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

// export function DynamicFormRenderer({
// 	fields,
// 	onSubmit,
// 	submitLabel,
// 	submitting,
// }: DynamicFormRendererProps) {
// 	const [values, setValues] = useState<Record<string, string>>({});

// 	function set(id: string, value: string) {
// 		setValues((prev) => ({ ...prev, [id]: value }));
// 	}

// 	function handleSubmit(e: React.FormEvent) {
// 		e.preventDefault();
// 		onSubmit(values);
// 	}

// 	const visibleFields = fields.filter((f) => f.type !== "hidden");

// 	return (
// 		<form onSubmit={handleSubmit} className="space-y-3">
// 			{visibleFields.map((field) => {
// 				if (field.type === "textarea") {
// 					return (
// 						<textarea
// 							key={field.id}
// 							required={field.required}
// 							placeholder={field.placeholder ?? field.label}
// 							rows={3}
// 							value={values[field.id] ?? ""}
// 							onChange={(e) => set(field.id, e.target.value)}
// 							className={inputCls}
// 						/>
// 					);
// 				}

// 				if (field.type === "dropdown" || field.type === "budget_range") {
// 					return (
// 						<select
// 							key={field.id}
// 							required={field.required}
// 							value={values[field.id] ?? ""}
// 							onChange={(e) => set(field.id, e.target.value)}
// 							className={inputCls}
// 						>
// 							<option value="">{field.placeholder ?? field.label}</option>
// 							{(field.options ?? []).map((opt) => (
// 								<option key={opt.value} value={opt.value}>
// 									{opt.label}
// 								</option>
// 							))}
// 						</select>
// 					);
// 				}

// 				if (field.type === "radio") {
// 					return (
// 						<div key={field.id} className="space-y-1.5">
// 							<p className="text-xs font-medium text-stone-600">
// 								{field.label}
// 							</p>
// 							{(field.options ?? []).map((opt) => (
// 								<label
// 									key={opt.value}
// 									className="flex items-center gap-2 text-sm text-stone-700"
// 								>
// 									<input
// 										type="radio"
// 										name={field.id}
// 										value={opt.value}
// 										checked={values[field.id] === opt.value}
// 										onChange={(e) => set(field.id, e.target.value)}
// 										required={field.required}
// 									/>
// 									{opt.label}
// 								</label>
// 							))}
// 						</div>
// 					);
// 				}

// 				if (field.type === "consent") {
// 					return (
// 						<label
// 							key={field.id}
// 							className="flex items-start gap-2 text-xs text-stone-500"
// 						>
// 							<input
// 								type="checkbox"
// 								checked={values[field.id] === "true"}
// 								onChange={(e) => set(field.id, e.target.checked ? "true" : "")}
// 								required={field.required}
// 								className="mt-0.5"
// 							/>
// 							{field.label}
// 						</label>
// 					);
// 				}

// 				const inputType =
// 					field.type === "email"
// 						? "email"
// 						: field.type === "phone"
// 							? "tel"
// 							: "text";

// 				return (
// 					<input
// 						key={field.id}
// 						type={inputType}
// 						required={field.required}
// 						placeholder={field.placeholder ?? field.label}
// 						value={values[field.id] ?? ""}
// 						onChange={(e) => set(field.id, e.target.value)}
// 						className={inputCls}
// 					/>
// 				);
// 			})}

// 			<button
// 				type="submit"
// 				disabled={submitting}
// 				className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
// 			>
// 				{submitting ? "Submitting..." : submitLabel}
// 			</button>
// 		</form>
// 	);
// }


// components/public/landing/DynamicFormRenderer.tsx
"use client";

import { useState } from "react";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import type { PublicFormField } from "@/lib/types/landing-page";

interface DynamicFormRendererProps {
	fields: PublicFormField[];
	onSubmit: (values: Record<string, string>) => void;
	submitLabel: string;
	submitting: boolean;
}

const inputCls =
	"w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export function DynamicFormRenderer({
	fields,
	onSubmit,
	submitLabel,
	submitting,
}: DynamicFormRendererProps) {
	const [values, setValues] = useState<Record<string, string>>({});
	const [honeypot, setHoneypot] = useState("");
	const [renderedAt] = useState(() => Date.now().toString());

	function set(id: string, value: string) {
		setValues((prev) => ({ ...prev, [id]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// __hp / __ts are always sent regardless of what the admin configured
		// — see lib/utils/bot-heuristics.ts for how the server reads these.
		onSubmit({ ...values, __hp: honeypot, __ts: renderedAt });
	}

	const visibleFields = fields.filter((f) => f.type !== "hidden");

	return (
		<form onSubmit={handleSubmit} className="relative space-y-3">
			<div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
				<input
					type="text"
					name="hp"
					tabIndex={-1}
					autoComplete="off"
					value={honeypot}
					onChange={(e) => setHoneypot(e.target.value)}
				/>
			</div>

			{visibleFields.map((field) => {
				if (field.type === "textarea") {
					return (
						<textarea
							key={field.id}
							required={field.required}
							placeholder={field.placeholder ?? field.label}
							rows={3}
							value={values[field.id] ?? ""}
							onChange={(e) => set(field.id, e.target.value)}
							className={inputCls}
						/>
					);
				}

		if (field.type === "phone") {
			return (
				<PhoneNumberField
					key={field.id}
					name={field.id}
					required={field.required}
					onValueChange={(value, valid) => set(field.id, valid ? value : "")}
				/>
			);
		}

				if (field.type === "dropdown" || field.type === "budget_range") {
					return (
						<select
							key={field.id}
							required={field.required}
							value={values[field.id] ?? ""}
							onChange={(e) => set(field.id, e.target.value)}
							className={inputCls}
						>
							<option value="">{field.placeholder ?? field.label}</option>
							{(field.options ?? []).map((opt) => (
								<option key={opt.value} value={opt.value}>{opt.label}</option>
							))}
						</select>
					);
				}

				if (field.type === "radio") {
					return (
						<div key={field.id} className="space-y-1.5">
							<p className="text-xs font-medium text-stone-600">{field.label}</p>
							{(field.options ?? []).map((opt) => (
								<label key={opt.value} className="flex items-center gap-2 text-sm text-stone-700">
									<input
										type="radio"
										name={field.id}
										value={opt.value}
										checked={values[field.id] === opt.value}
										onChange={(e) => set(field.id, e.target.value)}
										required={field.required}
									/>
									{opt.label}
								</label>
							))}
						</div>
					);
				}

				if (field.type === "consent") {
					return (
						<label key={field.id} className="flex items-start gap-2 text-xs text-stone-500">
							<input
								type="checkbox"
								checked={values[field.id] === "true"}
								onChange={(e) => set(field.id, e.target.checked ? "true" : "")}
								required={field.required}
								className="mt-0.5"
							/>
							{field.label}
						</label>
					);
				}

				const inputType = field.type === "email" ? "email" : "text";

				return (
					<input
						key={field.id}
						type={inputType}
						required={field.required}
						placeholder={field.placeholder ?? field.label}
						value={values[field.id] ?? ""}
						onChange={(e) => set(field.id, e.target.value)}
						className={inputCls}
					/>
				);
			})}

			<button
				type="submit"
				disabled={submitting}
				className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
			>
				{submitting ? "Submitting..." : submitLabel}
			</button>
		</form>
	);
}