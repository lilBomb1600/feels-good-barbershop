"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { CheckerSeam } from "@/components/ui/CheckerSeam";
import { Cta } from "@/components/ui/Cta";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { studio } from "@/data/business";
import { services } from "@/data/services";
import { T, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** The row number, inked like a rubber stamp. */
function Stamp({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "place-items-center rounded-full border-2 border-rose-lit font-display leading-none font-black text-rose-lit tabular transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)]",
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-full border border-current opacity-50" />
      #0{n}
    </span>
  );
}

/**
 * The price board: a paper sheet slides up over the pinned hero, and on it hangs the shop's board,
 * lettered like a sign in a chrome frame, prices run out on dotted leaders.
 * With a mouse, the cut photo for the row you're on follows the cursor and leans into the movement.
 * On touch screens every row carries its photo inline.
 */
export function Prices() {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const vx = useVelocity(sx);
  const reduce = useReducedMotion();
  const lean = useTransform(vx, [-1600, 0, 1600], [-9, 0, 9], { clamp: true });
  const still = useMotionValue(0);
  const rotate = reduce ? still : lean;

  // the mouse position, tracked page-wide, so a row that scrolls under a resting cursor knows where it is
  const last = useRef<{ x: number; y: number } | null>(null);
  const place = (jump: boolean) => {
    if (!last.current || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const px = last.current.x - r.left;
    const py = last.current.y - r.top;
    x.set(px);
    y.set(py);
    // first appearance (and while scrolling): sit right at the cursor instead of flying in from the corner
    if (jump) {
      sx.jump(px);
      sy.jump(py);
    }
  };
  const show = (i: number | null, jump = false) => {
    if (i !== null) place(jump || activeRef.current === null);
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") last.current = { x: e.clientX, y: e.clientY };
    };
    // the board scrolls under a resting mouse: keep the photo on the cursor and on the right row
    const onScroll = () => {
      const p = last.current;
      const wrap = wrapRef.current;
      if (!p || !wrap) return;
      const r = wrap.getBoundingClientRect();
      const inside = p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
      const li = inside ? document.elementFromPoint(p.x, p.y)?.closest<HTMLElement>("[data-row]") : null;
      const next = li && wrap.contains(li) ? Number(li.dataset.row) : null;
      if (next !== activeRef.current || next !== null) show(next, true);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
    // show/place only touch refs and stable motion values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="prices" className="relative z-10" aria-labelledby="prices-title">
      <CheckerSeam from="transparent" to="var(--color-paper)" />
      <div className="on-paper bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-14 lg:pb-32">
          <Heading
            id="prices-title"
            tone="paper"
            en={{ main: "Prices,", accent: "plain and simple" }}
            es={{ main: "Precios", accent: "claros y sencillos" }}
          />

          <div
            ref={wrapRef}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              last.current = { x: e.clientX, y: e.clientY };
              place(false);
            }}
            onPointerLeave={() => show(null)}
            className="relative mt-10 lg:mt-14"
          >
            {/* the board in its chrome frame, the same chrome as the mirrors at the stations */}
            <div className="rounded-[26px] bg-[linear-gradient(145deg,#f4f1ea,#8f8a84_38%,#f4f1ea_52%,#6f6a64)] p-[6px] shadow-[0_40px_70px_-30px_rgb(15_11_10/0.75)] sm:p-2">
              <div className="grain relative overflow-hidden rounded-[20px] bg-ink text-paper">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgb(244_236_220/0.05)_42%,transparent_54%)]"
                />
                <ol className="relative px-4 pt-2 sm:px-8 lg:px-12 lg:pt-5">
                  {services.map((s, i) => (
                    <li
                      key={s.id}
                      data-row={i}
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "mouse") return;
                        last.current = { x: e.clientX, y: e.clientY };
                        show(i);
                      }}
                      className="group grid grid-cols-[4.25rem_1fr_auto] gap-x-4 border-b border-paper/12 py-5 sm:grid-cols-[5.25rem_1fr_auto] sm:gap-x-6 fine:grid-cols-[4.75rem_auto_1fr_auto] fine:items-end fine:gap-x-6 fine:py-7 lg:fine:grid-cols-[6rem_auto_1fr_auto] lg:fine:gap-x-8"
                    >
                      {/* touch: the photo sits in the row, the stamp on its corner */}
                      <div className="relative col-start-1 row-span-2 row-start-1 self-start fine:hidden">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-ink-3">
                          <Photo id={s.photo} alt={t(s.photoAlt)} sizes="(min-width: 640px) 84px, 68px" />
                        </div>
                        <Stamp
                          n={i + 1}
                          className="absolute -top-2.5 -left-2.5 grid size-10 -rotate-[10deg] bg-ink text-[0.85rem]"
                        />
                      </div>
                      <Stamp
                        n={i + 1}
                        className="relative col-start-1 row-span-2 row-start-1 hidden size-[4.25rem] -rotate-[10deg] self-center text-[1.35rem] group-hover:rotate-0 group-hover:bg-rose-lit group-hover:text-ink fine:grid lg:size-[5.25rem] lg:text-[1.7rem]"
                      />

                      <h3 className="col-start-2 row-start-1 self-end font-display text-[clamp(1.55rem,5.6vw,2.1rem)] leading-[0.92] font-black uppercase transition-transform duration-500 ease-[var(--ease-out-expo)] fine:text-[clamp(2.2rem,3.8vw,3.6rem)] fine:group-hover:translate-x-1.5">
                        <T en={s.name.en} es={s.name.es} />
                      </h3>
                      <span
                        aria-hidden
                        className="col-start-3 row-start-1 mb-[0.55rem] hidden self-end border-b-[3px] border-dotted border-paper/25 transition-colors duration-500 group-hover:border-rose-lit/80 fine:block lg:mb-[0.8rem]"
                      />
                      <p className="col-start-2 row-start-2 mt-1.5 text-[0.95rem] text-mute fine:col-span-2 fine:mt-2 fine:text-base">
                        <T en={s.duration.en} es={s.duration.es} />
                        {s.note ? (
                          <>
                            {" · "}
                            <T en={s.note.en} es={s.note.es} />
                          </>
                        ) : null}
                      </p>
                      <span className="col-start-3 row-span-2 row-start-1 self-start font-display text-[2.7rem] leading-[0.85] font-black text-paper tabular sm:text-5xl fine:col-start-4 fine:row-span-1 fine:self-end fine:text-[clamp(3.2rem,5.4vw,5rem)]">
                        <span className="mr-[0.04em] align-[0.58em] text-[0.5em]">$</span>
                        {s.price}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="relative flex flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 lg:py-9">
                  <p className="max-w-[48ch] text-[1.02rem] leading-relaxed text-mute">
                    <T
                      en="Book a time on Booksy or walk in. Cards accepted."
                      es="Reserva tu hora en Booksy o llega sin cita. Aceptamos tarjeta."
                    />
                  </p>
                  <Cta href={studio.bookingUrl} className="self-start sm:self-auto">
                    <T en="Book on Booksy" es="Reserva en Booksy" />
                  </Cta>
                </div>
              </div>
            </div>

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
                    className="relative -mt-[11rem] -ml-[8.25rem] aspect-[3/4] w-[16.5rem] overflow-hidden rounded-[14px] bg-ink-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]"
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
