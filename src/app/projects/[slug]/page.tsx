// src/app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Github } from "lucide-react";
import { getProjectBlocks, getProjectBySlug, getProjects } from "@/lib/notion-projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotionContent from "@/components/NotionContent";
import { notionCoverSrc } from "@/lib/notion-image";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  const title = `${project.title} | Projects`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.description,
      images: project.cover ? [notionCoverSrc("project", project.id)] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: project.cover ? [notionCoverSrc("project", project.id)] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(resolvedParams.slug),
    getProjects(),
  ]);
  if (!project) notFound();

  const i = allProjects.findIndex((p) => p.slug === resolvedParams.slug);
  const prev = i > 0 ? allProjects[i - 1] : null;
  const next = i < allProjects.length - 1 ? allProjects[i + 1] : null;

  const blocks = await getProjectBlocks(project.id);

  const projectUrl = `https://jeff.itodyssey.io/projects/${project.slug}`;
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: project.cover ? `https://jeff.itodyssey.io${notionCoverSrc("project", project.id)}` : undefined,
    keywords: project.tags.length ? project.tags.join(", ") : undefined,
    codeRepository: project.githubUrl ?? undefined,
    author: {
      "@type": "Person",
      name: "Jeff Fontenot",
      url: "https://jeff.itodyssey.io",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <Header />
      <main>
        {/* Centered mini-hero */}
        <section className="relative overflow-hidden pt-28">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <Link
              href="/projects"
              className="my-5 inline-flex gap-2 text-sm text-yellow-400 hover:underline"
            >
              ← All projects
            </Link>
            <h1 className="my-5 text-4xl md:text-5xl font-bold tracking-tight leading-tight gradient-text">
              {project.title}
            </h1>
            {project.description && (
              <h3 className="mb-6 mx-auto text-xl max-w-2xl text-white/60 font-normal">
                {project.description}
              </h3>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.githubUrl && (
              <div className="mt-6">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-5 py-2 text-sm"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Cover */}
        {project.cover && (
          <div className={`mx-auto max-w-3xl px-4 ${project.githubUrl ? "mt-8" : "-mt-6"}`}>
            <div className="glass-container overflow-hidden">
              <Image
                src={notionCoverSrc("project", project.id)}
                alt={project.title}
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
          {blocks.length > 0 && (
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
                <NotionContent blocks={blocks} source="project" pageTitle={project.title} />
              </div>
            </article>
          )}

          {/* Prev / Next */}
          <nav className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              {prev && (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="glass-container glass-hover block p-4 hover:underline"
                >
                  <div className="text-xs text-white/50">← Newer</div>
                  <div className="mt-1 font-medium text-yellow-400">{prev.title}</div>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {next && (
                <Link
                  href={`/projects/${next.slug}`}
                  className="glass-container glass-hover block p-4 hover:underline"
                >
                  <div className="text-xs text-white/50">Older →</div>
                  <div className="mt-1 font-medium text-yellow-400">{next.title}</div>
                </Link>
              )}
            </div>
          </nav>

          <div className="h-10" />
        </section>
      </main>
      <Footer />
    </>
  );
}
