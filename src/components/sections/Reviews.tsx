"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Cta } from "@/components/ui/Cta";
import { Halftone } from "@/components/ui/Halftone";
import { Heading } from "@/components/ui/Heading";
import { studio } from "@/data/business";
import { reviews } from "@/data/reviews";
import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const serviceEs: Record<string, string> = {
  Kids: "Niños",
  Adults: "Adultos",
  "Hot Towel Shave": "Afeitado con toalla caliente",
};

/** "2026-03" as "Mar 2026" / "mar 2026" */
const month = (ym: string, lang: "en" | "es") =>
  new Intl.DateTimeFormat(lang === "es" ? "es-US" : "en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${ym}-01T12:00:00Z`),
  );

/** The rating, inked onto the slips like the shop's rubber stamp. */
function Seal({ className }: { className?: string }) {
  const ring = (text: string) => `${text} · ${text} · `;
  return (
    <div className={cn("pointer-events-none select-none", className)}>
      <svg viewBox="0 0 240 240" className="h-full w-full text-rose-deep" aria-hidden>
        <defs>
          <path id="seal-ring" d="M120 120 m-91 0 a91 91 0 1 1 182 0 a91 91 0 1 1 -182 0" />
          <filter id="seal-ink" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.75" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter="url(#seal-ink)" fill="currentColor" stroke="currentColor">
          <circle cx="120" cy="120" r="115" fill="none" strokeWidth="4.5" />
          <circle cx="120" cy="120" r="106" fill="none" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="74" fill="none" strokeWidth="1.5" />
          <text
            data-l="en"
            stroke="none"
            fontFamily="var(--font-archivo)"
            fontSize="15.5"
            fontWeight="800"
            letterSpacing="2"
          >
            <textPath href="#seal-ring" textLength="566" lengthAdjust="spacing">
              {ring(`${studio.reviewCount} REVIEWS ON BOOKSY`)}
            </textPath>
          </text>
          <text
            data-l="es"
            stroke="none"
            fontFamily="var(--font-archivo)"
            fontSize="15.5"
            fontWeight="800"
            letterSpacing="2"
          >
            <textPath href="#seal-ring" textLength="566" lengthAdjust="spacing">
              {ring(`${studio.reviewCount} RESEÑAS EN BOOKSY`)}
            </textPath>
          </text>
          <text
            x="120"
            y="146"
            textAnchor="middle"
            stroke="none"
            fontFamily="var(--font-big)"
            fontSize="84"
            fontWeight="900"
          >
            {studio.rating}
          </text>
          {[-2, -1, 0, 1, 2].map((k) => (
            <path
              key={k}
              stroke="none"
              transform={`translate(${120 + k * 15 - 6.5} 160) scale(0.65)`}
              d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L10 15.1 4.6 18.1l1.2-6.1L1.3 7.8l6.1-.7z"
              opacity={k === 2 ? 0.45 : 1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * Six real quotes from Booksy as slips torn off the shop's ticket roll, stacked in a deck you can flick
 * through, the rating stamped across the corner.
 */
export function Reviews() {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const go = (d: number) => set(([cur]) => [(cur + d + reviews.length) % reviews.length, d]);
  const to = (k: number) => set(([cur]) => [k, k >= cur ? 1 : -1]);
  const r = reviews[i];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <section id="reviews" className="relative z-10" aria-labelledby="reviews-title">
      <div className="on-paper relative overflow-hidden bg-paper text-ink">
        <Halftone
          src="/images/textures/halftone-rose-src.webp"
          color="#c8202f"
          alpha={0.2}
          spacing={10}
          invert
          className="top-[8%] bottom-0 left-[-30%] h-[92%] w-[95%] [mask-image:radial-gradient(closest-side,black_50%,transparent)] lg:left-[-14%] lg:w-[55%]"
        />
        <CheckerSeam from="var(--color-ink)" to="transparent" />
        <div className="relative mx-auto max-w-[1440px] px-5 pt-6 pb-24 sm:px-8 lg:px-12 lg:pt-8 lg:pb-32">
          <Heading
            id="reviews-title"
            tone="paper"
            align="center"
            en={{ main: "Straight from", accent: "Booksy" }}
            es={{ main: "Directo de", accent: "Booksy" }}
          />
          <p className="sr-only">
            <T
              en={`Rated ${studio.rating} out of 5 from ${studio.reviewCount} reviews on Booksy.`}
              es={`Calificación de ${studio.rating} de 5 con ${studio.reviewCount} reseñas en Booksy.`}
            />
          </p>

          <div className="relative mx-auto mt-14 max-w-[44rem] sm:mt-20">
            {/* the slips waiting underneath */}
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-[3deg] rounded-[6px] bg-[#e9dcc4] shadow-[0_18px_30px_-22px_rgb(15_11_10/0.5)]" />
            <div aria-hidden className="absolute inset-0 -translate-x-2 translate-y-1.5 -rotate-[2.2deg] rounded-[6px] bg-[#f1e6d2] shadow-[0_18px_30px_-22px_rgb(15_11_10/0.5)]" />

            <div className="relative min-h-[19rem] sm:min-h-[16.5rem]" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.figure
                  key={i}
                  custom={dir}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={onDragEnd}
                  variants={{
                    enter: { opacity: 0, scale: 0.95, y: 10, rotate: 1.5 },
                    show: { opacity: 1, scale: 1, y: 0, x: 0, rotate: -0.6 },
                    leave: (d: number) => ({ opacity: 0, x: d * -380, rotate: d * -9, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] } }),
                  }}
                  initial="enter"
                  animate="show"
                  exit="leave"
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative cursor-grab touch-pan-y drop-shadow-[0_22px_26px_rgb(15_11_10/0.22)] active:cursor-grabbing"
                >
                  <div className="slip flex min-h-[19rem] flex-col rounded-b-[6px] bg-[#fffaf0] px-6 pt-9 pb-6 sm:min-h-[16.5rem] sm:px-10 sm:pt-11 sm:pb-8">
                    <blockquote
                      lang="en"
                      className="max-w-[34ch] text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.22] font-medium tracking-[-0.015em] text-pretty"
                    >
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-dashed border-ink/25 pt-4 text-[0.95rem] text-mute-paper">
                      <span>
                        <span className="font-semibold text-ink">{r.name}</span>
                        {" · "}
                        <T en={r.service} es={serviceEs[r.service] ?? r.service} />
                      </span>
                      <span className="tabular">
                        <T en={month(r.date, "en")} es={month(r.date, "es")} />
                      </span>
                    </figcaption>
                  </div>
                </motion.figure>
              </AnimatePresence>
            </div>

            <Seal className="absolute -top-16 -right-3 z-10 size-[8.5rem] rotate-[11deg] sm:-top-20 sm:-right-24 sm:size-[11.5rem] lg:-top-24 lg:-right-44 lg:size-[14rem]" />
          </div>

          <div className="mx-auto mt-10 flex max-w-[44rem] flex-wrap items-center justify-center gap-x-5 gap-y-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-12 place-items-center rounded-full border border-ink/25 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowLeft className="size-5" aria-hidden />
              <span className="sr-only">
                <T en="Previous review" es="Reseña anterior" />
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              {reviews.map((rv, k) => (
                <button
                  key={rv.name}
                  type="button"
                  onClick={() => to(k)}
                  aria-current={k === i ? "true" : undefined}
                  className="group grid h-11 w-7 place-items-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-2.5 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-out-expo)]",
                      k === i ? "w-6 bg-rose" : "w-2.5 bg-ink/25 group-hover:bg-ink/50",
                    )}
                  />
                  <span className="sr-only">
                    <T en={`Review ${k + 1} of ${reviews.length}`} es={`Reseña ${k + 1} de ${reviews.length}`} />
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-12 place-items-center rounded-full border border-ink/25 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowRight className="size-5" aria-hidden />
              <span className="sr-only">
                <T en="Next review" es="Siguiente reseña" />
              </span>
            </button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <Cta href={studio.bookingUrl} variant="ghostInk">
              <T en={`Read all ${studio.reviewCount} on Booksy`} es={`Lee las ${studio.reviewCount} en Booksy`} />
            </Cta>
            <p className="max-w-[46ch] text-sm text-mute-paper">
              <T
                en="Quotes copied as written by clients on Booksy."
                es="Reseñas originales en inglés, tal como las escribieron los clientes en Booksy."
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
