// //@/app/api/callback/route.ts
// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";

// export async function GET(request: NextRequest) {
// 	const { searchParams, origin } = new URL(request.url);
// 	const code = searchParams.get("code");
// 	const next = searchParams.get("next") ?? "/admin/auth/accept-invite";
// 	const error = searchParams.get("error");
// 	const errorDescription = searchParams.get("error_description");

// 	// Supabase passes error params if the invite link is invalid or expired
// 	if (error) {
// 		const loginUrl = new URL("/admin/auth/login", origin);
// 		loginUrl.searchParams.set("error", error);
// 		loginUrl.searchParams.set("description", errorDescription ?? "");
// 		return NextResponse.redirect(loginUrl);
// 	}

// 	if (!code) {
// 		return NextResponse.redirect(new URL("/admin/auth/login", origin));
// 	}

// 	const supabase = await createClient();
// 	const { error: exchangeError } =
// 		await supabase.auth.exchangeCodeForSession(code);

// 	if (exchangeError) {
// 		const loginUrl = new URL("/admin/auth/login", origin);
// 		loginUrl.searchParams.set("error", "invite_expired");
// 		return NextResponse.redirect(loginUrl);
// 	}

// 	// Code exchanged — user is now authenticated. Redirect to the form
// 	// where they set their name and password.
// 	return NextResponse.redirect(new URL(next, origin));
// }


// @/app/api/callback/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	
	// 1. Check for invitation email token hashes
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type"); // Usually 'invite' or 'recovery'
	
	// 2. Check for standard PKCE login codes
	const code = searchParams.get("code");
	
	const next = searchParams.get("next") ?? "/admin/auth/accept-invite";
	const error = searchParams.get("error");
	const errorDescription = searchParams.get("error_description");

	if (error) {
		const loginUrl = new URL("/admin/auth/login", origin);
		loginUrl.searchParams.set("error", error);
		loginUrl.searchParams.set("description", errorDescription ?? "");
		return NextResponse.redirect(loginUrl);
	}

	const supabase = await createClient();

	// Handle Invitation Link Verification
	if (token_hash && type === "invite") {
		const { error: verifyError } = await supabase.auth.verifyOtp({
			token_hash,
			type: "invite",
		});

		if (verifyError) {
			const loginUrl = new URL("/admin/auth/login", origin);
			loginUrl.searchParams.set("error", "invite_expired");
			return NextResponse.redirect(loginUrl);
		}

		// Success! User is authenticated. Forward to the onboarding form.
		return NextResponse.redirect(new URL(next, origin));
	}

	// Handle Standard PKCE Login Exchange
	if (code) {
		const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

		if (exchangeError) {
			const loginUrl = new URL("/admin/auth/login", origin);
			loginUrl.searchParams.set("error", "auth_failed");
			return NextResponse.redirect(loginUrl);
		}

		return NextResponse.redirect(new URL(next, origin));
	}

	// Fallback if neither parameter exists
	return NextResponse.redirect(new URL("/admin/auth/login", origin));
}
