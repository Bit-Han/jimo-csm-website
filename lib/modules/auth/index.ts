import { createSupabaseClient } from "../supabase/client";

export async function getUser() {
	try {
		const supabase = createSupabaseClient();
		const { data } = await supabase.auth.getUser();
		return data.user;
	} catch {
		return null;
	}
}
