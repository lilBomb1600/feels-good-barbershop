"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A halftone dot screen drawn from one of the shop's photos (BACKGROUNDS-22 #8).
 * The source is a tiny grayscale image; dots are drawn at device resolution when the section
 * comes near the screen and again on resize, so it stays crisp and costs a few KB.
 */
export function Halftone({
  src,
  color,
  alpha = 0.3,
  spacing = 11,
  invert = false,
  angle = 45,
  className,
}: {
  src: string;
  color: string;
  alpha?: number;
  spacing?: number;
  invert?: boolean;
  angle?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let img: HTMLImageElement | null = null;
    let lum: Float32Array | null = null;
    let iw = 0;
    let ih = 0;
    let started = false;
    let raf = 0;

    const draw = () => {
      raf = 0;
      if (!lum || !canvas.isConnected) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      // cover-fit the source into the canvas box
      const scale = Math.max(w / iw, h / ih);
      const ox = (w - iw * scale) / 2;
      const oy = (h - ih * scale) / 2;
      const a = (angle * Math.PI) / 180;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const reach = Math.hypot(w, h) / 2 + spacing;
      const n = Math.ceil(reach / spacing);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      for (let i = -n; i <= n; i++) {
        for (let j = -n; j <= n; j++) {
          const u = i * spacing;
          const v = j * spacing;
          const x = cx + u * ca - v * sa;
          const y = cy + u * sa + v * ca;
          if (x < -spacing || y < -spacing || x > w + spacing || y > h + spacing) continue;
          const sx = Math.min(iw - 1, Math.max(0, Math.floor((x - ox) / scale)));
          const sy = Math.min(ih - 1, Math.max(0, Math.floor((y - oy) / scale)));
          const l = lum[sy * iw + sx];
          const dark = invert ? l : 1 - l;
          const r = spacing * 0.6 * Math.sqrt(dark);
          if (r < 0.4) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (started) return;
      started = true;
      img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        if (!img) return;
        iw = img.naturalWidth;
        ih = img.naturalHeight;
        const off = document.createElement("canvas");
        off.width = iw;
        off.height = ih;
        const octx = off.getContext("2d");
        if (!octx) return;
        octx.drawImage(img, 0, 0);
        const data = octx.getImageData(0, 0, iw, ih).data;
        lum = new Float32Array(iw * ih);
        for (let k = 0; k < iw * ih; k++) lum[k] = data[k * 4] / 255;
        schedule();
      };
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(schedule);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      img = null;
    };
  }, [src, color, alpha, spacing, invert, angle]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute", className)} />;
}
