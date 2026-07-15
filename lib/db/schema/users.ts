import {
	type AnyPgColumn,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { adminRoleEnum, adminStatusEnum, invitationStatusEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// admin_users
//
// id must match the Supabase auth.users id. When a user accepts an invite and
// completes signup, we create the Supabase Auth account first, then insert a
// row here using that auth id as the primary key.
//
// The first SuperAdmin is created manually (directly in Supabase Auth + a
// single INSERT here). All subsequent users arrive via the invitation flow,
// so their invitedByUserId will always be set.
// ─────────────────────────────────────────────────────────────────────────────
export const adminUsers = pgTable("admin_users", {
	id: uuid("id").primaryKey(),

	fullName: text("full_name").notNull(),

	// Chosen by the user during the accept-invite signup form.
	// Shown in the topbar and throughout the CMS.
	username: text("username").notNull().unique(),

	email: text("email").notNull().unique(),

	// Optional — collected during signup, useful for the sales team.
	phoneNumber: text("phone_number"),

	role: adminRoleEnum("role").notNull().default("sales-crm"),
	status: adminStatusEnum("status").notNull().default("active"),

	// Self-referential: which admin_users row sent this person their invite.
	// Nullable because the first SuperAdmin has no inviting parent.
	// AnyPgColumn is the Drizzle pattern for safe circular / self-references.
	invitedByUserId: uuid("invited_by_user_id").references(
		(): AnyPgColumn => adminUsers.id,
		{ onDelete: "set null" },
	),

	lastActiveAt: timestamp("last_active_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// admin_invitations
//
// One row per invite sent. The flow:
//   1. SuperAdmin fills in email + role → row inserted (status: pending)
//   2. Email goes out with /admin/auth/accept-invite?token=<token>
//   3. Recipient clicks link → page looks up row by token, checks status
//      and expiresAt, renders signup form with email pre-filled
//   4. Recipient submits form → Supabase Auth account created, admin_users
//      row inserted, invitation status set to accepted, acceptedByUserId set
//   5. If the token window passes without use → status set to expired
//      (done by a scheduled Supabase function or checked on each lookup)
//   6. SuperAdmin can revoke a pending invite → status set to revoked
//
// Security note (for the integration stage):
//   Store a SHA-256 hash of the token, not the raw token. When the user
//   arrives with the link, hash what they send and compare to the stored hash.
//   For the current development stage, storing raw is fine — just don't ship
//   this to a public URL before hashing is implemented.
// ─────────────────────────────────────────────────────────────────────────────
export const adminInvitations = pgTable("admin_invitations", {
	id: uuid("id").defaultRandom().primaryKey(),

	// The email address being invited. Pre-fills the signup form and becomes
	// the Supabase Auth email. Cannot be changed by the recipient.
	email: text("email").notNull(),

	// The role that will be assigned to the user on signup.
	// SuperAdmin sets this when creating the invite.
	role: adminRoleEnum("role").notNull(),

	token: text("token").unique(),

	status: invitationStatusEnum("status").notNull().default("pending"),

	// Who created this invite. References admin_users so we know which
	// SuperAdmin is responsible for each team member's access.
	invitedByUserId: uuid("invited_by_user_id")
		.notNull()
		.references(() => adminUsers.id, { onDelete: "restrict" }),
	// onDelete: restrict — prevents deleting a SuperAdmin who has sent invites.
	// The SuperAdmin must be deactivated, not deleted.

	// Set when status transitions to "accepted". Links the invitation record
	// to the admin_users row that was created as a result.
	acceptedByUserId: uuid("accepted_by_user_id").references(
		() => adminUsers.id,
		{ onDelete: "set null" },
	),

	// Invitations expire after a set window (e.g. 7 days). The accept-invite
	// page checks this before rendering the form. Expired invites can be
	// re-sent, which creates a new invitation row.
	expiresAt: timestamp("expires_at").notNull(),

	acceptedAt: timestamp("accepted_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminUserRow = typeof adminUsers.$inferSelect;
export type NewAdminUserRow = typeof adminUsers.$inferInsert;
export type AdminInvitationRow = typeof adminInvitations.$inferSelect;
export type NewAdminInvitationRow = typeof adminInvitations.$inferInsert;