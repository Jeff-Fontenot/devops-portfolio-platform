import { Skill } from "@/types/skills";

// Add a new tool by adding an entry here and dropping its icon in /public/skills.
//
// Icon source: Simple Icons (https://simpleicons.org), fetched pre-colored as SVG via its CDN.
// Find a tool's slug on the site (or its data file at https://github.com/simple-icons/simple-icons),
// then, from the project root:
//   curl https://cdn.simpleicons.org/<slug> -o public/skills/<slug>.svg
// e.g. curl https://cdn.simpleicons.org/docker -o public/skills/docker.svg
//
// Simple Icons has no AWS, Azure, or Active Directory logo (cloud vendor marks were dropped for
// trademark reasons; AD itself never had a standalone logo), and no Loki icon either, so those
// four came from Iconify (https://iconify.design) instead, which aggregates several icon sets:
//   curl https://api.iconify.design/logos/aws.svg -o public/skills/aws.svg
//   curl https://api.iconify.design/logos/microsoft-azure.svg -o public/skills/azure.svg
//   curl https://api.iconify.design/selfhst/microsoft-entra-id.svg -o public/skills/activedirectory.svg
//   curl https://api.iconify.design/devicon/grafanaloki.svg -o public/skills/loki.svg
// (activedirectory.svg uses Microsoft's current Entra ID mark, the closest official identity icon.)
//
// aws-light.svg is aws.svg with its dark navy wordmark (#252f3e) recolored to a light
// gray (#e5e7eb) — the original is unreadable on this site's dark tiles.

export const skills: Skill[] = [
  { name: "Docker", icon: "/skills/docker.svg" },
  { name: "Terraform", icon: "/skills/terraform.svg" },
  { name: "Kubernetes", icon: "/skills/kubernetes.svg" },
  { name: "Git", icon: "/skills/git.svg" },
  { name: "Bash", icon: "/skills/gnubash.svg" },
  { name: "Python", icon: "/skills/python.svg" },
  { name: "Next.js", icon: "/skills/nextdotjs.svg" },
  { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg" }, 
  { name: "Traefik", icon: "/skills/traefikproxy.svg" },
  { name: "Prometheus", icon: "/skills/prometheus.svg" },
  { name: "Grafana", icon: "/skills/grafana.svg" },
  { name: "Proxmox", icon: "/skills/proxmox.svg" },
  { name: "Azure", icon: "/skills/azure.svg" },
//  { name: "Active Directory", icon: "/skills/activedirectory.svg" },
  { name: "Linux", icon: "/skills/linux.svg" },
  { name: "AWS", icon: "/skills/aws-light.svg" },

  // Not ready to claim these yet — uncomment as confidence builds.
  // { name: "Ansible", icon: "/skills/ansible.svg" },
  // { name: "Jenkins", icon: "/skills/jenkins.svg" },
  // { name: "GitHub Actions", icon: "/skills/githubactions.svg" },
  // { name: "Helm", icon: "/skills/helm.svg" },
  // { name: "Argo", icon: "/skills/argo.svg" },
  // { name: "Go", icon: "/skills/go.svg" },
  // { name: "OpenShift", icon: "/skills/openshift.svg" },
  // { name: "Loki", icon: "/skills/loki.svg" },
];
