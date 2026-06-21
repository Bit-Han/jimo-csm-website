// // lib/db/schema/projects.ts
// import {
// 	pgTable,
// 	uuid,
// 	text,
// 	timestamp,
// 	integer,
// 	boolean,
// 	jsonb,
// 	bigint,
// 	index,
// } from "drizzle-orm/pg-core";
// import { projectStatusEnum, projectTypeEnum, unitStatusEnum } from "./enums";
// import { profiles } from "./users";

// // ─────────────────────────────────────────────────────────────────────────────
// // projects
// // Core entity. One project = one real estate development (Jimo Residences, etc.)
// // ─────────────────────────────────────────────────────────────────────────────
// export const projects = pgTable(
// 	"projects",
// 	{
// 		id: uuid("id").primaryKey().defaultRandom(),
// 		name: text("name").notNull(),
// 		slug: text("slug").notNull().unique(),
// 		location: text("location").notNull(), // "Yaba, Lagos Mainland"
// 		locationArea: text("location_area").notNull(), // "Yaba" (used for filters)
// 		status: projectStatusEnum("status").notNull().default("draft"),
// 		type: projectTypeEnum("type").notNull().default("residential"),

// 		// ── Content ──
// 		description: text("description"),
// 		heroHeadline: text("hero_headline"),
// 		heroSubtext: text("hero_subtext"),
// 		heroImageUrl: text("hero_image_url"),
// 		videoUrl: text("video_url"),

// 		// ── Pricing ── (stored in kobo/smallest unit to avoid decimal issues)
// 		// Display as Naira in the UI by dividing by 100
// 		startingPriceKobo: bigint("starting_price_kobo", { mode: "number" }),

// 		// ── Project details ──
// 		deliveryTimeline: text("delivery_timeline"),
// 		constructionStatus: text("construction_status"),
// 		totalUnits: integer("total_units").default(0),
// 		availableUnits: integer("available_units").default(0),

// 		// ── JSONB arrays — stored as structured data ──
// 		investmentHighlights: jsonb("investment_highlights")
// 			.$type<string[]>()
// 			.default([]),
// 		locationAdvantages: jsonb("location_advantages")
// 			.$type<string[]>()
// 			.default([]),
// 		featuresAmenities: jsonb("features_amenities")
// 			.$type<string[]>()
// 			.default([]),

// 		// ── Payment plan (optional structured data) ──
// 		paymentPlanDetails: jsonb("payment_plan_details").$type<{
// 			description: string;
// 			milestones: Array<{ label: string; percentageValue: number }>;
// 		} | null>(),

// 		// ── Contact ──
// 		whatsappNumber: text("whatsapp_number"),
// 		callNumber: text("call_number"),

// 		// ── SEO ──
// 		metaTitle: text("meta_title"),
// 		metaDescription: text("meta_description"),
// 		focusKeyword: text("focus_keyword"),
// 		schemaMarkup: jsonb("schema_markup"),

// 		// ── HubSpot ──
// 		hubspotDealId: text("hubspot_deal_id"),

// 		// ── Flags ──
// 		isFeatured: boolean("is_featured").notNull().default(false),

// 		// ── Audit ──
// 		createdBy: uuid("created_by").references(() => profiles.id, {
// 			onDelete: "set null",
// 		}),
// 		lastEditedBy: uuid("last_edited_by").references(() => profiles.id, {
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
// 		slugIdx: index("projects_slug_idx").on(table.slug),
// 		statusIdx: index("projects_status_idx").on(table.status),
// 		locationAreaIdx: index("projects_location_area_idx").on(table.locationArea),
// 	}),
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // project_units
// // Each project has multiple unit types (Studio, 1-Bed, Penthouse, etc.)
// // ─────────────────────────────────────────────────────────────────────────────
// export const projectUnits = pgTable(
// 	"project_units",
// 	{
// 		id: uuid("id").primaryKey().defaultRandom(),
// 		projectId: uuid("project_id")
// 			.notNull()
// 			.references(() => projects.id, { onDelete: "cascade" }),
// 		name: text("name").notNull(), // "Studio Apartment", "1-Bedroom Apartment"
// 		status: unitStatusEnum("status").notNull().default("active"),
// 		totalUnits: integer("total_units").notNull().default(0),
// 		availableUnits: integer("available_units").notNull().default(0),
// 		launchPriceKobo: bigint("launch_price_kobo", { mode: "number" }),
// 		currentPriceKobo: bigint("current_price_kobo", { mode: "number" }),
// 		ctaLabel: text("cta_label"), // "Enquire About Studio"
// 		ctaLink: text("cta_link"), // "/enquiry?unit=studio"
// 		imageUrl: text("image_url"),
// 		description: text("description"),
// 		orderIndex: integer("order_index").notNull().default(0),
// 		createdAt: timestamp("created_at", { withTimezone: true })
// 			.notNull()
// 			.defaultNow(),
// 		updatedAt: timestamp("updated_at", { withTimezone: true })
// 			.notNull()
// 			.defaultNow(),
// 	},
// 	(table) => ({
// 		projectIdIdx: index("project_units_project_id_idx").on(table.projectId),
// 	}),
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // project_gallery
// // Join table: project ↔ media items, ordered for display
// // ─────────────────────────────────────────────────────────────────────────────
// export const projectGallery = pgTable(
// 	"project_gallery",
// 	{
// 		id: uuid("id").primaryKey().defaultRandom(),
// 		projectId: uuid("project_id")
// 			.notNull()
// 			.references(() => projects.id, { onDelete: "cascade" }),
// 		// mediaId references media table (defined in media.ts).
// 		// We use a plain uuid column to avoid a circular import — the relation
// 		// is declared in lib/db/relations.ts
// 		mediaId: uuid("media_id").notNull(),
// 		orderIndex: integer("order_index").notNull().default(0),
// 		createdAt: timestamp("created_at", { withTimezone: true })
// 			.notNull()
// 			.defaultNow(),
// 	},
// 	(table) => ({
// 		projectIdIdx: index("project_gallery_project_id_idx").on(table.projectId),
// 	}),
// );

