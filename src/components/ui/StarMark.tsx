import { cn } from "@/lib/utils";

/** Star points as an SVG path, centered at (cx, cy). */
function star(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

/**
 * The shop's signature shaved design: a star with two lines trailing off it (see fg-108, fg-014).
 * Drawn as a double line, the way a design looks when it is cut into a fade.
 */
export function StarMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={cn("block", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={star(42, 23, 19, 7.8)} strokeWidth={2.6} />
      <path d={star(42, 23, 12.4, 5)} strokeWidth={1.6} opacity={0.75} />
      <path d="M2 17.5 H24.5 M8 27.5 H25.5" strokeWidth={2.6} />
    </svg>
  );
}
