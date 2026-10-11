import { NextResponse } from "next/server";

const TOKEN_NAME = "ks_admin_token";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(TOKEN_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already has token and visiting /admin/login, redirect to dashboard
  if (pathname === "/admin/login") {
    const token = req.cookies.get(TOKEN_NAME)?.value;
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
