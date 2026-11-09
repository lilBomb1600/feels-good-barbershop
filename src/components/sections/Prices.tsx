"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Photo } from "@/components/ui/Photo";
import { studio } from "@/data/business";
import { services } from "@/data/services";
import { T, useT } from "@/lib/i18n";

/**
 * The price board: a paper sheet that slides up over the pinned hero, its top edge a row of floor tiles.
 * With a mouse, the cut photo for the row you're on follows the cursor and leans into the movement.
 * On touch screens every row carries its photo inline.
 */
export function Prices() {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1600, 0, 1600], [-9, 0, 9], { clamp: true });

  const last = useRef<{ x: number; y: number } | null>(null);
  const place = () => {
    if (!last.current || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    x.set(last.current.x - r.left);
    y.set(last.current.y - r.top);
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    last.current = { x: e.clientX, y: e.clientY };
    place();
  };

  // the list scrolls under a resting mouse: keep the photo pinned to the cursor and on the right row
  useEffect(() => {
    if (active === null) return;
    const onScroll = () => {
      place();
      const el = last.current && document.elementFromPoint(last.current.x, last.current.y);
      const li = el?.closest<HTMLElement>("[data-row]");
      setActive(li ? Number(li.dataset.row) : null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <section id="prices" className="relative z-10" aria-labelledby="prices-title">
      <CheckerSeam from="transparent" to="var(--color-paper)" />
      <div className="on-paper bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-5 pt-12 pb-24 sm:px-8 lg:px-12 lg:pt-16 lg:pb-32">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <h2
              id="prices-title"
              className="text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] font-light tracking-[-0.035em] text-balance lg:col-span-8"
            >
              <T
                en={
                  <>
                    Prices, <strong className="font-extrabold">plain and simple.</strong>
                  </>
                }
                es={
                  <>
                    Precios <strong className="font-extrabold">claros y sencillos.</strong>
                  </>
                }
              />
            </h2>
            <p className="max-w-[34ch] text-lg leading-relaxed text-mute-paper lg:col-span-4 lg:justify-self-end">
              <T
                en="Book a time on Booksy or walk in. Cards accepted."
                es="Reserva tu hora en Booksy o llega sin cita. Aceptamos tarjeta."
              />
            </p>
          </div>

          <div ref={wrapRef} onPointerMove={onMove} onPointerLeave={() => setActive(null)} className="relative mt-12 lg:mt-16">
            <ol className="border-t border-ink/15">
              {services.map((s, i) => (
                <li
                  key={s.id}
                  data-row={i}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  className="group relative grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 border-b border-ink/15 py-5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-x-6 fine:grid-cols-[6.5rem_1fr_auto_auto] fine:gap-x-8 fine:py-7 lg:fine:grid-cols-[8.5rem_1fr_7rem_auto_auto]"
                >
                  {/* touch: the photo sits in the row */}
                  <div className="aspect-[3/4] self-start overflow-hidden rounded-lg bg-ink fine:hidden">
                    <Photo id={s.photo} alt={t(s.photoAlt)} sizes="88px" />
                  </div>
                  <span
                    aria-hidden
                    className="hidden font-display text-5xl leading-none font-extrabold text-rose tabular fine:block lg:text-7xl"
                  >
                    #0{i + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-rose tabular fine:hidden">#0{i + 1}</p>
                    <h3 className="text-[1.35rem] leading-tight font-extrabold tracking-[-0.02em] text-balance transition-transform duration-500 ease-[var(--ease-out-expo)] sm:text-2xl fine:group-hover:translate-x-2 lg:text-[2.6rem]">
                      <T en={s.name.en} es={s.name.es} />
                    </h3>
                    <p className="mt-1 text-[0.95rem] text-mute-paper">
                      <T en={s.note.en} es={s.note.es} />
                      <span className="lg:fine:hidden">
                        {" · "}
                        <T en={s.duration.en} es={s.duration.es} />
                      </span>
                    </p>
                    <a
                      href={studio.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-10 items-center gap-1 text-[0.95rem] font-semibold text-rose underline decoration-rose/40 underline-offset-4 fine:hidden"
                    >
                      <T en="Book this" es="Reservar" />
                      <span className="sr-only">
                        {" "}
                        {t(s.name)} (opens in a new tab)
                      </span>
                      <ArrowUpRight aria-hidden className="size-4" />
                    </a>
                  </div>

                  <span className="hidden text-mute-paper tabular lg:fine:block">
                    <T en={s.duration.en} es={s.duration.es} />
                  </span>

                  <span className="self-start font-display text-[2.6rem] leading-none font-black tabular sm:text-5xl fine:self-center lg:text-7xl">
                    ${s.price}
                  </span>

                  <a
                    href={studio.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden h-11 items-center gap-1.5 rounded-full border border-ink/20 px-5 text-sm font-semibold transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper fine:inline-flex"
                  >
                    <T en="Book" es="Reservar" />
                    <span className="sr-only">
                      {" "}
                      {t(s.name)} (opens in a new tab)
                    </span>
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ol>

            {/* mouse: the photo follows the cursor */}
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy, rotate }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden fine:block"
            >
              <AnimatePresence>
                {active !== null ? (
                  <motion.div
                    key="frame"
                    initial={{ opacity: 0, scale: 0.7, clipPath: "inset(40% 40% 40% 40% round 14px)" }}
                    animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 14px)" }}
                    exit={{ opacity: 0, scale: 0.85, clipPath: "inset(30% 30% 30% 30% round 14px)" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="relative -mt-[11rem] -ml-[8.25rem] aspect-[3/4] w-[16.5rem] overflow-hidden rounded-[14px] bg-ink shadow-[0_30px_60px_-20px_rgb(15_11_10/0.55)]"
                  >
                    {services.map((s, i) => (
                      <div
                        key={s.id}
                        className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]"
                        style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.08)" }}
                      >
                        <Photo id={s.photo} alt="" sizes="264px" />
                      </div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
