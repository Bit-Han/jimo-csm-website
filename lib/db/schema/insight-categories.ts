import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const insightCategories = pgTable("insight_categories", {
	id: uuid("id").defaultRandom().primaryKey(),
	value: text("value").notNull().unique(),
	label: text("label").notNull(),
	position: integer("position").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsightCategoryRow = typeof insightCategories.$inferSelect;
export type NewInsightCategoryRow = typeof insightCategories.$inferInsert;
