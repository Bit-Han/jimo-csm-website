// //@lib/db/schema/insights
// import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
// import { insightCategoryEnum, publishStatusEnum } from "./enums";

// export const insights = pgTable("insights", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   slug: text("slug").notNull().unique(),
//   title: text("title").notNull(),
//   category: insightCategoryEnum("category").notNull(),
//   categoryLabel: text("category_label").notNull(),
//   excerpt: text("excerpt").notNull(),
//   body: text("body").array().notNull().default([]),
//   publishedAt: timestamp("published_at"),
//   readTimeMinutes: integer("read_time_minutes").notNull().default(3),

//   // Optional backlink to a project
//   relatedProjectSlug: text("related_project_slug"),
//   relatedProjectName: text("related_project_name"),

//   // Cloudinary URL
//   coverImageSrc: text("cover_image_src"),
//   coverImageAlt: text("cover_image_alt").notNull().default(""),

//   // SEO fields (editable in Article Editor)
//   seoTitle: text("seo_title"),
//   seoDescription: text("seo_description"),

//   publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

// export type InsightRow = typeof insights.$inferSelect;
// export type NewInsightRow = typeof insights.$inferInsert;

import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { publishStatusEnum } from "./enums";
import { adminUsers } from "./users";
import type { InsightBodyBlock } from "@/lib/types/insight";

export const insights = pgTable("insights", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),

	// Free text, validated against insight_categories.value at the app
	// layer rather than a Postgres enum — lets admins add categories from
	// the editor without a schema migration. No FK either: if a category is
	// later deleted, existing articles just keep the orphaned label rather
	// than breaking.
	category: text("category").notNull(),
	categoryLabel: text("category_label").notNull(),

	excerpt: text("excerpt").notNull(),
	body: jsonb("body").$type<InsightBodyBlock[]>().notNull().default([]),
	publishedAt: timestamp("published_at"),
	readTimeMinutes: integer("read_time_minutes").notNull().default(3),

	relatedProjectSlug: text("related_project_slug"),
	relatedProjectName: text("related_project_name"),

	coverImageSrc: text("cover_image_src"),
	coverImageAlt: text("cover_image_alt").notNull().default(""),

	// Author is snapshotted (name + avatar copied) at save time, so public
	// reads never need to join admin_users, and a published article keeps
	// showing the byline it went live with even if that admin later changes
	// their name/photo or is deactivated. authorId stays for reassignment.
	authorId: uuid("author_id").references(() => adminUsers.id, {
		onDelete: "set null",
	}),
	authorName: text("author_name").notNull().default(""),
	authorAvatarUrl: text("author_avatar_url"),

	seoTitle: text("seo_title"),
	seoDescription: text("seo_description"),

	publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsightRow = typeof insights.$inferSelect;
export type NewInsightRow = typeof insights.$inferInsert;