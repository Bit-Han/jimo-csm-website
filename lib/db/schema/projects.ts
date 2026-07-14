import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import {
	projectCategoryEnum,
	projectChecklistKindEnum,
	projectMediaTypeEnum,
	projectStatusEnum,
	projectUnitIconEnum,
	publishStatusEnum,
} from "./enums";
import { adminUsers } from "./users";

export const projects = pgTable("projects", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	location: text("location").notNull(),
	status: projectStatusEnum("status").notNull(),
	statusLabel: text("status_label").notNull(),
	categoryLabel: text("category_label").notNull(),
	developerLabel: text("developer_label").notNull(),
	typeLabel: text("type_label").notNull(),
	description: text("description").notNull(),
	overview: text("overview").array().notNull().default([]),
	contactCtaTitle: text("contact_cta_title").notNull(),
	contactCtaDescription: text("contact_cta_description").notNull(),
	coverImageSrc: text("cover_image_src").notNull(),
	coverImageAlt: text("cover_image_alt").notNull(),
	publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	featured: boolean("featured").notNull().default(false),
    lastUpdatedByUserId: uuid("last_updated_by_user_id").references(
  () => adminUsers.id,
  { onDelete: "set null" },
	),
});

// Many-to-many: one project can be both residential and hospitality
export const projectCategories = pgTable("project_categories", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	category: projectCategoryEnum("category").notNull(),
});

// Card-level tags (e.g. "Confirm Current Price")
export const projectTags = pgTable("project_tags", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	label: text("label").notNull(),
	position: integer("position").notNull().default(0),
});

// Right-hand sidebar facts (Location, Status, Unit Types, etc.)
export const projectFacts = pgTable("project_facts", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	label: text("label").notNull(),
	value: text("value").notNull(),
	position: integer("position").notNull().default(0),
});

export const projectUnits = pgTable("project_units", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	icon: projectUnitIconEnum("icon").notNull().default("home"),
	priceLabel: text("price_label").notNull(),
	availabilityLabel: text("availability_label").notNull(),
	position: integer("position").notNull().default(0),
});

// Shared table for investment highlights and payment plan items
export const projectChecklistItems = pgTable("project_checklist_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	kind: projectChecklistKindEnum("kind").notNull(),
	label: text("label").notNull(),
	position: integer("position").notNull().default(0),
});

// icon stores a ProjectAmenityIcon string key (e.g. "camera", "shield-check")
export const projectAmenities = pgTable("project_amenities", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	label: text("label").notNull(),
	icon: text("icon").notNull(),
	position: integer("position").notNull().default(0),
});

// src and cloudinaryPublicId both stored:
// src = full Cloudinary delivery URL (used by Next/Image directly)
// cloudinaryPublicId = needed for deletion / transformation calls
export const projectMedia = pgTable("project_media", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	type: projectMediaTypeEnum("type").notNull().default("image"),
	cloudinaryPublicId: text("cloudinary_public_id").notNull(),
	src: text("src").notNull(),
	poster: text("poster"),
	alt: text("alt").notNull(),
	position: integer("position").notNull().default(0),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type ProjectFactRow = typeof projectFacts.$inferSelect;
export type ProjectUnitRow = typeof projectUnits.$inferSelect;
export type ProjectChecklistItemRow = typeof projectChecklistItems.$inferSelect;
export type ProjectAmenityRow = typeof projectAmenities.$inferSelect;
export type ProjectMediaRow = typeof projectMedia.$inferSelect;
