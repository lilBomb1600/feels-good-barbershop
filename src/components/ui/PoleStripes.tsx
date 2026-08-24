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
 *
 * `size` is the pixel period of one full red/cream/navy/cream cycle —
 * it's independent of the element's rendered size, so a thin bar needs
 * a small size (e.g. 16) or the stripes read as one huge diagonal streak
 * instead of a fine repeating pattern. Default 64 suits the thick pole.
 *
 * `fill`: an absolutely-positioned SVG (the pole, via inset-0) needs an
 * explicit h-full/w-full or its replaced-element sizing leaves it
 * partly empty — but that same class fights any height/width passed
 * through `className` for a normally-flowed element (the divider bar).
 * So it's an opt-in default (on) rather than always-on, letting the
 * divider turn it off and size itself via className instead.
 */
export function PoleStripes({
  className,
  size = 64,
  fill = true,
}: {
  className?: string;
  size?: number;
  fill?: boolean;
}) {
  const reactId = useId();
  const id = `pole-stripes-${reactId.replace(/:/g, "")}`;
  const band = size / 4;
  return (
    <svg className={cn("block", fill && "h-full w-full", className)} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width={size} height={size} patternTransform="rotate(45)">
          <rect width={size} height={band} fill="var(--color-red)" />
          <rect y={band} width={size} height={band} fill="var(--color-cream)" />
          <rect y={band * 2} width={size} height={band} fill="var(--color-navy)" />
          <rect y={band * 3} width={size} height={band} fill="var(--color-cream)" />
          <animateTransform
            attributeName="patternTransform"
            type="translate"
            from="0 0"
            to={`0 ${size}`}
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
