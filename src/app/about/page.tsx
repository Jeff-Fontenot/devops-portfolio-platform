import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotionContent from "@/components/NotionContent";
import { getAboutBlocks } from "@/lib/notion";

export const revalidate = 300;

const title = "Jeff Fontenot | About";
const description =
  "The story behind how and why I chose this path | mission, background, and what I'm building next.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function AboutPage() {
  const blocks = await getAboutBlocks();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative overflow-hidden pt-28 pb-6">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="my-5 text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              About <span className="gradient-text">Me</span>
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16">
          {blocks.length === 0 ? (
            <div className="glass-container p-6 text-white/60">
              This page is being written. Check back soon.
            </div>
          ) : (
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
                <NotionContent blocks={blocks} source="blog" pageTitle="About" />
              </div>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
