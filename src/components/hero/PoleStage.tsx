"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useClientValue } from "@/lib/client-stores";
import { cn } from "@/lib/utils";

const PoleScene = dynamic(() => import("./PoleScene"), { ssr: false });

/** Should this device run the live 3D pole, or show the still render? */
function canRun3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return false;
  try {
    if (!document.createElement("canvas").getContext("webgl2")) return false;
  } catch {
    return false;
  }
  return true;
}

let capableCache: boolean | undefined;
function canRun3DCached() {
  if (capableCache === undefined) capableCache = canRun3D();
  return capableCache;
}

/**
 * Holds the pole. Capable devices get the live three.js scene, which renders only while the hero is
 * showing. Reduced motion, Save-Data, low-memory or low-core devices and browsers without WebGL2 get a
 * still render of the same scene (captured from it, so it lines up). The stage is absolutely positioned,
 * so either path leaves the layout untouched. three.js isn't even downloaded until the hero is on screen
 * (a link straight to #visit never pays for it).
 */
export function PoleStage({ className }: { className?: string }) {
  const posterMode = useClientValue(() => new URLSearchParams(window.location.search).has("poster")) ?? false;
  const capable = useClientValue(canRun3DCached);
  const mode = capable === null ? "pending" : capable || posterMode ? "live" : "still";
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "live" || seen || !ref.current) return;
    // the hero has to stay on screen for a moment: a link to #visit briefly shows the top of the
    // page while the browser scrolls down to it, and that glimpse shouldn't cost a three.js download
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearTimeout(timer);
      if (e.isIntersecting)
        timer = window.setTimeout(() => {
          setSeen(true);
          io.disconnect();
        }, 450);
    });
    io.observe(ref.current);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [mode, seen]);

  useEffect(() => {
    if (mode !== "live" || !seen) return;
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 1.05 && !document.hidden);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
    };
  }, [mode, seen]);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)} aria-hidden>
      {mode === "still" ? (
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet="/images/pole/pole-still-tall.webp" />
          <img
            src="/images/pole/pole-still-wide.webp"
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      ) : null}
      {mode === "live" && seen ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <PoleScene active={active} still={posterMode} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
