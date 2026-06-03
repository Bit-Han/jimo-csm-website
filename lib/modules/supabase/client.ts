import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		throw new Error("Supabase env not set");
	}

	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
}
