import { Client } from "@notionhq/client";
import { fetchBlocksRecursive } from "./notion-blocks";

const notion = new Client({ auth: process.env.NOTION_PROJECTS_TOKEN });
const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;

// Guard against a missing/misconfigured integration (e.g. an environment
// that hasn't set these yet) so it degrades to "no projects" instead of
// failing the entire production build.
const isConfigured = !!(process.env.NOTION_PROJECTS_TOKEN && databaseId);

export type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  tags: string[];
  cover: string | null;
  githubUrl: string | null;
  featured: boolean;
};

function plainText(rt: any[] | undefined): string {
  if (!rt || !Array.isArray(rt)) return "";
  return rt.map((r) => r.plain_text ?? "").join("");
}

function extractCover(page: any): string | null {
  const coverFile = page.properties?.cover?.files?.[0];
  return (
    coverFile?.file?.url ??
    coverFile?.external?.url ??
    page.cover?.external?.url ??
    page.cover?.file?.url ??
    null
  );
}

function mapPageToProject(page: any): Project | null {
  const props = page.properties;

  const title = plainText(props?.Name?.title) || "Untitled";

  const slug =
    plainText(props?.slug?.rich_text) ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!slug) return null;

  const description = plainText(props?.description?.rich_text) || undefined;

  const tags: string[] = Array.isArray(props?.tags?.multi_select)
    ? props.tags.multi_select.map((t: any) => t.name)
    : [];

  const cover = extractCover(page);

  const githubUrl = props?.["GitHub Repo"]?.url ?? null;
  const featured = !!props?.Featured?.checkbox;

  return { id: page.id, title, slug, description, tags, cover, githubUrl, featured };
}

export async function getProjects(): Promise<Project[]> {
  if (!isConfigured) return [];

  const res = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "status", select: { equals: "published" } },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return res.results.map(mapPageToProject).filter(Boolean) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isConfigured) return null;

  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "status", select: { equals: "published" } },
        { property: "slug", rich_text: { equals: slug } },
      ],
    },
    page_size: 1,
  });

  const page = res.results[0];
  return page ? mapPageToProject(page) : null;
}

// Notion file URLs are presigned S3 links that expire ~1 hour after being
// issued. A cached project page can outlive that window, so this re-fetches
// the page at request time to hand back a URL that's fresh right now.
export async function getFreshProjectCover(pageId: string): Promise<string | null> {
  if (!isConfigured) return null;
  const page = await notion.pages.retrieve({ page_id: pageId });
  return extractCover(page);
}

// Same expiry problem as covers, but for inline "image" blocks within a
// case study's body content.
export async function getFreshProjectBlockImage(blockId: string): Promise<string | null> {
  if (!isConfigured) return null;
  const block: any = await notion.blocks.retrieve({ block_id: blockId });
  if (block?.type !== "image") return null;
  const image = block.image;
  return image?.file?.url ?? image?.external?.url ?? null;
}

export async function getProjectBlocks(pageId: string) {
  if (!isConfigured) return [];
  return fetchBlocksRecursive(notion, pageId);
}