// export type Project = typeof projects.$inferSelect;
// export type NewProject = typeof projects.$inferInsert;
// export type ProjectUnit = typeof projectUnits.$inferSelect;
// export type NewProjectUnit = typeof projectUnits.$inferInsert;
// export type ProjectGalleryItem = typeof projectGallery.$inferSelect;




// lib/db/schema/projects.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import {
  projectStatusEnum,
  projectTypeEnum,
  unitStatusEnum,
  listingTypeEnum,
  constructionStatusEnum,
} from "./enums";
import { profiles } from "./users";

// ─────────────────────────────────────────────────────────────────────────────
// projects
// Core entity. One project = one real estate development (Jimo Residences, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    location: text("location").notNull(), // "Yaba, Lagos Mainland"
    locationArea: text("location_area").notNull(), // "Yaba" (used for filters)
    status: projectStatusEnum("status").notNull().default("draft"),
    type: projectTypeEnum("type").notNull().default("residential"),
    listingType: listingTypeEnum("listing_type").notNull().default("for_sale"),

    // ── Content ──
    description: text("description"),
    heroHeadline: text("hero_headline"),
    heroSubtext: text("hero_subtext"),
    heroImageUrl: text("hero_image_url"),
    videoUrl: text("video_url"),

    // ── Pricing ── (stored in kobo/smallest unit to avoid decimal issues)
    startingPriceKobo: bigint("starting_price_kobo", { mode: "number" }),

    // ── Project details ──
    deliveryTimeline: text("delivery_timeline"),
    constructionStatus: constructionStatusEnum("construction_status").notNull().default("planning"),
    titleDocument: text("title_document"), // e.g. "C of O", "Governor's Consent"
    totalUnits: integer("total_units").default(0),
    availableUnits: integer("available_units").default(0),

    // ── JSONB arrays — stored as structured data ──
    investmentHighlights: jsonb("investment_highlights").$type<string[]>().default([]),
    locationAdvantages: jsonb("location_advantages").$type<string[]>().default([]),
    featuresAmenities: jsonb("features_amenities").$type<string[]>().default([]),

    // ── Payment plan (optional structured data) ──
    paymentPlanDetails: jsonb("payment_plan_details").$type<{
      description: string;
      milestones: Array<{ label: string; percentageValue: number }>;
    } | null>(),

    // ── Contact ──
    whatsappNumber: text("whatsapp_number"),
    callNumber: text("call_number"),

    // ── SEO ──
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    focusKeyword: text("focus_keyword"),
    schemaMarkup: jsonb("schema_markup"),

    // ── HubSpot ──
    hubspotDealId: text("hubspot_deal_id"),

    // ── Flags ──
    isFeatured: boolean("is_featured").notNull().default(false),

    // ── Audit ──
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    lastEditedBy: uuid("last_edited_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: index("projects_slug_idx").on(table.slug),
    statusIdx: index("projects_status_idx").on(table.status),
    locationAreaIdx: index("projects_location_area_idx").on(table.locationArea),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// project_units
// ─────────────────────────────────────────────────────────────────────────────
export const projectUnits = pgTable(
  "project_units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: unitStatusEnum("status").notNull().default("active"),
    totalUnits: integer("total_units").notNull().default(0),
    availableUnits: integer("available_units").notNull().default(0),
    launchPriceKobo: bigint("launch_price_kobo", { mode: "number" }),
    currentPriceKobo: bigint("current_price_kobo", { mode: "number" }),
    ctaLabel: text("cta_label"),
    ctaLink: text("cta_link"),
    imageUrl: text("image_url"),
    description: text("description"),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index("project_units_project_id_idx").on(table.projectId),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// project_gallery
// ─────────────────────────────────────────────────────────────────────────────
export const projectGallery = pgTable(
  "project_gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index("project_gallery_project_id_idx").on(table.projectId),
  })
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectUnit = typeof projectUnits.$inferSelect;
export type NewProjectUnit = typeof projectUnits.$inferInsert;
export type ProjectGalleryItem = typeof projectGallery.$inferSelect;