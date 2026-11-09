"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { PoleStripes } from "@/components/ui/PoleStripes";
import { StarMark } from "@/components/ui/StarMark";
import { T } from "@/lib/i18n";

/*
 * "Cape off": the page opens under the shop's own rose cape, then the cape is whipped off the way a
 * barber pulls it at the end of a cut. The inline head script in layout.tsx owns the timing and the
 * Skip button (html[data-cape]); this file draws the cape. Its hem is a curve, not a straight edge:
 * a polygon of points along the bottom, each with its own head start, so the left side leaves first
 * and the hem sweeps up in a bent S, with a soft shadow falling on the shop below.
 */

const POINTS = 24;
const SPAN = 0.8; // how much of the lift each hem point takes to travel

/** Per-point progress (--cK, 0..1) and its smoothstep (--sK), declared once on the root. */
const vars: Record<string, string> = {};
const hem = (offset: number) => {
  const pts = ["0% -45%", "100% -45%"];
  for (let k = POINTS; k >= 0; k--) {
    pts.push(`${((k / POINTS) * 100).toFixed(2)}% calc(${103 + offset}% - 140% * var(--s${k}))`);
  }
  return `polygon(${pts.join(", ")})`;
};
for (let k = 0; k <= POINTS; k++) {
  const u = k / POINTS;
  // pulled from the left; the sine keeps neighbours from moving in lockstep, so the hem ripples
  const head = 0.62 * u + 0.06 * Math.sin(u * Math.PI * 2.2);
  vars[`--c${k}`] = `clamp(0, (var(--lift) - ${head.toFixed(3)}) / ${SPAN}, 1)`;
  vars[`--s${k}`] = `calc(var(--c${k}) * var(--c${k}) * (3 - 2 * var(--c${k})))`;
}
const CAPE = hem(0);
const SHADOW_NEAR = hem(3);
const SHADOW_FAR = hem(7);

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-cape"] });
  return () => mo.disconnect();
}
const getCape = () => document.documentElement.dataset.cape ?? "off";

export function CapeLoader() {
  // the server always renders the cape; CSS shows it only when the head script said it plays
  const cape = useSyncExternalStore(subscribe, getCape, () => "on");
  if (cape === "off") return null;

  return (
    <div className="cape-loader fixed inset-0 z-[100]" style={vars as CSSProperties}>
      {/* the shadow the rising hem throws on the shop: two soft steps under the edge */}
      <div aria-hidden className="absolute inset-0 bg-black/20" style={{ clipPath: SHADOW_FAR }} />
      <div aria-hidden className="absolute inset-0 bg-black/30" style={{ clipPath: SHADOW_NEAR }} />
      <div aria-hidden className="cape-sheet" style={{ clipPath: CAPE }}>
        <div className="cape-fabric" />
        <div className="absolute inset-0 bg-[radial-gradient(42%_38%_at_50%_50%,rgb(10_6_6/0.72),rgb(10_6_6/0.18)_70%,transparent)]" />
      </div>

      <div className="cape-lockup pointer-events-none absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center text-paper">
          <StarMark className="h-9 w-auto text-paper" />
          <p className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-6xl leading-none font-black uppercase sm:text-7xl">Feel</span>
            <span className="script-stroke font-script text-6xl leading-none text-rose-lit sm:text-7xl">Goods</span>
          </p>
          <div aria-hidden className="relative mt-6 h-2.5 w-56 overflow-hidden rounded-full bg-paper/15">
            <div className="cape-progress absolute inset-0 overflow-hidden rounded-full">
              <PoleStripes size={22} />
            </div>
          </div>
          <p className="mt-4 text-sm text-paper/85">
            <T en="Barbershop · Pittsburg, CA" es="Barbería · Pittsburg, CA" />
          </p>
        </div>
      </div>

      <button
        type="button"
        data-cape-skip=""
        className="cape-lockup absolute top-4 right-4 h-10 rounded-full border border-paper/35 bg-ink/60 px-5 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 sm:top-6 sm:right-6"
      >
        <T en="Skip" es="Saltar" />
      </button>
    </div>
  );
}
