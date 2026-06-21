// lib/db/schema/users.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum, invitationStatusEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// profiles
// Mirrors auth.users (Supabase). Populated automatically by a DB trigger
// (see lib/db/migrations/0000_trigger.sql) when a user is created via Auth.
// The `id` is the same UUID as auth.users.id — no default random needed.
// ─────────────────────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
	id: uuid("id").primaryKey(), // FK → auth.users.id (set by trigger)
	name: text("name").notNull().default(""),
	email: text("email").notNull().unique(),
	role: userRoleEnum("role").notNull().default("sales_crm"),
	status: userStatusEnum("status").notNull().default("active"),
	invitedBy: uuid("invited_by"), // FK → profiles.id (self-reference added in relations)
	lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// invitations
// Tracks pending/accepted admin invites. When accepted, Supabase creates the
// auth user and the trigger creates the profile.
// ─────────────────────────────────────────────────────────────────────────────
export const invitations = pgTable("invitations", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull(),
	role: userRoleEnum("role").notNull(),
	invitedBy: uuid("invited_by")
		.notNull()
		.references(() => profiles.id, { onDelete: "set null" }),
	// Supabase generates the invite token internally via inviteUserByEmail.
	// We store it here so we can expire/revoke it from our side if needed.
	supabaseUserId: uuid("supabase_user_id"), // set after Supabase invite is created
	status: invitationStatusEnum("status").notNull().default("pending"),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	acceptedAt: timestamp("accepted_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
