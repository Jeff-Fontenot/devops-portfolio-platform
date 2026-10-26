"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FadeIn from "./FadeIn";
import { skills } from "./skills";
import { projectsForSkill } from "@/lib/skill-projects";
import type { Skill } from "@/types/skills";

function SkillTile({ skill, delay }: { skill: Skill; delay: number }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const prefersReducedMotion = useReducedMotion();
  const usedIn = projectsForSkill(skill);

  return (
    <FadeIn delay={delay}>
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            buttonRef.current?.focus();
          }
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={popoverId}
          onClick={() => setOpen((o) => !o)}
          onFocus={() => setOpen(true)}
          className="glass-container glass-hover flex w-32 flex-col items-center gap-3 p-5 outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={skill.icon} alt={skill.name} className="h-10 w-10 object-contain" />
          <span className="text-center text-sm text-white/70">{skill.name}</span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={popoverId}
              role="group"
              aria-label={`Projects using ${skill.name}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0d0d12] p-3 text-left shadow-xl"
            >
              {usedIn.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {usedIn.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="block rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/5 hover:text-yellow-400"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-1.5 text-sm text-white/50">
                  Not yet used in a featured project.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

export default function Skills() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </FadeIn>

        {/* Skills Grid — 3 cols on phone, 5 on tablet+ so all 15 tiles land in
            even rows (5x3, 3x5) instead of leaving one stranded alone. */}
        <div className="grid w-full grid-cols-3 justify-items-center gap-4 md:grid-cols-5">
          {skills.map((skill, i) => (
            <SkillTile key={skill.name} skill={skill} delay={i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  );
}
