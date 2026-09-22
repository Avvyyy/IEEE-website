"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/lib/types";

type NavLink =
  | { href: string; label: string; children?: undefined }
  | { href: string; label: string; children: { href: string; label: string }[] };

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  {
    href: "/axis-congress",
    label: "AXIS Congress",
    children: [
      { href: "/axis-congress", label: "AXIS Congress" },
      { href: "/axis-congress/ignite", label: "AXIS Ignite" },
    ],
  },
  { href: "/opportunities", label: "Opportunities" },
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
              src="/images/logo-ieee-babcock.png"
              alt={`${site.shortName} logo`}
              width={160}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.children?.some((c) => pathname === c.href) ?? false);

              if (link.children) {
                return <AxisDropdown key={link.href} link={link} pathname={pathname} active={active} />;
              }

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
                {NAV_LINKS.flatMap((link, i) => {
                  if (link.children) {
                    return link.children.map((child, j) => (
                      <motion.li
                        key={child.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + j) * 0.04 }}
                      >
                        <Link
                          href={child.href}
                          className={cn(
                            "block py-3 text-lg font-medium border-b border-white/5",
                            j > 0 && "pl-4 text-base text-body/80",
                            pathname === child.href ? "text-white" : "hover:text-white"
                          )}
                        >
                          {j === 0 ? child.label : `↳ ${child.label}`}
                        </Link>
                      </motion.li>
                    ));
                  }
                  return [
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
                    </motion.li>,
                  ];
                })}
              </ul>
              <div className="flex items-center justify-between px-4 pb-6 sm:px-6">
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

/* ------------------------------------------------------------------ */
/*  AXIS dropdown — desktop only                                       */
/* ------------------------------------------------------------------ */
function AxisDropdown({
  link,
  pathname,
  active,
}: {
  link: NavLink & { children: { href: string; label: string }[] };
  pathname: string;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors",
          active ? "text-white" : "text-body hover:text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {active && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-full bg-white/10"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <span className="relative z-10">{link.label}</span>
        <ChevronDown
          size={14}
          className={cn("relative z-10 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
             className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-surface shadow-2xl shadow-black/50 py-1 z-50"
          >
            {link.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-sm transition-colors hover:bg-white/5",
                    pathname === child.href ? "text-white font-semibold" : "text-body hover:text-white"
                  )}
                >
                  {child.label}
                  {child.href === "/axis-congress/ignite" && (
                    <span className="ml-2 inline-block rounded-full bg-accent-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-accent-gold">
                      NEW
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
