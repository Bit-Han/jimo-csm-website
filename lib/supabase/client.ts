


import { createBrowserClient } from "@supabase/ssr";

export function createClient() {

	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
		throw new Error("Supabase env not set");
	}
	
	return createBrowserClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_PUBLISHABLE_KEY!,
	);
}


// // lib/auth/client.ts
// // ─────────────────────────────────────────────────────────────────────────────
// // Client-side Supabase singleton.
// // Import `supabase` in Client Components and hooks.
// // ─────────────────────────────────────────────────────────────────────────────
// import { createBrowserClient } from "@supabase/ssr";

// // Singleton — only one client instance per browser session
// let client: ReturnType<typeof createBrowserClient> | null = null;

// export function getSupabaseClient() {
//   if (!client) {
//     client = createBrowserClient(
// 			process.env.SUPABASE_URL!,
// 			process.env.SUPABASE_PUBLISHABLE_KEY!,
// 		);
//   }
//   return client;
// }

// // Named export for convenience
// export const supabase = getSupabaseClient();
