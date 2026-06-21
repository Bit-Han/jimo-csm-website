// components/public/form-field-input.tsx
"use client";
import type { FormField } from "@/lib/types";

export function FormFieldInput({
	field,
	value,
	onChange,
}: {
	field: FormField;
	value: string;
	onChange: (v: string) => void;
}) {
	const baseClasses =
		"w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition";

	switch (field.type) {
		case "textarea":
			return (
				<textarea
					required={field.required}
					placeholder={field.placeholder ?? field.label}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					rows={4}
					className={`${baseClasses} resize-none`}
				/>
			);
		case "dropdown":
			return (
				<select
					required={field.required}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={baseClasses}
				>
					<option value="">
						{field.placeholder ?? `Select ${field.label}`}
					</option>
					{field.options?.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			);
		case "radio":
			return (
				<div>
					<p className="text-sm font-medium text-gray-700 mb-2">
						{field.label}
						{field.required && " *"}
					</p>
					<div className="flex flex-wrap gap-3">
						{field.options?.map((opt) => (
							<label
								key={opt}
								className="flex items-center gap-2 text-sm text-gray-600"
							>
								<input
									type="radio"
									name={field.id}
									value={opt}
									checked={value === opt}
									onChange={() => onChange(opt)}
									required={field.required}
								/>
								{opt}
							</label>
						))}
					</div>
				</div>
			);
		case "consent":
			return (
				<label className="flex items-start gap-2 text-xs text-gray-500">
					<input
						type="checkbox"
						required={field.required}
						checked={value === "true"}
						onChange={(e) => onChange(e.target.checked ? "true" : "")}
						className="mt-0.5"
					/>
					{field.label}
				</label>
			);
		case "phone":
			return (
				<input
					type="tel"
					required={field.required}
					placeholder={field.placeholder ?? "Phone Number"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={baseClasses}
				/>
			);
		case "email":
			return (
				<input
					type="email"
					required={field.required}
					placeholder={field.placeholder ?? "Email Address"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={baseClasses}
				/>
			);
		case "hidden":
			return null;
		default:
			return (
				<input
					type="text"
					required={field.required}
					placeholder={field.placeholder ?? field.label}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={baseClasses}
				/>
			);
	}
}
