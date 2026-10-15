import { NextResponse } from "next/server";
import { getHomelabMetrics } from "@/lib/homelab-metrics";

export async function GET() {
  const data = await getHomelabMetrics();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "private, max-age=0, must-revalidate",
      // Lets the homelab dashboard's own client-side JS read this response.
      // Scoped to that one origin, not a wildcard — the data itself is
      // already publicly fetchable (curl, server-to-server) regardless of
      // CORS, this only governs which browser-JS origins may read it.
      "Access-Control-Allow-Origin": "https://dash.itodyssey.io",
    },
  });
}
