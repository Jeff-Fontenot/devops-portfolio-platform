import FadeIn from "./FadeIn";
import Responsibilities from "./Responsibilities";

export default function Experience() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </FadeIn>

        {/* Experience Card */}
        <FadeIn className="glass-container w-full p-8 md:p-10">
          {/* Job Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-1.5">
              Enterprise Service Desk Analyst
            </h3>
            <p className="text-lg accent-blue mb-1">
              TEKsystems supporting Leidos &middot; Marine Corps Enterprise Network
            </p>
            <p className="text-white/50 text-sm">Jan 2025 – Present</p>
          </div>

          {/* Security Clearance */}
          <div className="mb-6">
            <p className="text-lg text-yellow-400 mb-1">Active Secret Security Clearance</p>
          </div>

          {/* Environment */}
          <div className="mb-6 pt-4 border-t border-white/10">
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="font-semibold text-white">Environment: </span>
              Active Directory, Microsoft 365, Exchange Online, Intune, BMC Helix, CAC authentication,
              hybrid Microsoft services
            </p>
          </div>

          {/* Key Responsibilities */}
          <Responsibilities />
        </FadeIn>
      </div>
    </section>
  );
}
