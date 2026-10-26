import { projects } from "@/components/projects-data";
import type { Skill } from "@/types/skills";

export type SkillProjectLink = { title: string; slug: string };

// Tag spellings that don't literally match a skill's display name but should
// still count (e.g. the homelab is tagged "K3S", a Kubernetes distro, not
// "Kubernetes").
const SKILL_ALIASES: Record<string, string[]> = {
  Kubernetes: ["K3S"],
};

export function projectsForSkill(skill: Skill): SkillProjectLink[] {
  const needles = [skill.name, ...(SKILL_ALIASES[skill.name] ?? [])].map((s) => s.toLowerCase());

  return projects
    .filter((project) =>
      project.tech.some((tag) => {
        const t = tag.toLowerCase();
        return needles.some((n) => t.includes(n) || n.includes(t));
      })
    )
    .map((project) => ({ title: project.title, slug: project.caseStudySlug }));
}
