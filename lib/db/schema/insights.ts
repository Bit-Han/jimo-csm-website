// // lib/db/schema/articles.ts
// import {
// 	pgTable,
// 	uuid,
// 	text,
// 	timestamp,
// 	integer,
// 	jsonb,
// 	index,
// } from "drizzle-orm/pg-core";
// import { articleCategoryEnum, contentStatusEnum } from "./enums";
// import { profiles } from "./users";

// export const articles = pgTable(
// 	"articles",
// 	{
// 		id: uuid("id").primaryKey().defaultRandom(),
// 		title: text("title").notNull(),
// 		slug: text("slug").notNull().unique(),
// 		category: articleCategoryEnum("category").notNull(),

// 		// Optional project this article belongs to
// 		projectId: uuid("project_id"),

// 		// TipTap stores content as JSON (ProseMirror JSON)
// 		content: jsonb("content").$type<Record<string, unknown>>(),

// 		// Plain text excerpt for previews and SEO
// 		excerpt: text("excerpt"),

// 		// Featured image (FK → media.id resolved in relations.ts)
// 		featuredImageId: uuid("featured_image_id"),
// 		featuredImageUrl: text("featured_image_url"), // denormalised for quick access

// 		status: contentStatusEnum("status").notNull().default("draft"),

// 		// SEO
// 		metaTitle: text("meta_title"),
// 		metaDescription: text("meta_description"),
// 		focusKeyword: text("focus_keyword"),
// 		internalLinksCount: integer("internal_links_count").default(0),

// 		publishedAt: timestamp("published_at", { withTimezone: true }),
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
// 		slugIdx: index("articles_slug_idx").on(table.slug),
// 		statusIdx: index("articles_status_idx").on(table.status),
// 		categoryIdx: index("articles_category_idx").on(table.category),
// 	}),
// );

// export type Article = typeof articles.$inferSelect;
// export type NewArticle = typeof articles.$inferInsert;



import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { insightCategoryEnum, publishStatusEnum } from "./enums";

export const insights = pgTable("insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: insightCategoryEnum("category").notNull(),
  categoryLabel: text("category_label").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").array().notNull().default([]),
  publishedAt: timestamp("published_at"),
  readTimeMinutes: integer("read_time_minutes").notNull().default(3),

  // Optional backlink to a project
  relatedProjectSlug: text("related_project_slug"),
  relatedProjectName: text("related_project_name"),

  // Cloudinary URL
  coverImageSrc: text("cover_image_src"),
  coverImageAlt: text("cover_image_alt").notNull().default(""),

  // SEO fields (editable in Article Editor)
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsightRow = typeof insights.$inferSelect;
export type NewInsightRow = typeof insights.$inferInsert;