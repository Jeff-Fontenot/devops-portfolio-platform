import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import { skills } from "@/components/skills";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import { projects as featuredProjects } from "@/components/projects-data";
import HomelabOverview from "@/components/HomelabOverview";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import MediaChannels from "@/components/MediaChannels";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProjects } from "@/lib/notion-projects";
import { buildSkillSourceProjects } from "@/lib/skill-projects";

export const revalidate = 300;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jeff Fontenot",
  url: "https://jeff.itodyssey.io",
  image: "https://jeff.itodyssey.io/opengraph-image.png",
  jobTitle: "Cloud & DevOps Engineer",
  email: "mailto:jeff@itodyssey.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Orleans",
    addressRegion: "LA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.linkedin.com/in/jeff-fontenot",
    "https://github.com/Jeff-Fontenot",
  ],
  knowsAbout: skills.map((skill) => skill.name),
};

export default async function Home() {
  // Skill tiles link to any project with a case study, not just the
  // homepage's featured four, so pull every published case study here too.
  const allCaseStudies = await getProjects();
  const skillSourceProjects = buildSkillSourceProjects(featuredProjects, allCaseStudies);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Projects />
        <HomelabOverview />
        <Experience />
        <Skills projects={skillSourceProjects} />
        <Certifications />
        <Education />
        {/* <MediaChannels /> */}
        <Contact />
        <Footer />
      </main>
    </>
  );
}