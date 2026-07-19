


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

