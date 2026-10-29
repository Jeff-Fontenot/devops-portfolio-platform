"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { KeyRound, Mails, NotebookPen, ScanSearch, Siren, Workflow } from "lucide-react";

type Responsibility = {
  title: string;
  detail: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
};

const responsibilities: Responsibility[] = [
  {
    title: "Enterprise Troubleshooting",
    icon: ScanSearch,
    detail:
      "Resolve authentication, DNS, CAC certificate, proxy, domain-trust, endpoint, and hybrid identity issues within a mission-critical federal enterprise environment.",
  },
  {
    title: "Incident Operations",
    icon: Siren,
    detail:
      "Manage 20–30 support calls daily while investigating technical issues, maintaining detailed Remedy incident records, and escalating problems with clear troubleshooting context.",
  },
  {
    title: "Account Access & Authorization",
    icon: KeyRound,
    detail:
      "Review account status, attributes, OU placement, and group membership in Active Directory; restore deprovisioned accounts only after validating required documentation and authorization under established procedures.",
  },
  {
    title: "Hybrid Microsoft Services",
    icon: Mails,
    detail:
      "Troubleshoot Exchange Online and hybrid messaging issues, including SMTP proxy/target addresses, licensing, GAL visibility, and Azure AD Connect synchronization.",
  },
  {
    title: "Automation & Process Improvement",
    icon: Workflow,
    detail:
      "Built a menu-driven PowerShell prototype that consolidated recurring Active Directory support workflows, demonstrating opportunities for faster, more consistent incident handling.",
  },
  {
    title: "Documentation & Communication",
    icon: NotebookPen,
    detail:
      "Document troubleshooting procedures and clearly communicate technical findings, escalation context, and resolution steps to end users and internal support teams.",
  },
];

// The trace runs from the icon tile toward the heading like a bullet's lead:
// one jog up and back, then a via. Drawn on a 28x16 box.
const TRACE = "M0 8 H5 L9 4 H17 L21 8 H24";

// Intro: wait for the card's fade-in, then light each heading in turn. The
// hold covers the whole hover sequence (trace, then heading sweep).
const INTRO_DELAY_MS = 500;
const INTRO_STAGGER_MS = 260;
const INTRO_HOLD_MS = 1500;

// Lit styles are written out for both hover and the intro (data-lit), since
// Tailwind only generates classes it finds spelled out. The delays stage the
// sequence: the pulse runs the trace, passes the via, then sweeps the heading.
export default function Responsibilities() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [litItems, setLitItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers = responsibilities.flatMap((_, i) => {
      const start = INTRO_DELAY_MS + i * INTRO_STAGGER_MS;
      return [
        setTimeout(() => setLitItems((s) => new Set(s).add(i)), start),
        setTimeout(
          () =>
            setLitItems((s) => {
              const next = new Set(s);
              next.delete(i);
              return next;
            }),
          start + INTRO_HOLD_MS,
        ),
      ];
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, reduceMotion]);

  return (
    <ul ref={ref} className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {responsibilities.map(({ title, detail, icon: Icon }, i) => (
        <li key={title} data-lit={litItems.has(i) ? "" : undefined} className="group/resp flex">
          {/* Bullet: icon tile and its trace. Heading and body share one left edge after it. */}
          <div aria-hidden className="flex h-8 shrink-0 items-center">
            <span className="relative grid size-8 place-items-center rounded-lg border border-[rgba(36,175,245,0.3)] bg-[linear-gradient(160deg,#151a26,#0b0d13)] text-[#24aff5]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-[color,border-color,box-shadow] duration-300 group-hover/resp:border-[rgba(253,224,71,0.7)] group-hover/resp:text-[#fde047] group-hover/resp:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_22px_-3px_rgba(250,204,21,0.55)] group-data-[lit]/resp:border-[rgba(253,224,71,0.7)] group-data-[lit]/resp:text-[#fde047] group-data-[lit]/resp:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_22px_-3px_rgba(250,204,21,0.55)]">
              <Icon className="size-4" strokeWidth={1.6} aria-hidden />
              {/* Arrival pulse, as on the project-card diagram tiles. */}
              <span className="pointer-events-none absolute inset-[-1px] rounded-[inherit] border border-[#fde047] opacity-0 group-hover/resp:animate-[flow-ping_0.9s_ease-out] group-data-[lit]/resp:animate-[flow-ping_0.9s_ease-out] motion-reduce:hidden" />
            </span>
            <svg
              viewBox="0 0 28 16"
              className="h-4 w-7 overflow-visible"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={TRACE} stroke="rgba(36,175,245,0.45)" strokeWidth={1} />
              {/* Amber pulse: a short dash that runs the trace into the heading. */}
              <path
                d={TRACE}
                pathLength={100}
                stroke="#fde047"
                strokeWidth={1.5}
                strokeDasharray="30 100"
                strokeDashoffset={30}
                className="opacity-0 group-hover/resp:animate-[trace-pulse_0.45s_ease-in_forwards] group-data-[lit]/resp:animate-[trace-pulse_0.45s_ease-in_forwards] motion-reduce:hidden"
                style={{ filter: "drop-shadow(0 0 2px rgba(250,204,21,0.8))" }}
              />
              <circle
                cx={25.5}
                cy={8}
                r={1.75}
                className="fill-[#0b0d13] stroke-[rgba(36,175,245,0.6)] transition-colors duration-200 group-hover/resp:fill-[#fde047] group-hover/resp:stroke-[#fde047] group-hover/resp:delay-[350ms] group-data-[lit]/resp:fill-[#fde047] group-data-[lit]/resp:stroke-[#fde047] group-data-[lit]/resp:delay-[350ms] motion-reduce:delay-0"
              />
            </svg>
          </div>

          <div className="min-w-0 pl-2">
            {/* The pulse continues through the heading as a bright band
                sweeping the text left to right. */}
            <h4 className="mt-1.5 mb-1.5 bg-[linear-gradient(90deg,#facc15_0%,#facc15_42%,#fffbe0_50%,#facc15_58%,#facc15_100%)] bg-[length:250%_100%] bg-clip-text bg-[position:100%_0] text-sm leading-5 font-semibold text-transparent group-hover/resp:animate-[heading-sweep_0.85s_ease-out_0.4s_both] group-data-[lit]/resp:animate-[heading-sweep_0.85s_ease-out_0.4s_both] motion-reduce:animate-none">
              {title}
            </h4>
            <p className="text-sm leading-relaxed text-white/60">{detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
