

// middleware.ts (root of project)
// ─────────────────────────────────────────────────────────────────────────────
// 1. Refreshes the Supabase session token on every request.
// 2. Protects /dashboard/* routes — redirects to /login if unauthenticated.
// 3. Redirects authenticated users away from /login to /dashboard.
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// IMPORTANT: do not run any logic between createServerClient and getUser()
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;
	const isDashboard = pathname.startsWith("/admin");
	const isAuth =
		pathname.startsWith("/login") || pathname.startsWith("/setup-account");

	// Unauthenticated user trying to access dashboard → redirect to login
	if (!user && isDashboard) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirectTo", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Authenticated user trying to access login → redirect to dashboard
	if (user && isAuth) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder
     * - /api/* — API routes handle their own auth
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};