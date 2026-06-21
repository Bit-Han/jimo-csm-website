// // Server client — use in Server Components, Server Actions, Route Handlers
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function createClient() {
// 	const cookieStore = await cookies();

// 	return createServerClient(
// 		process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
// 		{
// 			cookies: {
// 				getAll() {
// 					return cookieStore.getAll();
// 				},
// 				setAll(cookiesToSet) {
// 					try {
// 						cookiesToSet.forEach(({ name, value, options }) =>
// 							cookieStore.set(name, value, options),
// 						);
// 					} catch {
// 						// Server Component — cookies set by middleware
// 					}
// 				},
// 			},
// 		},
// 	);
// }

// // Admin client — only for privileged operations (invite user, assign role)
// // NEVER expose to the browser
// import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// export function createAdminClient() {
// 	return createSupabaseClient(
// 		process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		process.env.SUPABASE_SERVICE_ROLE_KEY!,
// 		{ auth: { autoRefreshToken: false, persistSession: false } },
// 	);
// }





// lib/auth/server.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-side Supabase helpers (used in API routes and Server Components).
// Uses @supabase/ssr for cookie-based session management.
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Profile } from "@/lib/types";

/**
 * Creates a Supabase client scoped to the current request's cookies.
 * Use this inside API Route Handlers and Server Components.
 *
 * IMPORTANT: Call `await createClient()` fresh on every request — do not
 * cache the client across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch {
						// setAll is called from a Server Component where cookies are
						// read-only. The middleware handles session refresh anyway.
					}
				},
			},
		},
	);
}

/**
 * Creates a Supabase admin client using the service role key.
 * Use this ONLY for privileged operations (invite user, delete user etc.).
 * Never expose the service role key to the client.
 */
export async function createAdminClient() {
  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Gets the authenticated Supabase user AND their profile from our DB.
 * Returns null if not authenticated or profile not found.
 *
 * Usage in API routes:
 *   const { user, profile } = await getAuthUser() ?? {};
 *   if (!profile) return unauthorized();
 */
export async function getAuthUser(): Promise<{
  user: { id: string; email: string };
  profile: Profile;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile || profile.status === "inactive") return null;

  return { user: { id: user.id, email: user.email! }, profile };
}

/**
 * Update a user's last_active_at timestamp.
 * Called from middleware on each authenticated request.
 */
export async function touchLastActive(userId: string) {
  await db
    .update(profiles)
    .set({ lastActiveAt: new Date() })
    .where(eq(profiles.id, userId));
}