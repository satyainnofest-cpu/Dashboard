"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openCmd = () => window.dispatchEvent(new Event("open-command-menu"));

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-lime"
        style={reduce ? undefined : { scaleX }}
      />
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <nav className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-[12px] tracking-tight text-white/85 hover:text-lime transition-colors"
              aria-label="Home"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-lime font-bold text-[10px] text-black">
                AI
              </span>
              <span className="text-white/85">
                {site.name.split(" ")[0].toLowerCase()}.ai
              </span>
              <span className="text-white/30 hidden sm:inline">/ dashboard</span>
            </Link>
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch
                    className={cn(
                      "relative inline-flex items-center px-3 h-8 rounded-md font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
                      isActive(l.href)
                        ? "bg-lime text-black"
                        : "text-white/65 hover:text-white hover:bg-white/5"
                    )}
                    aria-current={isActive(l.href) ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCmd}
              className="hidden sm:inline-flex items-center gap-2 h-8 px-2.5 rounded-md border border-white/15 text-white/65 hover:text-white hover:border-white/30 transition-colors font-mono text-[11px]"
              aria-label="Open command menu"
              data-cursor
            >
              <Command size={11} />
              <span>K</span>
            </button>
            <span className="hidden lg:inline-flex h-8 items-center px-2.5 rounded-md border border-white/10 font-mono text-[10px] text-lime">
              live · static · v1.0
            </span>
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/5 text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black flex flex-col items-start justify-center px-8 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <ul className="flex flex-col gap-5 w-full">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  prefetch
                  className={cn(
                    "block text-4xl font-semibold tracking-[-0.04em]",
                    isActive(l.href) ? "text-lime" : "text-white"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 font-mono text-xs text-white/40">
            Press{" "}
            <kbd className="px-1.5 py-0.5 border border-white/20 rounded">
              esc
            </kbd>{" "}
            to close
          </p>
        </div>
      )}
    </>
  );
}
