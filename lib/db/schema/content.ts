import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";
import type { HomePageData } from "@/lib/types/home";

// ─── Home page content ─────────────────────────────────────────────────────
// The full HomePageData object stored as JSONB.
// When the admin saves edits, we upsert id=1.
export const homeContent = pgTable("home_content", {
	id: integer("id").primaryKey().default(1),
	data: jsonb("data").$type<HomePageData>().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Company content ───────────────────────────────────────────────────────
// About Us, Services, and team members split into separate JSONB columns
// so each section of the editor can save independently without overwriting
// the others.
export interface CompanyWhoWeAreData {
	eyebrow: string;
	heading: string;
	highlight: string;
	paragraphs: string[];
}

export interface CompanyServiceBulletData {
	id: string;
	label: string;
}

export interface CompanyServiceData {
	id: string;
	icon: string;
	title: string;
	description: string;
	bullets: CompanyServiceBulletData[];
}

export interface PropertyTypeCategoryData {
	id: string;
	icon: string;
	title: string;
	description: string;
}

export interface CoreValueData {
	id: string;
	icon: string;
	title: string;
	description: string;
}

export interface CompanyPromiseData {
	lines: string[];
	description: string;
}

export interface TeamMemberData {
	id: string;
	name: string;
	role: string;
	bio: string;
	photo: { src: string; alt: string };
}

export const companyContent = pgTable("company_content", {
	id: integer("id").primaryKey().default(1),
	whoWeAre: jsonb("who_we_are").$type<CompanyWhoWeAreData>().notNull(),
	coreValues: jsonb("core_values").$type<CoreValueData[]>().notNull(),
	services: jsonb("services").$type<CompanyServiceData[]>().notNull(),
	propertyTypes: jsonb("property_types")
		.$type<PropertyTypeCategoryData[]>()
		.notNull(),
	companyPromise: jsonb("company_promise")
		.$type<CompanyPromiseData>()
		.notNull(),
	teamMembers: jsonb("team_members").$type<TeamMemberData[]>().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type HomeContentRow = typeof homeContent.$inferSelect;
export type CompanyContentRow = typeof companyContent.$inferSelect;
