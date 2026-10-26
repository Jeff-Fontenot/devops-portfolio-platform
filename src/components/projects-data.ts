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
