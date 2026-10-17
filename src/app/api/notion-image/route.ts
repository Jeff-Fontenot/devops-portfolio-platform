// Redirects to a freshly-signed Notion cover URL at request time, instead of
// baking an expiring S3 URL into a cached (ISR) page. Notion's file URLs
// expire ~1 hour after being issued, so a stale page can serve a dead link
// until this route re-resolves it.
import { NextRequest, NextResponse } from "next/server";
import { getFreshPostCover } from "@/lib/notion";
import { getFreshProjectCover } from "@/lib/notion-projects";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!id || (type !== "blog" && type !== "project")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const url =
    type === "blog" ? await getFreshPostCover(id) : await getFreshProjectCover(id);

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
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
