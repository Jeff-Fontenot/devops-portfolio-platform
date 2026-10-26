import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import FadeIn from "./FadeIn";

export default function Contact() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/60">
            Open to Cloud, DevOps, and Platform Engineering roles — remote friendly, with an
            active Secret security clearance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:jeff@itodyssey.io" className="btn-primary px-6 py-3">
              <Mail className="mr-2 h-4 w-4" />
              Email Me
            </a>
            <Link
              href="https://www.linkedin.com/in/jeff-fontenot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6 py-3"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Link>
            <Link
              href="https://github.com/Jeff-Fontenot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6 py-3"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
