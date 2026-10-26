// src/app/projects/page.tsx
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjects } from "@/lib/notion-projects";
import { notionCoverSrc } from "@/lib/notion-image";

export const revalidate = 300;

const title = "Jeff Fontenot | Projects";
const description = "A portfolio index of cloud, DevOps, and automation projects.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

function ProjectsHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
          Case <span className="gradient-text">Studies</span>
        </h1>
      </div>
    </section>
  );
}

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <ProjectsHero />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16">
          {projects.length === 0 ? (
            <div className="glass-container p-6 text-white/60">
              No projects published yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="glass-container glass-hover group relative flex min-h-[400px] flex-col overflow-hidden"
                >
                  {p.cover && (
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={notionCoverSrc("project", p.id)}
                        alt={p.title}
                        width={1200}
                        height={630}
                        priority={i < 3}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div className="relative flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-yellow-300">
                      {p.title}
                    </h2>

                    {p.description && (
                      <p className="mt-2.5 line-clamp-4 text-sm text-white/60">
                        {p.description}
                      </p>
                    )}

                    {p.tags.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-2 pt-4">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
