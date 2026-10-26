import type { ProjectCard } from "@/components/projects-data";
import type { Project } from "@/lib/notion-projects";
import type { Skill } from "@/types/skills";

export type SkillProjectLink = { title: string; slug: string };
export type SkillSourceProject = { title: string; slug: string; tech: string[] };

// Tag spellings that don't literally match a skill's display name but should
// still count (e.g. the homelab is tagged "K3S", a Kubernetes distro, not
// "Kubernetes").
const SKILL_ALIASES: Record<string, string[]> = {
  Kubernetes: ["K3S"],
};

// Every project with a case study, not just the homepage's featured four, so
// a skill tile can point to any of them. The featured four keep their
// curated `tech` list (richer than their Notion tags); the rest fall back to
// their Notion tags, deduped by slug so a featured project never appears twice.
export function buildSkillSourceProjects(
  featured: ProjectCard[],
  allCaseStudies: Project[]
): SkillSourceProject[] {
  const featuredSlugs = new Set(featured.map((p) => p.caseStudySlug.toLowerCase()));

  const rest = allCaseStudies
    .filter((p) => !featuredSlugs.has(p.slug.toLowerCase()))
    .map((p) => ({ title: p.title, slug: p.slug, tech: p.tags }));

  return [
    ...featured.map((p) => ({ title: p.title, slug: p.caseStudySlug.toLowerCase(), tech: p.tech })),
    ...rest,
  ];
}

export function projectsForSkill(skill: Skill, projects: SkillSourceProject[]): SkillProjectLink[] {
  const needles = [skill.name, ...(SKILL_ALIASES[skill.name] ?? [])].map((s) => s.toLowerCase());

  return projects
    .filter((project) =>
      project.tech.some((tag) => {
        const t = tag.toLowerCase();
        return needles.some((n) => t.includes(n) || n.includes(t));
      })
    )
    .map((project) => ({ title: project.title, slug: project.slug }));
}
