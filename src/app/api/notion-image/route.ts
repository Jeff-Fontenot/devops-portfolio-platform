// Redirects to a freshly-signed Notion file URL at request time, instead of
// baking an expiring S3 URL into a cached (ISR) page. Notion's file URLs
// expire ~1 hour after being issued, so a stale page can serve a dead link
// until this route re-resolves it.
//
// Supports two kinds of lookups, both scoped by `type` (which Notion
// client/token owns the id — blog vs. project):
//   - kind=cover (default): ?type=blog|project&id=<pageId>
//   - kind=block:           ?type=blog|project&id=<blockId>
import { NextRequest, NextResponse } from "next/server";
import { getFreshPostCover, getFreshBlockImage } from "@/lib/notion";
import { getFreshProjectCover, getFreshProjectBlockImage } from "@/lib/notion-projects";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const kind = searchParams.get("kind") ?? "cover";

  if (!id || (type !== "blog" && type !== "project") || (kind !== "cover" && kind !== "block")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const url =
    kind === "block"
      ? type === "blog"
        ? await getFreshBlockImage(id)
        : await getFreshProjectBlockImage(id)
      : type === "blog"
        ? await getFreshPostCover(id)
        : await getFreshProjectCover(id);

  if (!url) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Next's built-in image optimizer rejects a redirect response from a local
  // source ("internal response is invalid"), so the bytes are streamed
  // through here rather than redirecting to the signed S3 URL.
  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Bad Gateway", { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      // Every hit re-resolves a fresh signed URL (force-dynamic, no upstream
      // caching), so a short client/CDN cache can never outlive the link it
      // just fetched — keep this well under Notion's ~1hr expiry.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
