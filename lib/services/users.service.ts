// lib/services/users.service.ts
import { db } from "@/lib/db";
import { profiles, invitations } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import type { Profile } from "@/lib/types";

export async function getUsers(): Promise<Profile[]> {
	return db.select().from(profiles).orderBy(profiles.createdAt);
}

export async function getUserById(id: string): Promise<Profile | null> {
	const [user] = await db
		.select()
		.from(profiles)
		.where(eq(profiles.id, id))
		.limit(1);
	return user ?? null;
}

export async function getUserRoleStats() {
	const rows = await db
		.select({
			role: profiles.role,
			count: sql<number>`count(*)::int`,
		})
		.from(profiles)
		.groupBy(profiles.role);

	return rows;
}

export async function updateUserRole(
	id: string,
	role: Profile["role"],
): Promise<Profile | null> {
	const [updated] = await db
		.update(profiles)
		.set({ role, updatedAt: new Date() })
		.where(eq(profiles.id, id))
		.returning();
	return updated ?? null;
}

export async function deactivateUser(id: string): Promise<void> {
	await db
		.update(profiles)
		.set({ status: "inactive", updatedAt: new Date() })
		.where(eq(profiles.id, id));
}

export async function reactivateUser(id: string): Promise<void> {
	await db
		.update(profiles)
		.set({ status: "active", updatedAt: new Date() })
		.where(eq(profiles.id, id));
}

export async function getPendingInvitations() {
	return db.query.invitations.findMany({
		where: eq(invitations.status, "pending"),
		with: { inviter: { columns: { name: true } } },
		orderBy: [invitations.createdAt],
	});
}

export async function revokeInvitation(id: string): Promise<void> {
	await db
		.update(invitations)
		.set({ status: "revoked" })
		.where(eq(invitations.id, id));
}
