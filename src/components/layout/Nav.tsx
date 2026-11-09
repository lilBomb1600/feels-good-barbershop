"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { StarMark } from "@/components/ui/StarMark";
import { studio } from "@/data/business";
import { NewTab } from "@/components/ui/Cta";
import { T, useLang, useT, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const links = [
  { href: "#prices", en: "Prices", es: "Precios" },
  { href: "#cuts", en: "Cuts", es: "Cortes" },
  { href: "#reviews", en: "Reviews", es: "Reseñas" },
  { href: "#visit", en: "Visit", es: "Visítanos" },
];

function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const opt = (l: Lang, label: string, name: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      aria-label={name}
      className={cn(
        "h-8 min-w-10 rounded-full px-2.5 text-xs font-bold tracking-wide transition-colors duration-200",
        lang === l ? "bg-paper text-ink" : "text-paper/75 hover:text-paper",
      )}
    >
      {label}
    </button>
  );
  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className={cn("flex items-center rounded-full border border-paper/20 bg-ink/40 p-0.5", className)}
    >
      {opt("en", "EN", "English")}
      {opt("es", "ES", "Español")}
    </div>
  );
}

export function Nav() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the menu is a full sheet: the page behind it stops scrolling while it's open
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        // open: solid, no backdrop-filter (it would trap the fixed menu sheet inside the header)
        open
          ? "border-b border-paper/10 bg-ink"
          : scrolled
            ? "border-b border-paper/10 bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-8 lg:px-12" aria-label={t({ en: "Main", es: "Principal" })}>
        <a
          href="#top"
          className="flex items-center gap-2.5 text-paper"
          aria-label={t({ en: "Feel Goods Barbershop, back to top", es: "Feel Goods Barbershop, volver arriba" })}
        >
          <StarMark className="h-6 w-auto text-rose-lit" />
          <span className="font-display text-[1.35rem] leading-none font-extrabold tracking-[0.02em] uppercase">
            Feel Goods
          </span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-paper/80 transition-colors hover:bg-paper/[0.07] hover:text-paper"
              >
                <T en={l.en} es={l.es} />
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <LangToggle />
          <a
            href={studio.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center rounded-full bg-rose px-4 text-sm font-semibold text-paper transition-colors hover:bg-rose-deep sm:inline-flex"
          >
            <T en="Book" es="Reservar" />
            <NewTab />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-9 place-items-center rounded-full border border-paper/20 text-paper lg:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            <span className="sr-only">
              <T en="Menu" es="Menú" />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grain fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-y-auto border-t border-paper/10 bg-ink lg:hidden"
          >
            <ul className="flex flex-col px-5 pt-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex h-[4.5rem] items-center border-b border-paper/10 font-display text-[2.6rem] leading-none font-black tracking-[0.01em] text-paper uppercase"
                  >
                    <T en={l.en} es={l.es} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 px-5 pt-8 pb-28">
              <a
                href={studio.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center rounded-full bg-rose text-lg font-semibold text-paper"
              >
                <T en="Book on Booksy" es="Reserva en Booksy" />
                <NewTab />
              </a>
              <a
                href={studio.phoneHref}
                className="flex h-14 items-center justify-center rounded-full border border-paper/30 text-lg font-semibold text-paper tabular"
              >
                <T en="Call" es="Llama al" />&nbsp;{studio.phone}
              </a>
            </div>
            {/* the shop floor along the bottom of the sheet */}
            <div aria-hidden className="checker-band mt-auto h-[72px] shrink-0 opacity-90" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
