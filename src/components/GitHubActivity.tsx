"use client";

import { useEffect, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import { Github } from "lucide-react";

const GITHUB_USERNAME = "Jeff-Fontenot";

// Blue theme sampled from the triquetra logo's knotwork (dark navy through
// its bright cyan highlight) — low → high activity.
const calendarTheme = {
  dark: ["#11161d", "#123a63", "#1f5fa8", "#3394e5", "#8be9ff"],
};

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

      <div ref={wrapperRef} className="overflow-x-auto">
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
    </div>
  );
}
