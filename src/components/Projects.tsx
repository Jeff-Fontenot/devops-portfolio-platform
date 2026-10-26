"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Github, ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

// Fetches live data client-side, so its server-rendered skeleton never
// matches the client output — skip SSR entirely rather than fight a
// hydration mismatch.
const GitHubActivity = dynamic(() => import("./GitHubActivity"), { ssr: false });

// Same semantic palette as the homelab telemetry status dots (blue/yellow/gray
// rather than a traffic-light red/green scheme) so status reads consistently
// across the site. Matched by keyword since the status copy itself is
// free-form editorial text, not a fixed enum.
const STATUS_DOT_COLOR = {
  healthy: "#24aff5",
  warning: "#fde047",
  stale: "#8a8a92",
} as const;

function statusTone(status: string): keyof typeof STATUS_DOT_COLOR {
  const s = status.toLowerCase();
  if (s.includes("completed") || s.includes("operational")) return "healthy";
  if (s.includes("progress") || s.includes("hardening") || s.includes("development")) return "warning";
  return "stale";
}

const projects = [

  {
    title: "WakeTrail",
    status: "Pre-Release Hardening",
    description:
      "Designed a Go-based CLI that records engineering activity and correlates it with the infrastructure state changes that follow, creating a forensic timeline for troubleshooting and incident response. Captures Git context, command execution, and Docker state transitions into a local SQLite event store, with CI enforcing formatting, vetting, and test coverage on every push. Owned the architecture, feature design, testing, and QA, with AI-assisted implementation.",
    tech: ["Go", "Cobra", "SQLite", "Docker", "Git", "GitHub Actions"],
    repoUrl: "https://github.com/it-odyssey/waketrail",
    caseStudySlug: "waketrail",
    ci: {
      badge: "https://github.com/it-odyssey/waketrail/actions/workflows/ci.yml/badge.svg",
    },
  },

  {
    title: "Cloud-Native Homelab",
    status: "Operational",
    description:
      "Designed and built an integrated Proxmox platform for everyday services, application workloads, and infrastructure experimentation. Runs Docker Compose services alongside a three-node Kubernetes cluster, supported by private connectivity, DNS, TLS routing, centralized metrics and logs, and a custom operations dashboard. A Prometheus, Alloy, and Grafana Cloud pipeline publishes selected live host and Kubernetes telemetry directly to this portfolio.",
    tech: ["Linux", "Proxmox", "K3S", "Docker", "Traefik", "Tailscale", "Prometheus", "Grafana", "Git", "GitHub Actions"],
    repoUrl: "https://github.com/Jeff-Fontenot/homelab",
    caseStudySlug: "cloud-native-homelab",
    ci: {
      badge: "https://github.com/Jeff-Fontenot/homelab/actions/workflows/ci.yml/badge.svg",
    },
    cd: {
      badge: "https://github.com/Jeff-Fontenot/homelab/actions/workflows/cd.yml/badge.svg",
    },
  },

  {
    title: "Ops-Status: DevOps Lifecycle",
    status: "In-Progress",
    description:
      "A working FastAPI monitoring service built as the workload for an end-to-end DevOps lifecycle. Beginning with Docker Compose, the roadmap adds automated testing and CI/CD, then promotes the same versioned container through k3s staging into Terraform-managed AWS production with end-to-end observability.",
    tech: ["Docker Compose", "Python", "FastAPI"],
    repoUrl: "https://github.com/Jeff-Fontenot/ops-status",
    caseStudySlug: "ops-status",
  },

  {
    title: "Hybrid Cloud Disaster Recovery",
    status: "Completed",
    description:
      "Engineered a hybrid disaster-recovery solution for a containerized Flask/PostgreSQL application running on-prem in Proxmox, with hourly backups shipped to Amazon S3. A single terraform apply provisions AWS recovery infrastructure through an IAM instance profile and automatically restores the database, validated at roughly a 1-hour RPO and a 3:55 RTO.",
    tech: ["Terraform", "AWS", "EC2", "S3", "Docker", "PostgreSQL", "Flask"],
    repoUrl: "https://github.com/Jeff-Fontenot/d342-hybrid-cloud-disaster-recovery",
    caseStudySlug: "Hybrid-Cloud-Disaster-Recovery",
  },
];

export default function Projects() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </FadeIn>

        {/* Even 2x2 grid */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.08}>
              <div className="glass-container glass-hover flex h-full flex-col p-8">
                <div className="mb-3 flex flex-col items-start gap-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: STATUS_DOT_COLOR[statusTone(project.status)] }}
                        aria-hidden
                      />
                      {project.status}
                    </span>
                    {(project.ci || project.cd) && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        {project.ci && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.ci.badge}
                            alt="CI build status"
                            width={90}
                            height={20}
                            className="h-5 w-auto shrink-0"
                          />
                        )}
                        {project.cd && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.cd.badge}
                            alt="CD deployment status"
                            width={94}
                            height={20}
                            className="h-5 w-auto shrink-0"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5">
                  <Link
                    href={`/projects/${project.caseStudySlug}`}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    View Case Study
                    <ArrowRight size={14} className="ml-1.5" aria-hidden />
                  </Link>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <Github size={14} className="mr-1.5" aria-hidden />
                    View on GitHub
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={projects.length * 0.08} className="w-full">
          <GitHubActivity />
        </FadeIn>
      </div>
    </section>
  );
}
