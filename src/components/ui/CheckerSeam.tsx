"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The floor between sections: a band of checker tiles that flip, tile by tile, from the ground above
 * to the ground below as the band rises through the screen. One CSS variable (--p) drives every tile.
 * The band height is fixed in CSS, so changing the column count after hydration never shifts layout.
 *
 * Placed inside the next section with to="transparent", the tiles fold away onto that section's own
 * ground (grain, halftone and all), so no flat band is left behind once they've turned.
 */
export function CheckerSeam({
  from,
  to,
  rows = 3,
  className,
}: {
  from: string;
  to: string;
  rows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(28);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const tile = w < 640 ? 26 : 40;
      setCols(Math.max(10, Math.round(w / tile)));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const p = (vh - top) / (vh * 0.72);
      el.style.setProperty("--p", Math.min(Math.max(p, 0), 1.4).toFixed(3));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) update();
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const parity = (r + c) % 2;
      // a left-to-right sweep, lower rows a beat later; alternate tiles lag so the sweep's edge is a checker
      const t = (c / cols) * 0.55 + (r / rows) * 0.12 + parity * 0.12;
      tiles.push(
        <span
          key={`${r}-${c}`}
          className="seam-tile"
          style={{ "--t": t.toFixed(3), "--rest": parity ? to : from } as CSSProperties}
        />,
      );
    }
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("seam relative z-[1] h-[78px] sm:h-[120px]", className)}
      style={
        {
          "--cols": cols,
          "--from": from,
          "--to": to,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          background: to === "transparent" ? "transparent" : from,
        } as CSSProperties
      }
    >
      {tiles}
    </div>
  );
}
