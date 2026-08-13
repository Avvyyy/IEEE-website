"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/lib/types";
import { InstagramGlyph, LinkedInGlyph, XGlyph } from "@/components/icons/SocialGlyphs";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/axis-congress", label: "AXIS Congress" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ site }: { site: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-4 sm:pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto max-w-6xl rounded-2xl transition-all duration-300",
          scrolled || open
            ? "glass-panel border border-white/10 shadow-xl shadow-black/30"
            : "bg-transparent border border-transparent"
        )}
      >
        <nav className="flex items-center justify-between h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${site.shortName} home`}>
            <Image
              src="/images/logo-ieee-babcock.svg"
              alt={`${site.shortName} logo`}
              width={160}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                      active ? "text-white" : "text-body hover:text-white"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <SocialIcons site={site} />
            <Link
              href={site.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 rounded-full bg-ieee-blue px-5 py-2 text-sm font-semibold text-white shadow-md shadow-ieee-blue/20 transition-all hover:bg-ieee-blue-light hover:shadow-ieee-blue/40"
            >
              Join IEEE
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden relative z-10 flex h-10 w-10 items-center justify-center text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-white/10"
            >
              <ul className="flex flex-col px-4 py-4 sm:px-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block py-3 text-lg font-medium border-b border-white/5",
                        pathname === link.href ? "text-white" : "text-body hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 pb-6 sm:px-6">
                <SocialIcons site={site} />
                <Link
                  href={site.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ieee-blue px-5 py-2 text-sm font-semibold text-white"
                >
                  Join IEEE
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function SocialIcons({ site }: { site: SiteConfig }) {
  return (
    <div className="flex items-center gap-3 text-body">
      <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
        <LinkedInGlyph size={18} />
      </a>
      <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
        <InstagramGlyph size={18} />
      </a>
      <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-white transition-colors">
        <XGlyph size={18} />
      </a>
    </div>
  );
}
