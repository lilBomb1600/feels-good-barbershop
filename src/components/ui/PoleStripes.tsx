import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The barber-pole diagonal stripe, as an SVG pattern rather than a CSS
 * gradient. A CSS `repeating-linear-gradient` at exactly 45deg can never
 * tile perfectly — the tiling math needs N*cos(45) to land on a whole
 * pixel, and cos(45) is irrational, so every renderer's texture-tile
 * approximation shows a periodic "staircase" seam (confirmed: happened
 * identically with and without background-size). An SVG <pattern> avoids
 * this because rotation is one affine transform on the whole infinite
 * tiling grid, not a per-pixel gradient-angle calculation — so it tiles
 * exactly regardless of angle.
 */
export function PoleStripes({ className }: { className?: string }) {
  const reactId = useId();
  const id = `pole-stripes-${reactId.replace(/:/g, "")}`;
  return (
    <svg className={cn("block h-full w-full", className)} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="64" height="64" patternTransform="rotate(45)">
          <rect width="64" height="16" fill="var(--color-red)" />
          <rect y="16" width="64" height="16" fill="var(--color-cream)" />
          <rect y="32" width="64" height="16" fill="var(--color-navy)" />
          <rect y="48" width="64" height="16" fill="var(--color-cream)" />
          <animateTransform
            attributeName="patternTransform"
            type="translate"
            from="0 0"
            to="0 64"
            dur="1.8s"
            repeatCount="indefinite"
            additive="sum"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
