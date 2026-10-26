"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[min(100vh,900px)] flex items-center justify-center overflow-x-hidden pt-24">
      {/* Mobile Background Portrait */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/B&W_Ghost_Portrait.png"
          alt="Jeff Fontenot"
          fill
          priority
          fetchPriority="high"
          className="object-cover opacity-25 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/70 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full pl-6 pr-4 sm:pl-10 sm:pr-6 lg:pl-16 lg:pr-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center"
        >
          {/* Left Column - Text Stack */}
          <div className="text-left space-y-8">
            {/* Title */}
            <motion.h1
              variants={item}
              className="py-4 font-extrabold tracking-tight leading-[1.05]"
            >
              <span className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-x-2 sm:gap-y-1 text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                  </span>
                  Cloud &amp; DevOps Engineer
                </span>
                {/* Below sm, these two stack on their own lines, so the
                    separator is dropped rather than left dangling alone. */}
                <span aria-hidden="true" className="hidden sm:inline">&middot;</span>
                <span className="whitespace-nowrap">Active Secret Clearance</span>
              </span>
              <span className="block text-white text-[clamp(1.9rem,9.5vw,4.5rem)] md:text-[clamp(2.2rem,5vw,7rem)]">
                I Build Systems.
              </span>
              <span className="block gradient-text whitespace-nowrap text-[clamp(1.5rem,7.3vw,3.5rem)] md:text-[clamp(1.75rem,3.9vw,5.5rem)]">
                Then Prove They Work.
              </span>
            </motion.h1>

            {/* Subtitle/Description */}
            <motion.p
              variants={item}
              className="text-base md:text-lg text-white/80 leading-relaxed max-w-lg"
            >
              I&apos;m Jeff. I build infrastructure, automate the repetitive parts, and document what I learn along the way. The best way to understand a system? Get your hands on it.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-2"
            >
              <Link href="/projects" className="btn-primary w-full sm:w-auto px-6 py-2.5">
                View Projects
              </Link>

              <a
                href="/Jeffrey_Fontenot_Cloud_DevOps_Engineer_Resume_Download.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto px-6 py-2.5"
              >
                Download Resume
              </a>
            </motion.div>

            <motion.p
              variants={item}
              className="text-xs uppercase tracking-[0.1em] text-white/50"
            >
              Open to Cloud &amp; DevOps roles
            </motion.p>
          </div>

          {/* Right Column - Desktop Portrait */}
          <motion.div
            variants={item}
            className="hidden md:flex justify-center items-center"
          >
            <div className="relative w-96 h-96 lg:w-[500px] lg:h-[600px]">
              {/* Restrained cyan glow behind the shoulders */}
              <div
                aria-hidden
                className="absolute -left-16 -right-16 top-[42%] bottom-[-10%] rounded-[50%] bg-cyan-400/10 blur-[100px]"
              />
              <Image
                src="/B&W_Ghost_Portrait.png"
                alt="Jeff Fontenot"
                fill
                priority
                fetchPriority="high"
                className="object-cover rounded-2xl opacity-80 filter grayscale shadow-2xl"
                style={{
                  maskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-6 right-6 text-right">
                <div className="mb-2 ml-auto h-px w-10 bg-amber-400/70" />
                <p className="text-sm font-semibold text-white">Jeff Fontenot</p>
                <p className="text-xs uppercase tracking-[0.1em] text-white/50">
                  The human behind the systems
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
