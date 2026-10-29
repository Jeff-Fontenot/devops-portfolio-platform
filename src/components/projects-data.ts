import {
  Archive,
  BadgeCheck,
  Cloud,
  Code,
  Container,
  Database,
  DatabaseBackup,
  FileCode,
  FileText,
  Flame,
  FlaskConical,
  Funnel,
  Gauge,
  History,
  Package,
  Radar,
  Server,
  ServerCog,
  ShieldCheck,
  ShipWheel,
  Terminal,
  Waypoints,
} from "lucide-react";
import type { FlowDiagramData } from "./FlowDiagram";

export type ProjectCard = {
  title: string;
  status: string;
  description: string;
  tech: string[];
  repoUrl: string;
  caseStudySlug: string;
  ci?: { badge: string };
  cd?: { badge: string };
  flow?: FlowDiagramData;
};

export const projects: ProjectCard[] = [
  {
    title: "WakeTrail",
    status: "Pre-Release Hardening",
    description:
      "Helps reconstruct incidents by building a forensic timeline that correlates command execution with the Git, Docker, Kubernetes, and systemd state changes that follow it. Every push is gated by CI-enforced formatting, linting, and test coverage.",
    tech: ["Go", "Cobra", "SQLite", "Docker", "Git", "GitHub Actions"],
    repoUrl: "https://github.com/it-odyssey/waketrail",
    caseStudySlug: "waketrail",
    ci: {
      badge: "https://github.com/it-odyssey/waketrail/actions/workflows/ci.yml/badge.svg",
    },
    // Mirrors the recorder pipeline: the Bash hook and resource collectors both
    // pass through capture policy and redaction before SQLite, and the shared
    // timeline builder feeds both `show` and `export`.
    flow: {
      nodes: [
        { id: "hook", label: "Bash hook", detail: "exit · cwd · git", icon: Terminal, x: 21, y: 28 },
        { id: "collectors", label: "Collectors", detail: "docker · k8s · systemd", icon: Radar, x: 21, y: 72 },
        { id: "redact", label: "Redact", detail: "capture policy", icon: ShieldCheck, x: 52, y: 50 },
        { id: "store", label: "SQLite", detail: "local store", icon: Database, x: 80, y: 50 },
        { id: "correlate", label: "Correlate", detail: "cmd + change", icon: Waypoints, x: 110, y: 50 },
        { id: "show", label: "Timeline", detail: "waketrail show", icon: History, x: 144, y: 28 },
        { id: "export", label: "Export", detail: "markdown", icon: FileText, x: 144, y: 72 },
      ],
      edges: [
        { from: "hook", to: "redact" },
        { from: "collectors", to: "redact" },
        { from: "redact", to: "store" },
        { from: "store", to: "correlate" },
        { from: "correlate", to: "show" },
        { from: "correlate", to: "export" },
      ],
      groups: [
        { label: "waketrail core", x: 38, y: 34, w: 90, h: 41, nodes: ["redact", "store", "correlate"] },
      ],
      description:
        "WakeTrail records shell commands and Docker, Kubernetes, systemd, and Terraform changes, redacts them into a local SQLite store, and correlates them into one timeline shown in the terminal or exported as Markdown.",
    },
  },

  {
    title: "Cloud-Native Homelab",
    status: "Operational",
    description:
      "Runs a self-hosted platform (a three-node Kubernetes cluster alongside Docker Compose services) behind private networking, TLS routing, and centralized logging. Selected Prometheus and Kubernetes telemetry streams live to this portfolio through a Grafana Cloud pipeline.",
    tech: ["Linux", "Proxmox", "K3S", "Docker", "Traefik", "Tailscale", "Prometheus", "Grafana", "Git", "GitHub Actions"],
    repoUrl: "https://github.com/Jeff-Fontenot/homelab",
    caseStudySlug: "cloud-native-homelab",
    ci: {
      badge: "https://github.com/Jeff-Fontenot/homelab/actions/workflows/ci.yml/badge.svg",
    },
    cd: {
      badge: "https://github.com/Jeff-Fontenot/homelab/actions/workflows/cd.yml/badge.svg",
    },
    // The public telemetry path: Prometheus scrapes the hypervisor, containers
    // and cluster, recording rules reduce them to aggregate portfolio:* series,
    // and Alloy federates only those and pushes them out to Grafana Cloud.
    flow: {
      nodes: [
        { id: "proxmox", label: "Proxmox", detail: "pve-exporter", icon: Server, x: 18, y: 18 },
        { id: "docker", label: "Docker", detail: "cAdvisor", icon: Container, x: 18, y: 50 },
        { id: "k3s", label: "k3s", detail: "kube-state", icon: ShipWheel, x: 18, y: 82 },
        { id: "prometheus", label: "Prometheus", detail: "portfolio:* rules", icon: Flame, x: 52, y: 50 },
        { id: "alloy", label: "Alloy", detail: "federate", icon: Funnel, x: 82, y: 50 },
        { id: "grafana", label: "Grafana", detail: "cloud", icon: Cloud, x: 110, y: 50 },
        { id: "portfolio", label: "Portfolio", detail: "live telemetry", icon: Gauge, x: 142, y: 50 },
      ],
      edges: [
        { from: "proxmox", to: "prometheus" },
        { from: "docker", to: "prometheus" },
        { from: "k3s", to: "prometheus" },
        { from: "prometheus", to: "alloy" },
        { from: "alloy", to: "grafana" },
        { from: "grafana", to: "portfolio" },
      ],
      groups: [{ label: "services vm", x: 32, y: 34, w: 64, h: 41, nodes: ["prometheus", "alloy"] }],
      description:
        "Prometheus on the homelab services VM scrapes the Proxmox host, Docker containers, and the k3s cluster into aggregate portfolio metrics, which Grafana Alloy forwards to Grafana Cloud for this site's live telemetry card.",
    },
  },

  {
    title: "Ops-Status: DevOps Lifecycle",
    status: "In-Progress",
    description:
      "A FastAPI monitoring service built as the test workload for an end-to-end DevOps lifecycle. It runs on Docker Compose today; the plan is to promote the same versioned container through k3s staging into Terraform-managed AWS production with full observability.",
    tech: ["Docker Compose", "Python", "FastAPI"],
    repoUrl: "https://github.com/Jeff-Fontenot/ops-status",
    caseStudySlug: "ops-status",
    // One image, promoted in order. Only the app, the locally built image and
    // Compose exist today, so only that path animates; CI, k3s staging and
    // AWS are drawn as planned, with still, dashed wires.
    flow: {
      nodes: [
        { id: "app", label: "FastAPI", detail: "/health · /checks", icon: Code, x: 18, y: 50 },
        { id: "ci", label: "CI", detail: "tests · planned", icon: FlaskConical, planned: true, x: 50, y: 20 },
        { id: "image", label: "Image", detail: "built once", icon: Package, x: 82, y: 50 },
        { id: "compose", label: "Compose", detail: "local", icon: Container, x: 136, y: 18 },
        { id: "k3s", label: "k3s", detail: "staging · planned", icon: ShipWheel, planned: true, x: 136, y: 50 },
        { id: "aws", label: "AWS", detail: "fargate · planned", icon: Cloud, planned: true, x: 136, y: 82 },
      ],
      edges: [
        { from: "app", to: "image" },
        { from: "app", to: "ci" },
        { from: "ci", to: "image" },
        { from: "image", to: "compose" },
        { from: "image", to: "k3s" },
        { from: "image", to: "aws" },
      ],
      description:
        "The Ops-Status FastAPI service is built locally into a versioned container image that runs on Docker Compose today, while a CI test gate, k3s staging, and AWS Fargate production are planned but not yet built.",
    },
  },

  {
    title: "Hybrid Cloud Disaster Recovery",
    status: "Completed",
    description:
      "Recovers a containerized Flask/PostgreSQL application from on-prem failure to running AWS infrastructure with a single terraform apply, validated at a 3:55 RTO against roughly a 1-hour RPO. Hourly backups ship automatically to S3 and restore through an IAM instance profile with no manual steps.",
    tech: ["Terraform", "AWS", "EC2", "S3", "Docker", "PostgreSQL", "Flask", "Bash"],
    repoUrl: "https://github.com/Jeff-Fontenot/d342-hybrid-cloud-disaster-recovery",
    caseStudySlug: "Hybrid-Cloud-Disaster-Recovery",
    // Backup runs continuously; recovery starts on demand. Steps are ordered by
    // hand so the story reads backup first, then provision, restore, verify.
    flow: {
      nodes: [
        { id: "onprem", label: "Orders", detail: "flask · postgres", icon: Server, x: 18, y: 26 },
        { id: "dump", label: "pg_dump", detail: "hourly · gzip", icon: DatabaseBackup, x: 50, y: 26 },
        { id: "s3", label: "S3", detail: "offsite backups", icon: Archive, x: 80, y: 26 },
        { id: "terraform", label: "Terraform", detail: "apply on demand", icon: FileCode, x: 50, y: 76 },
        { id: "ec2", label: "EC2", detail: "restore latest", icon: ServerCog, x: 110, y: 52 },
        { id: "verified", label: "Verified", detail: "RTO 3:55", icon: BadgeCheck, x: 140, y: 52 },
      ],
      edges: [
        { from: "onprem", to: "dump" },
        { from: "dump", to: "s3" },
        { from: "terraform", to: "ec2" },
        { from: "s3", to: "ec2" },
        { from: "ec2", to: "verified" },
      ],
      steps: [
        [["onprem", "dump"]],
        [["dump", "s3"]],
        [["terraform", "ec2"]],
        [["s3", "ec2"]],
        [["ec2", "verified"]],
      ],
      groups: [
        { label: "on-prem", x: 3, y: 11, w: 60, h: 33, nodes: ["onprem", "dump"] },
        { label: "aws", x: 66, y: 11, w: 90, h: 59, nodes: ["s3", "ec2", "verified"] },
      ],
      description:
        "Hourly pg_dump backups of the on-premises order app ship to Amazon S3, and after an outage terraform apply builds an EC2 instance that restores the latest backup and was verified healthy in 3 minutes 55 seconds.",
    },
  },
];
