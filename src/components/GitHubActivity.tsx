"use client";

import { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import { Github } from "lucide-react";

const GITHUB_USERNAME = "Jeff-Fontenot";

// Blue theme sampled from the triquetra logo's knotwork (dark navy through
// its bright cyan highlight) — low → high activity.
const calendarTheme = {
  dark: ["#11161d", "#123a63", "#1f5fa8", "#3394e5", "#8be9ff"],
};

// Same sampled blues, reused for the top-languages bars so the two widgets
// read as one palette.
const LANGUAGE_BAR_COLORS = ["#8be9ff", "#3394e5", "#1f5fa8", "#123a63"];

type LanguageTally = { name: string; count: number };
type RepoListItem = { language: string | null; fork: boolean };

// react-github-calendar renders its own scrollable element internally
// (`.react-activity-calendar__scroll-container`, inside the <article> root);
// the calendar itself is capped to its parent's width via `max-width: 100%`
// and never overflows our own wrapper div below. So the scroll position that
// actually needs to move is on that inner element, not ours.
//
// Note: react-github-calendar only forwards its `ref` prop to <article> once
// real data has loaded — during the loading-skeleton phase it's dropped
// entirely. So we can't rely on a ref into the calendar itself; instead we
// watch our own wrapper div, which is always present from first mount.
const INNER_SCROLL_SELECTOR = ".react-activity-calendar__scroll-container";

export default function GitHubActivity() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [languages, setLanguages] = useState<LanguageTally[] | null>(null);

  // Tallies primary language across public, non-fork repos (one list call,
  // no per-repo language-bytes lookups) to fill the dead space beside the
  // calendar on wide screens. Left null — and the rail stays hidden — on any
  // failure or empty result rather than rendering a broken/empty state.
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`)
      .then((res) => (res.ok ? (res.json() as Promise<RepoListItem[]>) : Promise.reject()))
      .then((repos) => {
        if (cancelled || !Array.isArray(repos)) return;
        const counts = new Map<string, number>();
        for (const repo of repos) {
          if (repo.fork || !repo.language) continue;
          counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
        }
        const tally = [...counts.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
        if (tally.length > 0) setLanguages(tally);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;

    // The calendar fetches its data async, replacing a loading skeleton with
    // the full year of columns. Each time that happens, jump the inner
    // scroll container to its far edge so narrow viewports land on the
    // newest — and typically most active — weeks instead of the oldest.
    const scrollToNewest = () => {
      const inner = wrapperEl.querySelector<HTMLElement>(INNER_SCROLL_SELECTOR);
      if (inner) inner.scrollLeft = inner.scrollWidth;
    };

    scrollToNewest();
    const observer = new MutationObserver(scrollToNewest);
    observer.observe(wrapperEl, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div id="github-activity" className="glass-container mt-8 w-full p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Github size={20} className="text-white/70" />
          <h3 className="text-lg font-semibold text-white">GitHub Activity</h3>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/50 transition-colors hover:text-yellow-300"
        >
          @{GITHUB_USERNAME}
        </a>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div ref={wrapperRef} className="min-w-0 flex-1 overflow-x-auto">
          <GitHubCalendar
            username={GITHUB_USERNAME}
            colorScheme="dark"
            theme={calendarTheme}
            fontSize={12}
            blockSize={11}
            blockMargin={4}
            errorMessage="Couldn't load GitHub activity right now."
          />
        </div>

        {languages && (
          <div className="hidden shrink-0 flex-col justify-center gap-3 border-white/10 md:flex md:w-44 md:border-l md:pl-6">
            <span className="text-xs font-medium tracking-wide text-white/50 uppercase">
              Top Languages
            </span>
            {languages.map((lang, i) => (
              <div key={lang.name} className="flex flex-col gap-1.5">
                <span className="text-sm text-white/80">{lang.name}</span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((lang.count / languages[0].count) * 100, 12)}%`,
                      backgroundColor: LANGUAGE_BAR_COLORS[i % LANGUAGE_BAR_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
