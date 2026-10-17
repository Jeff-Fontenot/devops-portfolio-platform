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
    <section className="relative min-h-[min(100vh,1050px)] flex items-center justify-center overflow-hidden pt-24">
      {/* Mobile Background Portrait */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/B&W_Ghost_Portrait.png"
          alt="Jeff Fontenot"
          fill
          priority
          className="object-cover opacity-25 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/70 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center"
        >
          {/* Left Column - Logo & Text Stack */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <motion.div variants={item} className="flex justify-center">
              <Image
                src="/Triquetra-Updated.png"
                alt="IT Odyssey Logo"
                width={500}
                height={500}
                priority
                className="h-36 md:h-44 w-auto"
              />
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="text-5xl md:text-7xl font-bold tracking-tight gradient-text leading-[1.05]"
            >
              Jeff Fontenot
            </motion.h1>

            {/* Title */}
            <motion.h2 variants={item} className="text-xl md:text-2xl font-medium text-white/80">
              Cloud&nbsp;&middot;&nbsp;DevOps&nbsp;&middot;&nbsp;Platform
            </motion.h2>

            {/* Subtitle/Description */}
            <motion.p
              variants={item}
              className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg mx-auto"
            >
              Building hands-on cloud infrastructure, automation, and observability
              projects with AWS, Terraform, Linux, Docker, and Kubernetes.
            </motion.p>

            <motion.p variants={item} className="text-2xl md:text-2xl lg:text-3xl font-semibold gradient-text">
              Active Secret Security Clearance
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/projects" className="btn-primary w-full sm:w-auto px-6 py-3">
                View Projects
              </Link>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto px-6 py-3"
              >
                Download Resume
              </a>
            </motion.div>
          </div>

          {/* Right Column - Desktop Portrait */}
          <motion.div
            variants={item}
            className="hidden md:flex justify-center items-center"
          >
            <div className="relative w-96 h-96 lg:w-[500px] lg:h-[600px]">
              <Image
                src="/B&W_Ghost_Portrait.png"
                alt="Jeff Fontenot"
                fill
                priority
                className="object-cover rounded-2xl opacity-60 filter grayscale shadow-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
