// lib/db/schema/forms.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	boolean,
	jsonb,
	index,
} from "drizzle-orm/pg-core";
import { formTypeEnum, formStatusEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// FormField — the shape of each item inside forms.fields JSONB array
// TypeScript type only (not a DB table)
// ─────────────────────────────────────────────────────────────────────────────
export type FormField = {
	id: string; // local unique ID e.g. "field_001"
	type:
		| "text"
		| "phone"
		| "email"
		| "dropdown"
		| "radio"
		| "budget_range"
		| "textarea"
		| "hidden"
		| "consent"
		| "country"
		| "checkbox";
	label: string; // "Full Name"
	placeholder?: string;
	required: boolean;
	crmMapping?: string; // "lead.full_name", "lead.interested_unit"
	options?: string[]; // for dropdown / radio
	orderIndex: number;
	defaultValue?: string;
	hiddenValue?: string; // for hidden fields (e.g. project slug)
	validationPattern?: string; // regex
};

// ─────────────────────────────────────────────────────────────────────────────
// forms
// Reusable form definitions. The `fields` JSONB column stores the ordered
// array of FormField objects configured in the Form Builder UI.
// ─────────────────────────────────────────────────────────────────────────────
export const forms = pgTable(
	"forms",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		type: formTypeEnum("type").notNull().default("project_enquiry"),

		// CRM mapping label shown in the UI (e.g. "Project Lead", "Brochure Lead")
		crmMappingLabel: text("crm_mapping_label"),
		status: formStatusEnum("status").notNull().default("active"),

		// Ordered array of field configs (see FormField type above)
		fields: jsonb("fields").$type<FormField[]>().notNull().default([]),

		// Post-submit behaviour
		successMessage: text("success_message").default(
			"Thank you! We will be in touch shortly.",
		),
		redirectUrl: text("redirect_url"),

		// HubSpot — optional mirror form
		hubspotFormId: text("hubspot_form_id"),

		// Auto-send brochure on submission (for brochure download forms)
		autoSendBrochure: boolean("auto_send_brochure").notNull().default(false),
		brochureId: uuid("brochure_id"), // FK → brochures.id (resolved in relations)

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		typeIdx: index("forms_type_idx").on(table.type),
		statusIdx: index("forms_status_idx").on(table.status),
	}),
);

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
