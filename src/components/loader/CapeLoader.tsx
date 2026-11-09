"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { PoleStripes } from "@/components/ui/PoleStripes";
import { StarMark } from "@/components/ui/StarMark";
import { T } from "@/lib/i18n";
import { useClientValue } from "@/lib/client-stores";

export const CAPE_KEY = "fg-cape";
const STRIPS = 14;
const HOLD_MS = 1500;
const LIFT_MS = 1150;

/**
 * "Cape off": the page opens under the shop's own rose cape, then the cape is whipped off the way a
 * barber pulls it at the end of a cut. The cape lifts in vertical strips on a staggered, wave-shaped
 * delay so the hem ripples like fabric. Once per session; skippable (button or Esc); skipped entirely
 * with reduced motion. The inline head script hides it before paint on repeat visits.
 */
export function CapeLoader() {
  const [phase, setPhase] = useState<"cover" | "lift" | "done">("cover");
  const timers = useRef<number[]>([]);
  // decided before first paint by the inline head script (repeat visit or reduced motion)
  const skipped = useClientValue(() => document.documentElement.dataset.cape === "off");

  const lift = useCallback(() => {
    setPhase((p) => (p === "cover" ? "lift" : p));
    timers.current.push(window.setTimeout(() => setPhase("done"), LIFT_MS));
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.cape === "off") return;
    try {
      sessionStorage.setItem(CAPE_KEY, "1");
    } catch {
      /* storage blocked: it just plays again next time */
    }
    html.style.overflow = "hidden";
    timers.current.push(window.setTimeout(lift, HOLD_MS));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && lift();
    window.addEventListener("keydown", onKey);
    const t = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      t.forEach(clearTimeout);
      html.style.overflow = "";
    };
  }, [lift]);

  useEffect(() => {
    if (phase !== "cover") document.documentElement.style.overflow = "";
    if (phase === "done") document.documentElement.dataset.cape = "off";
  }, [phase]);

  if (skipped || phase === "done") return null;
  const lifting = phase === "lift";

  return (
    <div className="cape-loader fixed inset-0 z-[100]" aria-hidden={lifting}>
      {Array.from({ length: STRIPS }, (_, i) => {
        // pulled from the left, with a ripple running through the hem
        const delay = i * 34 + Math.sin(i * 0.95) * 46 + 40;
        return (
          <div
            key={i}
            className="absolute inset-y-0 will-change-transform"
            style={
              {
                left: `${(i / STRIPS) * 100}%`,
                width: `calc(${100 / STRIPS}% + 1px)`,
                transform: lifting ? `translate3d(0, -118%, 0) scaleY(1.06)` : "translate3d(0,0,0)",
                transition: `transform 760ms cubic-bezier(0.7, 0, 0.22, 1) ${delay}ms`,
                transformOrigin: "50% 0%",
              } as CSSProperties
            }
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="cape-fabric absolute inset-y-0 w-[100vw]"
                style={{ left: `calc(${(-i * 100) / STRIPS}vw)` }}
              />
              {/* the hem: a fold of shadow along the bottom edge */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/55" />
            </div>
            {/* the shadow the lifting cape throws on the shop below */}
            <div className="absolute inset-x-0 top-full h-24 bg-gradient-to-b from-black/45 to-transparent" />
          </div>
        );
      })}

      {/* centre lockup, darkened locally so it reads on the busy fabric */}
      <div
        className="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-300"
        style={{ opacity: lifting ? 0 : 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(42%_38%_at_50%_50%,rgb(10_6_6/0.72),rgb(10_6_6/0.18)_70%,transparent)]" />
        <div className="relative flex flex-col items-center text-paper">
          <StarMark className="h-9 w-auto text-paper" />
          <p className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-6xl leading-none font-black uppercase sm:text-7xl">Feel</span>
            <span className="script-stroke font-script text-6xl leading-none text-rose-lit sm:text-7xl">Goods</span>
          </p>
          <div className="relative mt-6 h-2.5 w-56 overflow-hidden rounded-full bg-paper/15">
            <div className="cape-progress absolute inset-0 overflow-hidden rounded-full">
              <PoleStripes size={22} />
            </div>
          </div>
          <p className="mt-4 text-sm text-paper/80">
            <T en="Barbershop · Pittsburg, CA" es="Barbería · Pittsburg, CA" />
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={lift}
        className="pointer-events-auto absolute top-4 right-4 h-10 rounded-full border border-paper/35 bg-ink/50 px-5 text-sm font-semibold text-paper backdrop-blur-sm transition-colors hover:bg-ink/80 sm:top-6 sm:right-6"
        style={{ opacity: lifting ? 0 : 1 }}
      >
        <T en="Skip" es="Saltar" />
      </button>
    </div>
  );
}
