"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BarberPole } from "@/components/ui/BarberPole";
import { cn } from "@/lib/utils";
import { studio } from "@/data/business";

const links = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter((el): el is Element => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-ink/90 backdrop-blur transition-shadow",
        scrolled ? "border-line shadow-lg shadow-black/30" : "border-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BarberPole className="h-9 w-3.5" />
          <span className="font-display text-xl uppercase leading-none tracking-wide text-cream">
            Feel Goods
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                activeHref === l.href ? "text-cream" : "text-cream-dim hover:text-cream"
              )}
            >
              {l.label}
              {activeHref === l.href && (
                <motion.span
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-red-light"
                />
              )}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href={studio.phoneHref} className="flex items-center gap-2 text-sm font-medium text-cream-dim hover:text-cream">
            <Phone className="h-4 w-4 text-red-light" />
            {studio.phone}
          </a>
          <a
            href={studio.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="shine-btn rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_20px_-4px_rgba(179,39,44,0.55)] transition-all hover:-translate-y-0.5 hover:bg-red-light hover:shadow-[0_8px_28px_-4px_rgba(179,39,44,0.75)]"
          >
            Book Now
          </a>
        </div>

        <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)} className="text-cream md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-ink md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-surface hover:text-cream",
                    activeHref === l.href ? "text-red-light" : "text-cream-dim"
                  )}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={studio.bookingUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-red px-5 py-3 text-center text-sm font-semibold text-cream"
              >
                Book Now
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
