"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[#08090d]/80 border-b border-white/10"
          : "backdrop-blur-sm bg-[#08090d]/20 border-b border-transparent"
      }`}
    >
      <div className="flex justify-center py-3">
        <div className="max-w-6xl flex justify-between items-center px-4 sm:px-6 lg:px-8 font-medium text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <img
              src="/Triquetra-Logo.png"
              alt="IT Odyssey"
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm rounded-full transition-colors ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-yellow-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <a
            href="/Jeffrey_Fontenot_Cloud_DevOps_Engineer_Resume_Download.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary hidden md:inline-flex px-4 py-2 text-sm"
          >
            Download Resume
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out bg-[#08090d]/95 backdrop-blur-md border-t border-white/10 ${
          isMenuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block text-white/70 hover:text-white transition-colors py-2 text-sm"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Jeffrey_Fontenot_Cloud_DevOps_Engineer_Resume_Download.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex mt-2 px-4 py-2 text-sm"
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}
