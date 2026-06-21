// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// const PUBLIC_ROUTES = ["/login", "/forgot-password", "/api/webhooks"];
// const AUTH_ROUTES = ["/login", "/forgot-password"];

// export async function middleware(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           );
//           supabaseResponse = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { pathname } = request.nextUrl;

//   // Allow public routes
//   if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
//     // If logged in and hitting auth pages, redirect to dashboard
//     if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//     return supabaseResponse;
//   }

//   // Protect all CMS routes
//   if (!user) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Root redirect
//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return supabaseResponse;
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };




// middleware.ts (root of project)
// ─────────────────────────────────────────────────────────────────────────────
// 1. Refreshes the Supabase session token on every request.
// 2. Protects /dashboard/* routes — redirects to /login if unauthenticated.
// 3. Redirects authenticated users away from /login to /dashboard.
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/setup-account");

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