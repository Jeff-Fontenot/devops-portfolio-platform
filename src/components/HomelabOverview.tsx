"use client";

import dynamic from "next/dynamic";
import FadeIn from "./FadeIn";

// Fetches live data client-side, so its server-rendered skeleton never
// matches the client output — skip SSR entirely rather than fight a
// hydration mismatch.
const HomelabTelemetry = dynamic(() => import("./HomelabTelemetry"), { ssr: false });

export default function HomelabOverview() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Live <span className="gradient-text">Infrastructure</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            The architecture behind the projects above, and the live telemetry proving
            it&apos;s actually running.
          </p>
        </FadeIn>

        {/* Homelab Diagram */}
        <FadeIn className="w-full">
          <div className="glass-container p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Homelab Architecture</h3>
            <p className="text-white/70 leading-relaxed text-sm max-w-3xl mb-6">
              A visual breakdown of how it all connects. From my daily-driver laptop, over a
              private Tailscale network, to the Proxmox host running my services, desktops, and
              Kubernetes lab.
            </p>
            <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/diagrams/homelab-architecture.svg"
                alt="Homelab architecture diagram"
                width={1299}
                height={915}
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
          </div>
        </FadeIn>

        {/* Live Telemetry */}
        <FadeIn delay={0.1} className="w-full">
          <HomelabTelemetry />
        </FadeIn>
      </div>
    </section>
  );
}
