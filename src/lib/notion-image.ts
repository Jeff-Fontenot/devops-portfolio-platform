// Builds a URL to the cover-image proxy (src/app/api/notion-image), which
// re-resolves the underlying Notion file URL on every request so it never
// serves an expired presigned S3 link from a stale cached page.
export function notionCoverSrc(type: "blog" | "project", id: string): string {
  return `/api/notion-image?type=${type}&id=${id}`;
}
