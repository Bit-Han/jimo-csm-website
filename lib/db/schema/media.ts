// lib/db/schema/media.ts
import {
	pgTable,
	uuid,
	text,
	timestamp,
	integer,
	real,
	index,
} from "drizzle-orm/pg-core";
import { mediaFolderEnum, mediaUsageTagEnum } from "./enums";
import { profiles } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// media
// All media lives in Cloudinary. We store only the URL + metadata here.
// cloudinaryPublicId allows us to delete/transform the asset later.
// ─────────────────────────────────────────────────────────────────────────────
export const media = pgTable(
	"media",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		// Human readable name shown in the Media Library UI
		title: text("title").notNull(),

		// Optional link to a project (null = global/unlinked)
		projectId: uuid("project_id"),

		folder: mediaFolderEnum("folder").notNull().default("project_renders"),
		usageTag: mediaUsageTagEnum("usage_tag")
			.notNull()
			.default("project_render"),

		// ── Cloudinary ──
		cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
		cloudinaryUrl: text("cloudinary_url").notNull(),
		// Cloudinary resource type: image | video | raw (PDF, docs)
		resourceType: text("resource_type").notNull().default("image"),
		format: text("format"), // "jpg", "png", "mp4", "pdf"

		// ── Metadata ──
		altText: text("alt_text"),
		fileSizeMb: real("file_size_mb"),
		width: integer("width"),
		height: integer("height"),
		durationSeconds: real("duration_seconds"), // for videos

		// ── Audit ──
		uploadedBy: uuid("uploaded_by").references(() => profiles.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		folderIdx: index("media_folder_idx").on(table.folder),
		projectIdIdx: index("media_project_id_idx").on(table.projectId),
		cloudinaryPubIdx: index("media_cloudinary_pub_idx").on(
			table.cloudinaryPublicId,
		),
	}),
);

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
