import { NextRequest, NextResponse } from "next/server";

// Subdomains that should serve /projects directly
const PROJECT_HOSTS = ["projects.rajt.org", "p.rajt.org"];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // --- Subdomain routing: projects.raj.org / p.rajt.org ---
  if (PROJECT_HOSTS.some((h) => host.startsWith(h))) {
    // Rewrite all requests on these domains to /projects
    if (pathname === "/" || pathname === "") {
      return NextResponse.rewrite(new URL("/projects", request.url));
    }
    // Let other assets (/_next, /favicon, etc.) pass through
    return NextResponse.next();
  }

  // --- Auth protection for /writing and /admin ---
  const isProtected =
    pathname.startsWith("/writing") || pathname.startsWith("/admin");

  if (isProtected) {
    const sessionCookie =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token");

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth-protected routes
    "/writing/:path*",
    "/admin/:path*",
    // Catch-all for subdomain routing (needs to match /)
    "/",
  ],
};
