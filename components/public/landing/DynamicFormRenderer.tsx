// components/public/landing/DynamicFormRenderer.tsx
"use client";

import { useState } from "react";
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

	function set(id: string, value: string) {
		setValues((prev) => ({ ...prev, [id]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSubmit(values);
	}

	const visibleFields = fields.filter((f) => f.type !== "hidden");

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
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
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					);
				}

				if (field.type === "radio") {
					return (
						<div key={field.id} className="space-y-1.5">
							<p className="text-xs font-medium text-stone-600">
								{field.label}
							</p>
							{(field.options ?? []).map((opt) => (
								<label
									key={opt.value}
									className="flex items-center gap-2 text-sm text-stone-700"
								>
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
						<label
							key={field.id}
							className="flex items-start gap-2 text-xs text-stone-500"
						>
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

				const inputType =
					field.type === "email"
						? "email"
						: field.type === "phone"
							? "tel"
							: "text";

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
