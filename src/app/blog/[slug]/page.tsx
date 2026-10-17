// src/app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlocks, getPostBySlug, getPosts } from "@/lib/notion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotionContent from "@/components/NotionContent";
import { notionCoverSrc } from "@/lib/notion-image";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const title = `${post.title} | Odyssey Blog`;
  return {
    title,
    description: post.description,
    openGraph: {
      title,
      description: post.description,
      images: post.cover ? [notionCoverSrc("blog", post.id)] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: post.cover ? [notionCoverSrc("blog", post.id)] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(resolvedParams.slug),
    getPosts(),
  ]);
  if (!post) notFound();

  const i = allPosts.findIndex((p) => p.slug === resolvedParams.slug);
  const prev = i > 0 ? allPosts[i - 1] : null;
  const next = i < allPosts.length - 1 ? allPosts[i + 1] : null;

  const blocks = await getBlocks(post.id);

  return (
    <>
    <Header />
    <main>
      {/* Centered mini-hero */}
      <section className="relative overflow-hidden pt-28">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Link
            href="/blog"
            className="my-5 inline-flex gap-2 text-sm text-yellow-400 hover:underline"
          >
            ← All posts
          </Link>
          <h1 className="my-5 text-4xl md:text-5xl font-bold tracking-tight leading-tight gradient-text">
            {post.title}
          </h1>
          <h3 className="mb-10 mx-auto text-xl max-w-2xl text-white/60 font-normal">
            {post.description}
          </h3>
        </div>
      </section>

      {/* Cover */}
      {post.cover && (
        <div className="mx-auto -mt-6 max-w-3xl px-4">
          <div className="glass-container overflow-hidden">
            <Image
              src={notionCoverSrc("blog", post.id)}
              alt={post.title}
              width={1600}
              height={840}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>

      )}

      {/* Article */}
      <section className="mx-auto max-w-3xl px-4 pt-8">
        <article className="glass-container p-6 md:p-8">
          <div
            className="prose prose-invert max-w-none
                       prose-a:text-yellow-400
                       prose-headings:text-yellow-400 prose-headings:font-bold prose-headings:tracking-tight
                       prose-h2:text-2xl md:prose-h2:text-3xl
                       prose-h3:text-xl md:prose-h3:text-2xl
                       prose-blockquote:border-yellow-400/40
                       prose-hr:border-white/10"
          >
            <NotionContent blocks={blocks} />
          </div>
        </article>

        {/* Prev / Next */}
        <nav className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="glass-container glass-hover block p-4 hover:underline"
              >
                <div className="text-xs text-white/50">← Newer</div>
                <div className="mt-1 font-medium text-yellow-400">
                  {prev.title}
                </div>
              </Link>
            )}
          </div>
          <div className="sm:text-right">
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="glass-container glass-hover block p-4 hover:underline"
              >
                <div className="text-xs text-white/50">Older →</div>
                <div className="mt-1 font-medium text-yellow-400">
                  {next.title}
                </div>
              </Link>
            )}
          </div>
        </nav>

        <div className="h-10" />
      </section>
    <Footer />
    </main>
    </>
  );
}