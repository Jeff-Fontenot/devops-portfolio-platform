import FadeIn from "./FadeIn";

const responsibilities = [
  {
    title: "Enterprise Troubleshooting",
    detail:
      "Resolve authentication, DNS, CAC certificate, proxy, domain-trust, endpoint, and hybrid identity issues within a mission-critical federal enterprise environment.",
  },
  {
    title: "Incident Operations",
    detail:
      "Manage 20–30 support calls daily while investigating technical issues, maintaining detailed Remedy incident records, and escalating problems with clear troubleshooting context.",
  },
  {
    title: "Account Access & Authorization",
    detail:
      "Review account status, attributes, OU placement, and group membership in Active Directory; restore deprovisioned accounts only after validating required documentation and authorization under established procedures.",
  },
  {
    title: "Hybrid Microsoft Services",
    detail:
      "Troubleshoot Exchange Online and hybrid messaging issues, including SMTP proxy/target addresses, licensing, GAL visibility, and Azure AD Connect synchronization.",
  },
  {
    title: "Automation & Process Improvement",
    detail:
      "Built a menu-driven PowerShell prototype that consolidated recurring Active Directory support workflows, demonstrating opportunities for faster, more consistent incident handling.",
  },
  {
    title: "Documentation & Communication",
    detail:
      "Document troubleshooting procedures and clearly communicate technical findings, escalation context, and resolution steps to end users and internal support teams.",
  },
];

export default function Experience() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Building expertise in enterprise cloud infrastructure and hybrid environments.
          </p>
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
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {responsibilities.map((r) => (
              <div key={r.title}>
                <p className="text-sm font-semibold text-yellow-400 mb-1">{r.title}</p>
                <p className="text-sm text-white/60 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
