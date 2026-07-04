import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { mediaResourceTypeEnum } from "./enums";
import { projects } from "./projects";

// Mirrors every Cloudinary asset we upload.
// The CMS Media Library screen reads directly from this table.
export const mediaAssets = pgTable("media_assets", {
	id: uuid("id").defaultRandom().primaryKey(),
	cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
	url: text("url").notNull(),
	secureUrl: text("secure_url").notNull(),
	resourceType: mediaResourceTypeEnum("resource_type").notNull(),
	format: text("format").notNull(),
	width: integer("width"),
	height: integer("height"),
	sizeBytes: integer("size_bytes").notNull(),
	// Mirrors Cloudinary folder structure:
	// jimo-property/project-renders, interior-renders, construction-updates,
	// brochures, team-photos, logos-icons, documents, videos
	folder: text("folder").notNull(),
	altText: text("alt_text").notNull().default(""),
	tags: text("tags").array().notNull().default([]),
	linkedProjectId: uuid("linked_project_id").references(() => projects.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MediaAssetRow = typeof mediaAssets.$inferSelect;
export type NewMediaAssetRow = typeof mediaAssets.$inferInsert;