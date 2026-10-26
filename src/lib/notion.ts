import { Client } from "@notionhq/client";
import { fetchBlocksRecursive } from "./notion-blocks";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID!;

export type Post = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  preview?: string; 
  tags: string[];
  date: string; // ISO
  cover: string | null;   // <- make non-optional in the type for clarity
};

// --- helper: fetch full page if cover missing
async function ensureCover(page: any): Promise<string | null> {
  // First check the database "cover" property (Files & media type)
  const coverProperty = page.properties?.cover?.files?.[0];
  if (coverProperty?.file?.url) return coverProperty.file.url;
  if (coverProperty?.external?.url) return coverProperty.external.url;
  
  // Fallback to page-level cover
  const url = page.cover?.external?.url ?? page.cover?.file?.url ?? null;
  if (url) return url;
  
  // Last resort: fetch full page
  const full = await notion.pages.retrieve({ page_id: page.id });
  // @ts-ignore
  const cover = full.cover?.external?.url ?? full.cover?.file?.url ?? null;
  return cover;
}

function plainText(rt: any[] | undefined): string {
  if (!rt || !Array.isArray(rt)) return "";
  return rt.map((r) => r.plain_text ?? "").join("");
}

async function mapPageToPost(page: any): Promise<Post | null> {
  const props = page.properties;

  const title =
    plainText(props?.Name?.title) ||
    plainText(props?.title?.title) ||
    "Untitled";

  const slug =
    plainText(props?.slug?.rich_text) ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const description = plainText(props?.description?.rich_text) || undefined;

  const tags: string[] = Array.isArray(props?.tags?.multi_select)
    ? props.tags.multi_select.map((t: any) => t.name)
    : [];

  const date = page.created_time;
  const cover = await ensureCover(page);

  if (!slug) return null;

  return { id: page.id, title, slug, description, tags, date, cover };
}

function extractTextPreview(blocks: any[], maxLength: number = 150): string {
  for (const block of blocks) {
    if (block.type === 'paragraph' && block.paragraph?.rich_text?.length > 0) {
      const text = plainText(block.paragraph.rich_text);
      if (text.trim()) {
        return text.length > maxLength 
          ? text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
          : text;
      }
    }
  }
  return '';
}

// ---- public fetchers

export async function getPosts(): Promise<Post[]> {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "status", select: { equals: "published" } },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  const mapped = await Promise.all(res.results.map(mapPageToPost));
  return mapped.filter(Boolean) as Post[];
}

export async function getPostsWithPreviews(): Promise<Post[]> {
  const posts = await getPosts();

  // Prefer the "description" property (already fetched with zero extra API
  // calls) as the preview text. Only fall back to scanning the page's blocks
  // — a separate, much slower Notion API call per post — for posts that
  // don't have a description filled in.
  return Promise.all(
    posts.map(async (post) => {
      if (post.description) {
        return { ...post, preview: post.description };
      }
      const blocks = await getBlocks(post.id);
      return { ...post, preview: extractTextPreview(blocks) };
    })
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
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
  return page ? await mapPageToPost(page) : null;
}

// Notion file URLs are presigned S3 links that expire ~1 hour after being
// issued. A cached post page can outlive that window, so this re-fetches
// the page at request time to hand back a URL that's fresh right now.
export async function getFreshPostCover(pageId: string): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return ensureCover(page);
}

// Same expiry problem as covers, but for inline "image" blocks within a
// post's body content.
export async function getFreshBlockImage(blockId: string): Promise<string | null> {
  const block: any = await notion.blocks.retrieve({ block_id: blockId });
  if (block?.type !== "image") return null;
  const image = block.image;
  return image?.file?.url ?? image?.external?.url ?? null;
}

export async function getBlocks(pageId: string) {
  return fetchBlocksRecursive(notion, pageId);
}

export async function getAboutBlocks() {
  const pageId = process.env.NOTION_ABOUT_PAGE_ID;
  if (!pageId) return [];
  return getBlocks(pageId);
}
