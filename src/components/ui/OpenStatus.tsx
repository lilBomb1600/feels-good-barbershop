"use client";

import { openStatus, type OpenStatus as Status } from "@/lib/hours";
import { useMinute } from "@/lib/client-stores";
import { cn } from "@/lib/utils";

/** The live status in both languages, from the real hours in Pacific time. Null until hydration. */
function useOpenStatus(): { en: Status; es: Status } | null {
  const minute = useMinute();
  if (minute === null) return null;
  const now = new Date(minute * 60_000);
  return { en: openStatus("en", now), es: openStatus("es", now) };
}

/** Server HTML reserves the space with an invisible stand-in; the client fills it after hydration. */
const STAND_IN = { word: "Closed", detail: "opens tomorrow at 11:00 AM" };

function Both({ en, es }: { en: string; es: string }) {
  return (
    <>
      <span data-l="en" lang="en">
        {en}
      </span>
      <span data-l="es" lang="es">
        {es}
      </span>
    </>
  );
}

/**
 * The hero's shop-window neon: "Open" lights up in rose tube when the shop is open,
 * and sits there unlit, glass-grey, when it's closed. The next opening is written beside it.
 */
export function NeonSign({ className }: { className?: string }) {
  const s = useOpenStatus();
  return (
    <p className={cn("neon-sign", !s && "invisible", className)} data-lit={s ? String(s.en.open) : "false"}>
      <span className="neon-tube">{s ? <Both en={s.en.word} es={s.es.word} /> : STAND_IN.word}</span>
      <span className="sr-only">: </span>
      <span className="neon-detail">{s ? <Both en={s.en.detail} es={s.es.detail} /> : STAND_IN.detail}</span>
    </p>
  );
}

/** The card that hangs on the shop door, turned to Open or Closed. */
export function DoorSign({ className }: { className?: string }) {
  const s = useOpenStatus();
  return (
    <div className={cn("door-sign", className)} data-open={s ? String(s.en.open) : "false"}>
      <svg aria-hidden viewBox="0 0 200 46" className="door-sign-strings" preserveAspectRatio="none">
        <path d="M100 4 L22 44 M100 4 L178 44" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="4" r="3.5" fill="currentColor" />
      </svg>
      <p className={cn("door-sign-card", !s && "invisible")}>
        <span className="door-sign-word">{s ? <Both en={s.en.word} es={s.es.word} /> : STAND_IN.word}</span>
        <span className="sr-only">: </span>
        <span className="door-sign-detail">{s ? <Both en={s.en.detail} es={s.es.detail} /> : STAND_IN.detail}</span>
      </p>
    </div>
  );
}
