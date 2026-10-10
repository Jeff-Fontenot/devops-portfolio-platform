import Image from "next/image";
import Link from "next/link";
import { Youtube, Rss, Newspaper, Play } from "lucide-react";
import FadeIn from "./FadeIn";
import { getLatestVideo } from "@/lib/youtube";
import { getPostsWithPreviews } from "@/lib/notion";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Jeff-fontenot";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MediaChannels() {
  const [video, posts] = await Promise.all([
    getLatestVideo(),
    getPostsWithPreviews(),
  ]);
  const latestPost = posts[0] ?? null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Media <span className="gradient-text">Channels</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Where I share what I&apos;m building and learning, in video and in writing.
          </p>
        </FadeIn>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* YouTube */}
          <FadeIn>
            <Link
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-container glass-hover group flex h-full flex-col overflow-hidden"
            >
              {video ? (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-12 w-12 text-white" fill="white" />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-white/[0.03]">
                  <Youtube size={40} className="text-white/20" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-6">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide accent-blue">
                  <Youtube size={14} />
                  YouTube
                </div>
                {video ? (
                  <>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-yellow-300">
                      {video.title}
                    </h3>
                    <p className="mt-auto text-sm text-white/50">
                      {formatDate(video.publishedAt)}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white">New videos coming soon</h3>
                    <p className="mt-auto text-sm text-white/50">
                      Subscribe to catch the first upload.
                    </p>
                  </>
                )}
              </div>
            </Link>
          </FadeIn>

          {/* Blog */}
          <FadeIn delay={0.08}>
            <Link
              href={latestPost ? `/blog/${latestPost.slug}` : "/blog"}
              className="glass-container glass-hover group flex h-full flex-col overflow-hidden"
            >
              {latestPost?.cover ? (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={latestPost.cover}
                    alt={latestPost.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-white/[0.03]">
                  <Rss size={40} className="text-white/20" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-6">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide accent-blue">
                  <Newspaper size={14} />
                  Blog
                </div>
                {latestPost ? (
                  <>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-yellow-300">
                      {latestPost.title}
                    </h3>
                    <p className="mt-auto text-sm text-white/50">
                      {formatDate(latestPost.date)}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white">New posts coming soon</h3>
                    <p className="mt-auto text-sm text-white/50">Check back soon.</p>
                  </>
                )}
              </div>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
