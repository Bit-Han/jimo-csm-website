import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { adminNavItems } from "@/lib/data/admin/nav";
import { canAccessModule } from "@/lib/data/admin/roles";
import type { AdminModule, AdminRole } from "@/lib/types/admin/role";
import { roleModuleAccess } from "@/lib/data/admin/roles";

const PUBLIC_ADMIN_PATHS = ["/admin/auth/login", "/admin/auth/accept-invite"];

function pathToModule(pathname: string): AdminModule | null {
  const item = adminNavItems.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`)
  );
  return item?.module ?? null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Public auth pages — allow through without any session check whatsoever
  // Check this BEFORE calling updateSession to avoid unnecessary Supabase calls
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Refresh session and get user
  const { supabaseResponse, user } = await updateSession(request);

  // No session → redirect to login
  if (!user) {
    const loginUrl = new URL("/admin/auth/login", request.url);
    // Only attach redirectTo if it's a real protected destination
    // Never set redirectTo to an auth page — that causes loops
    if (!PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      loginUrl.searchParams.set("redirectTo", pathname);
    }
    // IMPORTANT: carry over Supabase cookies even on redirect
    // so the session state is consistent
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
      redirectResponse.cookies.set(name, value);
    });
    return redirectResponse;
  }


  
  // const role = (user.app_metadata?.adminRole ?? "sales_crm") as AdminRole;

  const rawRole = user.app_metadata?.adminRole as string | undefined | null;
	const isValidRole =
		rawRole != null &&
		rawRole !== "" &&
		(rawRole as string) in roleModuleAccess;
	const role: AdminRole = isValidRole ? (rawRole as AdminRole) : "sales-crm";

  // Root /admin → dashboard
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Module access check
  const currentModule = pathToModule(pathname);
  if (currentModule && !canAccessModule(role, currentModule)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};