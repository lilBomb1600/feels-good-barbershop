import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Line = { main: string; accent: string };

/**
 * Section headings in the shop's own lettering: the condensed block caps of the sign,
 * then one brush-script phrase underneath, the way their flyer pairs "FEEL" with "Goods".
 */
export function Heading({
  id,
  en,
  es,
  tone = "ink",
  align = "left",
  className,
}: {
  id: string;
  en: Line;
  es: Line;
  /** the ground it sits on: "ink" for dark sections, "paper" for light ones */
  tone?: "ink" | "paper";
  align?: "left" | "center";
  className?: string;
}) {
  const line = (l: Line) => (
    <>
      <span className="block">{l.main}</span>
      <span className={cn("block", align === "left" && "pl-[0.5em]")}>
        <span
          className={cn(
            "-mt-[0.06em] inline-block -rotate-[3.5deg] font-script text-[1.02em] leading-[0.95] font-normal tracking-normal normal-case",
            tone === "ink" ? "text-rose-lit" : "text-rose",
          )}
        >
          {l.accent}
        </span>
      </span>
    </>
  );
  return (
    <h2
      id={id}
      className={cn(
        "font-display text-[clamp(2.9rem,8.4vw,6rem)] leading-[0.86] font-black tracking-[-0.005em] uppercase",
        align === "center" && "text-center",
        className,
      )}
    >
      <T en={line(en)} es={line(es)} />
    </h2>
  );
}
