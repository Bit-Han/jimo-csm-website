// // lib/db/schema/forms.ts

import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { formFieldTypeEnum, formStatusEnum } from "./enums";

export const forms = pgTable("forms", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	type: text("type").notNull(),
	status: formStatusEnum("status").notNull().default("draft"),
	crmTag: text("crm_tag"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export const formFields = pgTable("form_fields", {
	id: uuid("id").defaultRandom().primaryKey(),
	formId: uuid("form_id")
		.notNull()
		.references(() => forms.id, { onDelete: "cascade" }),
	type: formFieldTypeEnum("type").notNull(),
	label: text("label").notNull(),
	placeholder: text("placeholder"),
	required: boolean("required").notNull().default(true),
	crmMapping: text("crm_mapping"),
	position: integer("position").notNull().default(0),
	// Dropdown/radio options stored as [{label: string, value: string}]
	options: jsonb("options").$type<{ label: string; value: string }[]>(),
}).enableRLS();

export type FormRow = typeof forms.$inferSelect;
export type FormFieldRow = typeof formFields.$inferSelect;
export type NewFormRow = typeof forms.$inferInsert;
export type NewFormFieldRow = typeof formFields.$inferInsert;