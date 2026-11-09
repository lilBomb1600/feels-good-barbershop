"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Photo } from "@/components/ui/Photo";
import { categories, looks, type Category, type Look } from "@/data/lookbook";
import { T, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SIZES = "(min-width: 1440px) 330px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 48vw";

function Tile({ look, flipped, onFlip }: { look: Look; flipped: boolean; onFlip: () => void }) {
  const t = useT();
  const canFlip = Boolean(look.back);
  return (
    <figure>
      <div
        className="flip relative aspect-[3/4] rounded-[14px] shadow-[0_24px_40px_-24px_rgb(0_0_0/0.9)]"
        data-can-flip={canFlip}
        data-flipped={flipped}
      >
        <div className="flip-inner">
          <div className="flip-face overflow-hidden rounded-[14px] bg-ink-2">
            <Photo id={look.front} alt={t(look.alt)} sizes={SIZES} />
          </div>
          {look.back && look.backAlt ? (
            <div className="flip-face flip-back overflow-hidden rounded-[14px] bg-ink-2">
              <Photo id={look.back} alt={t(look.backAlt)} sizes={SIZES} />
            </div>
          ) : null}
        </div>
        {canFlip ? (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-semibold text-paper backdrop-blur-sm"
            >
              <RotateCw className="size-3.5" />
              <T en="2 angles" es="2 ángulos" />
            </span>
            <button
              type="button"
              onClick={onFlip}
              aria-pressed={flipped}
              className="absolute inset-0 z-20 cursor-pointer rounded-[14px]"
            >
              <span className="sr-only">
                <T en={`${look.name.en}: show the other angle`} es={`${look.name.es}: ver el otro ángulo`} />
              </span>
            </button>
          </>
        ) : null}
      </div>
      <figcaption className="mt-3 text-[0.95rem] leading-snug font-semibold text-paper/90">
        <T en={look.name.en} es={look.name.es} />
      </figcaption>
    </figure>
  );
}

/** Real cuts from the shop's own photos, filterable; four of them turn to a second angle of the same client. */
export function Lookbook() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();
  const shown = looks.filter((l) => cat === "all" || l.cats.includes(cat));

  return (
    <section id="cuts" className="relative z-10" aria-labelledby="cuts-title">
      <CheckerSeam from="var(--color-paper)" to="var(--color-ink)" />
      <div className="grain bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-24 sm:px-8 lg:px-12 lg:pt-16 lg:pb-32">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <h2
              id="cuts-title"
              className="text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] font-light tracking-[-0.035em] text-balance lg:col-span-8"
            >
              <T
                en={
                  <>
                    Fresh out <strong className="font-extrabold">the chair.</strong>
                  </>
                }
                es={
                  <>
                    Recién salidos <strong className="font-extrabold">de la silla.</strong>
                  </>
                }
              />
            </h2>
            <p className="max-w-[36ch] text-lg leading-relaxed text-mute lg:col-span-4 lg:justify-self-end">
              <T
                en="Real cuts from the shop. Photos marked 2 angles turn around when you hover or tap them."
                es="Cortes reales de la barbería. Las fotos con 2 ángulos se voltean al pasar el cursor o tocarlas."
              />
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter cuts / Filtrar cortes"
            className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {categories.map((c) => {
              const on = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
                    on
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/25 text-paper/85 hover:border-paper/60 hover:text-paper",
                  )}
                >
                  <T en={c.en} es={c.es} />
                </button>
              );
            })}
          </div>

          <motion.ul
            layout={!reduce}
            className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((l) => (
                <motion.li
                  key={l.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="min-w-0"
                >
                  <Tile
                    look={l}
                    flipped={Boolean(flipped[l.id])}
                    onFlip={() => setFlipped((f) => ({ ...f, [l.id]: !f[l.id] }))}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
