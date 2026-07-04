// // lib/db/schema/brochures.ts
// import {
// 	pgTable,
// 	uuid,
// 	text,
// 	timestamp,
// 	integer,
// 	boolean,
// 	index,
// } from "drizzle-orm/pg-core";
// import { brochureStatusEnum } from "./enums";
// import { profiles } from "./users";

// export const brochures = pgTable(
// 	"brochures",
// 	{
// 		id: uuid("id").primaryKey().defaultRandom(),
// 		title: text("title").notNull(),

// 		// Stored as "PDF" — extensible for future video brochures
// 		fileType: text("file_type").notNull().default("PDF"),

// 		// Link to project (nullable — could be a general brochure)
// 		projectId: uuid("project_id"),

// 		status: brochureStatusEnum("status").notNull().default("draft"),

// 		// Cloudinary URL for the actual PDF
// 		fileUrl: text("file_url").notNull(),
// 		cloudinaryPublicId: text("cloudinary_public_id").notNull(),
// 		fileSizeMb: integer("file_size_mb"),

// 		// Version number — increment on Replace
// 		version: integer("version").notNull().default(1),

// 		// If true, user must complete a form before getting the download link
// 		isGated: boolean("is_gated").notNull().default(true),

// 		// The form that gates this brochure (FK → forms.id)
// 		gateFormId: uuid("gate_form_id"),

// 		// Leads captured counter — computed by counting leads with this brochureId
// 		// We store a denormalised count here for quick dashboard display
// 		leadsCapturedCount: integer("leads_captured_count").notNull().default(0),

// 		createdBy: uuid("created_by").references(() => profiles.id, {
// 			onDelete: "set null",
// 		}),
// 		createdAt: timestamp("created_at", { withTimezone: true })
// 			.notNull()
// 			.defaultNow(),
// 		updatedAt: timestamp("updated_at", { withTimezone: true })
// 			.notNull()
// 			.defaultNow(),
// 	},
// 	(table) => ({
// 		projectIdIdx: index("brochures_project_id_idx").on(table.projectId),
// 		statusIdx: index("brochures_status_idx").on(table.status),
// 	}),
// );

// export type Brochure = typeof brochures.$inferSelect;
// export type NewBrochure = typeof brochures.$inferInsert;

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { brochureStatusEnum } from "./enums";
import { projects } from "./projects";

export const brochures = pgTable("brochures", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	cloudinaryPublicId: text("cloudinary_public_id").notNull(),
	// Cloudinary secure_url for the PDF — passed directly into email links
	fileUrl: text("file_url").notNull(),
	status: brochureStatusEnum("status").notNull().default("draft"),
	uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type BrochureRow = typeof brochures.$inferSelect;
export type NewBrochureRow = typeof brochures.$inferInsert;