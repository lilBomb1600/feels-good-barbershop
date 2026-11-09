"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { categories, looks, type Category, type Look } from "@/data/lookbook";
import { T, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SIZES = "(min-width: 1440px) 330px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 48vw";
const FEATURE_SIZES = "(min-width: 1440px) 680px, (min-width: 1024px) 47vw, (min-width: 640px) 63vw, 100vw";
/** "All" opens on the feature plus eight; the rest wait behind a button so the section keeps its pace. */
const FIRST = 9;

function Tile({
  look,
  flipped,
  onFlip,
  feature = false,
}: {
  look: Look;
  flipped: boolean;
  onFlip: () => void;
  feature?: boolean;
}) {
  const t = useT();
  const canFlip = Boolean(look.back);
  const sizes = feature ? FEATURE_SIZES : SIZES;
  return (
    <figure className={cn(feature && "flex h-full flex-col")}>
      <div
        className={cn(
          "flip relative rounded-[14px] shadow-[0_24px_40px_-24px_rgb(0_0_0/0.9)]",
          feature ? "aspect-[4/5] sm:aspect-auto sm:min-h-0 sm:flex-1" : "aspect-[3/4]",
        )}
        data-can-flip={canFlip}
        data-flipped={flipped}
      >
        <div className="flip-inner">
          <div className="flip-face overflow-hidden rounded-[14px] bg-ink-2">
            <Photo id={look.front} alt={t(look.alt)} sizes={sizes} />
          </div>
          {look.back && look.backAlt ? (
            <div className="flip-face flip-back overflow-hidden rounded-[14px] bg-ink-2">
              <Photo id={look.back} alt={t(look.backAlt)} sizes={sizes} />
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
      <figcaption
        className={cn(
          "mt-3 leading-snug text-paper",
          feature
            ? "font-display text-[1.7rem] leading-none font-extrabold uppercase sm:text-[2.1rem]"
            : "text-[0.95rem] font-semibold",
        )}
      >
        <T en={look.name.en} es={look.name.es} />
      </figcaption>
    </figure>
  );
}

/**
 * Real cuts from the shop's own photos, filterable. "All" leads with one big piece of their best design
 * work, then a shorter set with the rest behind a button. Four of them turn to a second angle of the same client.
 */
export function Lookbook() {
  const t = useT();
  const [cat, setCat] = useState<Category | "all">("all");
  const [more, setMore] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const all = cat === "all";
  const matching = looks.filter((l) => all || l.cats.includes(cat));
  const shown = all && !more ? matching.slice(0, FIRST) : matching;

  return (
    <section id="cuts" className="relative z-10" aria-labelledby="cuts-title">
      <div className="grain bg-ink text-paper">
        <CheckerSeam from="var(--color-paper)" to="transparent" />
        <div className="mx-auto max-w-[1440px] px-5 pt-6 pb-24 sm:px-8 lg:px-12 lg:pt-8 lg:pb-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <Heading
              id="cuts-title"
              className="lg:col-span-8"
              en={{ main: "Fresh out", accent: "the chair" }}
              es={{ main: "Recién salidos", accent: "de la silla" }}
            />
            <p className="max-w-[36ch] text-lg leading-relaxed text-mute lg:col-span-4 lg:justify-self-end">
              <T
                en="Real cuts from the shop. Photos marked 2 angles turn around when you hover or tap them."
                es="Cortes reales de la barbería. Las fotos con 2 ángulos se voltean al pasar el cursor o tocarlas."
              />
            </p>
          </div>

          <div
            role="group"
            aria-label={t({ en: "Filter cuts", es: "Filtrar cortes" })}
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
            id="cuts-grid"
            layout
            className="mt-8 grid grid-flow-dense grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((l, i) => {
                const feature = all && i === 0;
                return (
                  <motion.li
                    key={l.id}
                    layout
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("min-w-0", feature && "col-span-2 sm:row-span-2")}
                  >
                    <Tile
                      look={l}
                      feature={feature}
                      flipped={Boolean(flipped[l.id])}
                      onFlip={() => setFlipped((f) => ({ ...f, [l.id]: !f[l.id] }))}
                    />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>

          {all && matching.length > FIRST ? (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                aria-expanded={more}
                aria-controls="cuts-grid"
                onClick={() => setMore((m) => !m)}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-paper/30 px-6 text-[0.95rem] font-semibold text-paper transition-colors duration-300 hover:border-paper/70 hover:bg-paper/[0.06]"
              >
                {more ? (
                  <T en="Show fewer" es="Ver menos" />
                ) : (
                  <T en={`Show all ${matching.length} cuts`} es={`Ver los ${matching.length} cortes`} />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
