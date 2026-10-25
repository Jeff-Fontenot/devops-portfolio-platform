"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [inHero, setInHero] = useState(() => pathname === "/");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroEl = document.getElementById("hero");

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (heroEl) {
        const headerHeight = headerRef.current?.offsetHeight ?? 80;
        setInHero(heroEl.getBoundingClientRect().bottom > headerHeight);
      } else {
        setInHero(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[#08090d]/80 border-b border-white/10"
          : "backdrop-blur-sm bg-[#08090d]/20 border-b border-transparent"
      }`}
    >
      <div className="flex w-full items-center justify-between py-[5px] pl-6 pr-4 font-medium text-white sm:pl-10 sm:pr-6 lg:pl-16 lg:pr-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image
            src="/logo-name-lockup.png"
            alt="Jeff Fontenot"
            width={2172}
            height={724}
            priority
            className="h-[88px] md:h-[104px] w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden md:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-[21px] rounded-full transition-colors ${
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
        </motion.nav>

        {/* Desktop CTA Button */}
        <AnimatePresence initial={false}>
          {!inHero && (
            <motion.div
              key="cta"
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden md:block"
            >
              <a
                href="/Jeffrey_Fontenot_Cloud_DevOps_Engineer_Resume_Download.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex px-4 py-2 text-sm"
              >
                Download Resume
              </a>
            </motion.div>
          )}
        </AnimatePresence>

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
