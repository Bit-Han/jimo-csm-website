// app/admin/auth/confirm/route.ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Hard-restricted on purpose: `next` comes off the query string, i.e. from
// whoever crafted the link. Without this allow-list check, this route is
// an open redirect for anyone who can get a victim to click a
// /admin/auth/confirm?...&next=https://evil.com link.
const ALLOWED_NEXT = "/admin/auth/accept-invite";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	// Scoped to "invite" only — this app has no self-serve signup, magic
	// link, or password recovery flow yet, so there's no reason for this
	// endpoint to accept any other OTP type.
	if (token_hash && type === "invite") {
		const supabase = await createClient();
		const { error } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			redirect(ALLOWED_NEXT);
		}
	}

	// Covers: missing/garbled params, wrong type, and verifyOtp rejecting
	// the token (expired, already used, tampered).
	redirect("/admin/auth/login?error=access_denied");
}
