import { NextRequest, NextResponse } from "next/server";

// Notion slugs are being normalized to lowercase. Permanently redirect any
// mixed-case /blog or /projects URL to its lowercase equivalent so existing
// shared links and search results don't 404.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isSlugPath = pathname.startsWith("/blog/") || pathname.startsWith("/projects/");
  if (!isSlugPath || pathname === pathname.toLowerCase()) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/blog/:path*", "/projects/:path*"],
};
