"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import FadeIn from "./FadeIn";

type LightboxImage = { src: string; alt: string };

const degrees = [
  {
    degree: (
      <>
        Bachelor of Science in
        <br />
        Cloud Computing
      </>
    ),
    school: "Western Governors University",
    meta: "Conferred August 2026",
    image: "/degrees/wgu-diploma.jpg",
  },
  {
    degree: "Associate of General Studies" as ReactNode,
    school: "Delgado Community College, New Orleans",
    meta: "2010 · 4.0 GPA Honor Graduate",
    image: "/degrees/delgado-diploma.jpg",
  },
];

function DegreeCard({
  degree,
  school,
  meta,
  image,
  onView,
  delay,
}: {
  degree: ReactNode;
  school: string;
  meta: string;
  image: string;
  onView: (item: LightboxImage) => void;
  delay: number;
}) {
  const alt = `${school} diploma`;

  return (
    <FadeIn delay={delay} className="lg:flex-1">
      <div className="glass-container glass-hover h-full p-6">
        <div className="flex h-full flex-col items-center gap-5 rounded-xl border-l-2 border-yellow-400/60 p-4 sm:flex-row sm:items-start">
          <button
            type="button"
            onClick={() => onView({ src: image, alt })}
            className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-colors hover:ring-yellow-300/40 sm:w-40"
            aria-label={`View ${alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={alt}
              className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
              <Maximize2 className="h-5 w-5 text-white" />
            </span>
          </button>

          <div className="text-center sm:text-left">
            <h4 className="mb-1 text-lg font-semibold leading-snug text-white">{degree}</h4>
            <p className="mb-1 accent-blue font-medium">{school}</p>
            <p className="text-sm text-white/60">{meta}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Education() {
  const [selected, setSelected] = useState<LightboxImage | null>(null);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Continuous <span className="gradient-text">Learning</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Combining formal education with hands-on experimentation and emerging technology
            exploration.
          </p>
        </FadeIn>

        {/* Main Content Layout - Two Equal Columns */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Formal Education */}
          <div className="flex flex-col gap-6 lg:h-full">
            {degrees.map((d, i) => (
              <DegreeCard key={d.school} {...d} onView={setSelected} delay={i * 0.08} />
            ))}
          </div>

          {/* Right Column - Learning Philosophy */}
          <FadeIn delay={0.1} className="h-full">
            <div className="glass-container h-full p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Beyond the Classroom</h3>

              <div className="space-y-5">
                <p className="text-white/70 leading-relaxed text-sm">
                  Finishing my B.S. in Cloud Computing at WGU opened the door to cloud-native
                  computing, but it didn&apos;t fully prepare me for the role I actually want.
                  I&apos;m a builder at heart, and I&apos;d rather engineer systems than
                  administer them.
                </p>

                <p className="text-white/70 leading-relaxed text-sm">
                  So I&apos;ve spent my time outside the service desk deliberately building
                  muscle memory with the tools WGU didn&apos;t teach: Terraform, Kubernetes,
                  Ansible, GitHub Actions. Every project on this site exists to close that gap
                  and move me from service desk support into a Cloud, DevOps, or Platform
                  Engineering role.
                </p>

                <div className="rounded-xl p-4 border-l-2 border-yellow-400/60">
                  <p className="text-white/80 italic mb-2 text-sm leading-relaxed">
                    {`"Every project on this page is practice for the job I haven't been hired for yet."`}
                  </p>
                  <p className="text-yellow-400 font-semibold text-sm">
                    Embrace The Journey.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {["Terraform", "Kubernetes", "Ansible", "GitHub Actions"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Homelab Diagram */}
        <FadeIn delay={0.15} className="w-full mt-6">
          <div className="glass-container p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Homelab Architecture</h3>
            <p className="text-white/70 leading-relaxed text-sm max-w-3xl mb-6">
              A visual breakdown of how it all connects. From my daily-driver laptop, over a
              private Tailscale network, to the Proxmox host running my services, desktops, and
              Kubernetes lab.
            </p>
            <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
              <picture>
                <source media="(min-width: 768px)" srcSet="/diagrams/homelab-architecture-wide.svg" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/diagrams/homelab-architecture-tall.svg"
                  alt="Homelab architecture diagram"
                  className="h-auto w-full"
                />
              </picture>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 text-white/70 transition-colors hover:text-white sm:right-6 sm:top-6"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.src}
            alt={selected.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] rounded-lg shadow-2xl ring-1 ring-white/10"
          />
        </div>
      )}
    </section>
  );
}
