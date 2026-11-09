"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Cta, Stars } from "@/components/ui/Cta";
import { Halftone } from "@/components/ui/Halftone";
import { studio } from "@/data/business";
import { reviews } from "@/data/reviews";
import { T } from "@/lib/i18n";

const serviceEs: Record<string, string> = {
  Kids: "Niños",
  Adults: "Adultos",
  "Hot Towel Shave": "Afeitado con toalla caliente",
};

/** The real Booksy rating, big, with the six real quotes in a carousel over a halftone rose. */
export function Reviews() {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const reduce = useReducedMotion();
  const go = (d: number) => set(([cur]) => [(cur + d + reviews.length) % reviews.length, d]);
  const r = reviews[i];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <section id="reviews" className="relative z-10" aria-labelledby="reviews-title">
      <CheckerSeam from="var(--color-ink)" to="var(--color-paper)" />
      <div className="on-paper relative overflow-hidden bg-paper text-ink">
        <Halftone
          src="/images/textures/halftone-rose-src.webp"
          color="#c8202f"
          alpha={0.24}
          spacing={10}
          invert
          className="inset-y-0 right-[-12%] h-full w-[85%] [mask-image:radial-gradient(closest-side,black_55%,transparent)] lg:right-[-6%] lg:w-[60%]"
        />
        <div className="relative mx-auto max-w-[1440px] px-5 pt-12 pb-24 sm:px-8 lg:px-12 lg:pt-16 lg:pb-32">
          <h2
            id="reviews-title"
            className="text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] font-light tracking-[-0.035em] text-balance"
          >
            <T
              en={
                <>
                  Straight from <strong className="font-extrabold">Booksy.</strong>
                </>
              }
              es={
                <>
                  Directo de <strong className="font-extrabold">Booksy.</strong>
                </>
              }
            />
          </h2>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p
                className="font-display text-[clamp(9rem,34vw,17rem)] leading-[0.8] font-black tracking-[-0.02em] tabular"
              >
                {studio.rating}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Stars value={studio.rating} className="text-xl text-ink/20" fillClass="text-rose" />
                <span className="text-lg font-semibold tabular">
                  <T
                    en={`${studio.reviewCount} reviews on Booksy`}
                    es={`${studio.reviewCount} reseñas en Booksy`}
                  />
                </span>
              </div>
              <Cta href={studio.bookingUrl} variant="ghostInk" className="mt-6">
                <T en="Read them all" es="Leer todas" />
              </Cta>
            </div>

            <div className="flex flex-col lg:col-span-7 lg:pt-6">
              <div className="relative min-h-[15rem] overflow-hidden sm:min-h-[13rem]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.figure
                    key={i}
                    custom={dir}
                    drag={reduce ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={onDragEnd}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="cursor-grab touch-pan-y active:cursor-grabbing"
                  >
                    <blockquote lang="en" className="max-w-[30ch] text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15] font-medium tracking-[-0.02em] text-pretty">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 text-base text-mute-paper">
                      <span className="font-semibold text-ink">{r.name}</span>
                      {" · "}
                      <T en={r.service} es={serviceEs[r.service] ?? r.service} />
                      {" · "}
                      {r.date}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center gap-4">
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
                <p className="text-sm font-semibold tabular text-mute-paper">
                  {i + 1} / {reviews.length}
                </p>
                <div aria-hidden className="ml-2 hidden h-1 flex-1 gap-1 sm:flex">
                  {reviews.map((_, k) => (
                    <span
                      key={k}
                      className={`h-full flex-1 rounded-full transition-colors duration-500 ${k === i ? "bg-rose" : "bg-ink/15"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm text-mute-paper">
                <T
                  en="Quotes copied as written by clients on Booksy."
                  es="Reseñas originales en inglés, tal como las escribieron los clientes en Booksy."
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
