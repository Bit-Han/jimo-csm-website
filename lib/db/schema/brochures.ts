//schema/brochures

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