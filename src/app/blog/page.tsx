// src/app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostsWithPreviews } from "@/lib/notion";
import { notionCoverSrc } from "@/lib/notion-image";

export const revalidate = 300;

const title = "Jeff Fontenot | Blog";
const description = "Insights from an endless journey of growth and discovery.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

function BlogHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
          Odyssey <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Insights from an endless journey of growth and discovery.
        </p>
      </div>
    </section>
  );
}

export default async function BlogIndexPage() {
  const posts = await getPostsWithPreviews();

  return (
    <>
      <Header />
      <BlogHero />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16">
          {posts.length === 0 ? (
            <div className="glass-container p-6 text-white/60">
              No posts yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="glass-container glass-hover group relative flex min-h-[400px] flex-col overflow-hidden"
                >
                  {p.cover && (
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={notionCoverSrc("blog", p.id)}
                        alt={p.title}
                        width={1200}
                        height={630}
                        priority={i < 3}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div className="relative p-5">
                    <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-yellow-300">
                      {p.title}
                    </h2>

                    {p.preview && (
                      <p className="mt-2.5 line-clamp-4 text-sm text-white/60">
                        {p.preview}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
