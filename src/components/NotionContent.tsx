// Shared renderer for basic Notion block content, used by the blog, case
// studies, and the About page.

import CodeBlock from "./CodeBlock";
import { notionBlockImageSrc } from "@/lib/notion-image";

type Source = "blog" | "project";

export interface NotionRichText {
  plain_text: string;
  href?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

function ListItem({ block, source }: { block: NotionBlock; source: Source }) {
  const data = block[block.type] as Record<string, unknown>;
  const children = (block.children as NotionBlock[]) || [];
  return (
    <li>
      {(data?.rich_text as NotionRichText[])?.map((t, i) => <Span key={i} t={t} />)}
      {children.length > 0 && <NotionContent blocks={children} source={source} />}
    </li>
  );
}

function renderBlock(b: NotionBlock, source: Source) {
  const type = b.type;
  const data = b[type] as Record<string, unknown>;

  switch (type) {
    case "heading_1":
      return (
        <h2 key={b.id} className="text-yellow-400 font-bold">
          {(data?.rich_text as NotionRichText[])?.map((t, i) => (
            <Span key={i} t={t} />
          )) || null}
        </h2>
      );
    case "heading_2":
      return (
        <h3 key={b.id} className="text-yellow-400 font-semibold">
          {(data?.rich_text as NotionRichText[])?.map((t, i) => (
            <Span key={i} t={t} />
          )) || null}
        </h3>
      );
    case "heading_3":
      return (
        <h4 key={b.id} className="text-yellow-400 font-bold">
          {(data?.rich_text as NotionRichText[])?.map((t, i) => (
            <Span key={i} t={t} />
          )) || null}
        </h4>
      );
    case "paragraph":
      return (
        <p key={b.id}>
          {!data?.rich_text || (data.rich_text as NotionRichText[]).length === 0 ? (
            <br />
          ) : (
            (data.rich_text as NotionRichText[]).map((t, i) => <Span key={i} t={t} />)
          )}
        </p>
      );
    case "quote":
      return (
        <blockquote key={b.id}>
          {(data?.rich_text as NotionRichText[])?.map((t, i) => <Span key={i} t={t} />)}
        </blockquote>
      );
    case "code": {
      const code = (data?.rich_text as NotionRichText[])?.map((t) => t.plain_text).join("") || "";
      const language = data?.language as string | undefined;
      return <CodeBlock key={b.id} code={code} language={language} />;
    }
    case "image": {
      const imageData = data as Record<string, unknown>;
      const imgType = imageData?.type as string;
      // "file" images are Notion-hosted presigned S3 URLs that expire ~1hr
      // after being issued, so they're routed through the proxy to always
      // get a fresh one. "external" images are stable and left alone.
      const src =
        imgType === "external"
          ? (imageData?.external as { url?: string })?.url
          : notionBlockImageSrc(source, b.id);
      const caption = (imageData?.caption as NotionRichText[])?.[0]?.plain_text;
      return (
        <figure key={b.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption || "image"} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case "divider":
      return <hr key={b.id} />;
    case "column_list": {
      const columns = (b.children as NotionBlock[]) || [];
      return (
        <div
          key={b.id}
          className="not-prose my-6 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          <NotionContent blocks={columns} source={source} />
        </div>
      );
    }
    case "column": {
      const children = (b.children as NotionBlock[]) || [];
      return (
        <div key={b.id} className="prose prose-invert min-w-0 max-w-none">
          <NotionContent blocks={children} source={source} />
        </div>
      );
    }
    case "toggle": {
      const children = (b.children as NotionBlock[]) || [];
      return (
        <details key={b.id} className="my-4">
          <summary className="cursor-pointer font-semibold text-yellow-400">
            {(data?.rich_text as NotionRichText[])?.map((t, i) => (
              <Span key={i} t={t} />
            ))}
          </summary>
          <div className="mt-2">
            <NotionContent blocks={children} source={source} />
          </div>
        </details>
      );
    }
    default:
      return null;
  }
}

export default function NotionContent({
  blocks,
  source = "blog",
}: {
  blocks: NotionBlock[];
  source?: Source;
}) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Consecutive list items of the same type share one <ul>/<ol> so numbering
    // and bullet nesting behave correctly — each block used to render its own
    // list wrapper, which reset numbered lists back to "1." every item.
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const listType = block.type;
      const group: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === listType) {
        group.push(blocks[i]);
        i++;
      }
      const ListTag = listType === "numbered_list_item" ? "ol" : "ul";
      elements.push(
        <ListTag key={group[0].id}>
          {group.map((item) => (
            <ListItem key={item.id} block={item} source={source} />
          ))}
        </ListTag>
      );
      continue;
    }

    elements.push(renderBlock(block, source));
    i++;
  }

  return <>{elements}</>;
}

function Span({ t }: { t: NotionRichText }) {
  const text = t.plain_text || "";
  const href = t.href;

  let el: React.ReactNode = text;
  if (href) el = <a href={href}>{text}</a>;
  if (t.annotations?.bold) el = <strong>{el}</strong>;
  if (t.annotations?.italic) el = <em>{el}</em>;
  if (t.annotations?.code) el = <code>{text}</code>;

  return <>{el}</>;
}
