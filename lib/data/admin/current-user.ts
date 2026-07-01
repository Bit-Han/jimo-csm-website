import type { AdminUser } from "@/lib/types/admin/role";

// TODO (integration stage): replace with the real signed-in user from the
// Supabase Auth session. There is no authentication wired up yet — /admin
// is NOT actually protected right now. Anyone with the URL can reach it.
// Do not deploy this publicly until Supabase Auth is in place.
export const currentAdminUser: AdminUser = {
	id: "mock-super-admin",
	fullName: "Tolu Adebayo",
	email: "tolu@jimo.ng",
	role: "super-admin",
	status: "active",
};
