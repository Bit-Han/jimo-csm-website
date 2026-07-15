import { createClient } from "@supabase/supabase-js";

// Service role client — NEVER import this in client components or expose to the browser.
// Only used in Server Actions for operations that require bypassing RLS
// (creating auth users, updating app_metadata).
export function createAdminClient() {
	return createClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{ auth: { autoRefreshToken: false, persistSession: false } },
	);
}
