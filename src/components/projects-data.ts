export type ProjectCard = {
  title: string;
  status: string;
  description: string;
  tech: string[];
  repoUrl: string;
  caseStudySlug: string;
  ci?: { badge: string };
  cd?: { badge: string };
};

export const projects: ProjectCard[] = [
  {
    title: "WakeTrail",
    status: "Pre-Release Hardening",
    description:
      "Cuts incident troubleshooting time by reconstructing a forensic timeline that correlates command execution with the Git, Docker, Kubernetes, and systemd state changes that follow it. Every push is gated by CI-enforced formatting, linting, and test coverage.",
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
      "Runs a self-hosted platform — a three-node Kubernetes cluster alongside Docker Compose services — behind private networking, TLS routing, and centralized logging. Selected Prometheus and Kubernetes telemetry streams live to this portfolio through a Grafana Cloud pipeline.",
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
      "A FastAPI monitoring service built as the test workload for an end-to-end DevOps lifecycle, starting from Docker Compose. The same versioned container is promoted through k3s staging into Terraform-managed AWS production with full observability.",
    tech: ["Docker Compose", "Python", "FastAPI"],
    repoUrl: "https://github.com/Jeff-Fontenot/ops-status",
    caseStudySlug: "ops-status",
  },

  {
    title: "Hybrid Cloud Disaster Recovery",
    status: "Completed",
    description:
      "Recovers a containerized Flask/PostgreSQL application from on-prem failure to running AWS infrastructure with a single terraform apply, validated at a 3:55 RTO against roughly a 1-hour RPO. Hourly backups ship automatically to S3 and restore through an IAM instance profile with no manual steps.",
    tech: ["Terraform", "AWS", "EC2", "S3", "Docker", "PostgreSQL", "Flask", "Bash"],
    repoUrl: "https://github.com/Jeff-Fontenot/d342-hybrid-cloud-disaster-recovery",
    caseStudySlug: "Hybrid-Cloud-Disaster-Recovery",
  },
];
