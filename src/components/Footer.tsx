import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#08090d]/60 backdrop-blur-md py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6 lg:px-8 sm:flex-row sm:justify-between">
        {/* Logo - Home Link */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/Triquetra-Logo.png" alt="IT Odyssey" className="h-10 w-auto" />
        </Link>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/Jeff-Fontenot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-sky-400 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jeff-fontenot/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-sky-400 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>

        {/* CTA Button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-4 py-2 text-sm"
        >
          Download Resume
        </a>
      </div>
      <div className="mt-8 text-center text-xs text-white/30">
        <p>&copy; {new Date().getFullYear()} Jeff Fontenot. All rights reserved.</p>
      </div>
    </footer>
  );
}
