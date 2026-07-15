import type {
	AdminFormListRow,
	FormBuilderField,
	FormBuilderState,
} from "@/lib/types/admin/form-builder";

export interface FormFieldQueryRow {
	id: string;
	type: string;
	label: string;
	placeholder: string | null;
	required: boolean;
	crmMapping: string | null;
	position: number;
	options: { label: string; value: string }[] | null;
}

export interface FormQueryRow {
	id: string;
	title: string;
	type: string;
	status: string;
	crmTag: string | null;
	fields: FormFieldQueryRow[];
}

export function mapFormRowToListRow(row: FormQueryRow): AdminFormListRow {
	return {
		id: row.id,
		title: row.title,
		type: row.type,
		relatedLabel: `${row.fields.length} field${row.fields.length !== 1 ? "s" : ""}`,
		status: row.status as AdminFormListRow["status"],
		crmTag: row.crmTag ?? "—",
	};
}

export function mapFormRowToBuilderState(row: FormQueryRow): FormBuilderState {
	return {
		id: row.id,
		title: row.title,
		formType: row.type,
		crmTag: row.crmTag ?? "",
		fields: row.fields
			.sort((a, b) => a.position - b.position)
			.map(
				(f): FormBuilderField => ({
					id: f.id,
					type: f.type as FormBuilderField["type"],
					label: f.label,
					placeholder: f.placeholder ?? "",
					required: f.required,
					crmMapping: f.crmMapping ?? "",
					options:
						f.options?.map((opt, i) => ({
							id: `opt-${i}`,
							label: opt.label,
						})) ?? [],
					width: "full",
				}),
			),
	};
}
