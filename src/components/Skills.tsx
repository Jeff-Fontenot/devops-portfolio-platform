import FadeIn from "./FadeIn";
import { skills } from "./skills";

export default function Skills() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Technical <span className="gradient-text">Skills</span>
          </h2>
        </FadeIn>

        {/* Skills Grid */}
        <div className="flex w-full flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <FadeIn key={skill.name} delay={i * 0.04}>
              <div className="glass-container glass-hover flex w-32 flex-col items-center gap-3 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={skill.icon} alt={skill.name} className="h-10 w-10 object-contain" />
                <span className="text-center text-sm text-white/70">{skill.name}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
