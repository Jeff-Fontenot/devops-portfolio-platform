"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import FadeIn from "./FadeIn";

// Both fetch live data client-side, so their server-rendered skeleton never
// matches the client output — skip SSR for them entirely rather than fight
// a hydration mismatch.
const HomelabTelemetry = dynamic(() => import("./HomelabTelemetry"), { ssr: false });
const GitHubActivity = dynamic(() => import("./GitHubActivity"), { ssr: false });

const projects = [
  {
    title: "Ops-Status: Cloud-Native Service Monitoring",
    Status: "in-progress",
    description:
      "An evolving FastAPI service designed to monitor homelab availability, health, and response time. The working API is containerized with Docker and Compose, with the delivery roadmap extending through automated testing, GitHub Actions CI/CD, k3s deployment, and Prometheus/Grafana observability.",
    tech: ["Docker Compose", "Python", "FastAPI"],
    link: "https://github.com/Jeff-Fontenot",
    span: "md:col-span-2",
  },
  {
    title: "WakeTrail",
    Status: "in-progress",
    description:
      "Built a Go-based CLI that records engineering activity and correlates it with the infrastructure state changes that follow, creating a forensic timeline for troubleshooting and incident response. Captures Git context, command execution, and Docker state transitions into a local SQLite event store, with CI enforcing formatting, vetting, and test coverage on every push.",
    tech: ["Go", "Cobra", "SQLite", "Docker", "Git", "GitHub Actions"],
    link: "https://github.com/it-odyssey/waketrail",
    span: "md:col-span-3",
    ci: {
      badge: "https://github.com/it-odyssey/waketrail/actions/workflows/ci.yml/badge.svg",
    },
  },
  {
    title: "Hybrid Cloud Disaster Recovery",
    Status: "completed",
    description:
      "Engineered a hybrid disaster-recovery solution for a containerized Flask/PostgreSQL application running on-prem in Proxmox, with hourly backups shipped to Amazon S3. A single terraform apply provisions AWS recovery infrastructure through an IAM instance profile and automatically restores the database, validated at roughly a 1-hour RPO and a 3:55 RTO.",
    tech: ["Terraform", "AWS", "EC2", "S3", "Docker", "PostgreSQL", "Flask"],
    link: "https://github.com/Jeff-Fontenot/d342-hybrid-cloud-disaster-recovery",
    span: "md:col-span-3",
  },
  {
    title: "Menu-Based PowerShell Automation",
    Status: "completed",
    description:
      "Built a PowerShell tool that queries Active Directory to give service desk analysts a ticket-ready summary of user, workstation, and printer details from one menu, replacing repeated lookups across several admin screens. Tiered search (exact, prefix, contains) with an interactive picker for ambiguous matches. Ran with read-only access and reached at least 12 analysts.",
    tech: ["PowerShell", "Active Directory"],
    link: "https://github.com/Jeff-Fontenot/ESD_Summary_Tool.git",
    span: "md:col-span-2",
  },
];

export default function Projects() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            A selection of personal and professional projects that highlight my skills in
            cloud computing, DevOps, and web development.
          </p>
        </FadeIn>

        {/* Bento Grid Layout */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-5">
          {projects.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.08} className={project.span}>
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} repository`}
                className="glass-container glass-hover group block h-full cursor-pointer p-8"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-yellow-300">
                    {project.title}
                  </h3>
                  {project.ci && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.ci.badge} alt="CI build status" className="h-5" />
                  )}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 transition-colors group-hover:border-yellow-300/30 group-hover:text-yellow-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={projects.length * 0.08} className="w-full">
          <HomelabTelemetry />
        </FadeIn>

        <FadeIn delay={(projects.length + 1) * 0.08} className="w-full">
          <GitHubActivity />
        </FadeIn>
      </div>
    </section>
  );
}
