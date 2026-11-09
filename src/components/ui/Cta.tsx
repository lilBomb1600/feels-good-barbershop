import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const styles = {
  rose: "bg-rose text-paper hover:bg-rose-deep shadow-[0_10px_30px_-8px_rgb(200_32_47/0.65)]",
  ghost: "border border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/[0.06]",
  ink: "bg-ink text-paper hover:bg-ink-3 shadow-[0_10px_30px_-10px_rgb(15_11_10/0.6)]",
  paper: "bg-paper text-ink hover:bg-paper-2 shadow-[0_12px_32px_-10px_rgb(0_0_0/0.55)]",
  ghostInk: "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/[0.04]",
};

/** Pill link. External links open in a new tab and say so to screen readers. */
export function Cta({
  href,
  children,
  variant = "rose",
  size = "md",
  arrow = true,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  const ext = external ?? href.startsWith("http");
  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98]",
        size === "md" ? "h-12 px-5 text-[0.92rem] sm:px-6 sm:text-[0.95rem]" : "h-14 px-8 text-base sm:h-16 sm:px-10 sm:text-lg",
        styles[variant],
        className,
      )}
    >
      {children}
      {arrow ? (
        <ArrowUpRight
          aria-hidden
          className="size-[1.1em] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : null}
      {ext ? <NewTab /> : null}
    </a>
  );
}

/** Screen-reader note for links that open a new tab, in the visitor's language. */
export function NewTab() {
  return (
    <span className="sr-only">
      <T en=" (opens in a new tab)" es=" (se abre en una pestaña nueva)" />
    </span>
  );
}

/** Five stars filled to a rating (4.6 fills 92%). Drawn, not glyphs. */
export function Stars({
  value,
  className,
  fillClass = "text-rose-lit",
}: {
  value: number;
  className?: string;
  fillClass?: string;
}) {
  const pct = `${(value / 5) * 100}%`;
  const row = (fill: string) => (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-[1em] shrink-0" aria-hidden>
          <path
            d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L10 15.1 4.6 18.1l1.2-6.1L1.3 7.8l6.1-.7z"
            fill={fill}
          />
        </svg>
      ))}
    </span>
  );
  return (
    <span className={cn("relative inline-flex", className)}>
      <span className="sr-only">
        <T en={`${value} out of 5 stars`} es={`${value} de 5 estrellas`} />
      </span>
      <span aria-hidden className="inline-flex">
        {row("currentColor")}
        <span className={cn("absolute inset-y-0 left-0 overflow-hidden", fillClass)} style={{ width: pct }}>
          {row("currentColor")}
        </span>
      </span>
    </span>
  );
}
