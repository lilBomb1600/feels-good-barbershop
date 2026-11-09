"use client";

import { openStatus } from "@/lib/hours";
import { useMinute } from "@/lib/client-stores";
import { cn } from "@/lib/utils";

/**
 * Live "open now / next opening" line from the real hours, in Pacific time.
 * Server HTML reserves the line's space; the client fills it after hydration and keeps it current.
 */
export function OpenStatus({ className, tone = "ink" }: { className?: string; tone?: "ink" | "paper" }) {
  const minute = useMinute();
  const now = minute === null ? null : new Date(minute * 60_000);
  const en = now ? openStatus("en", now) : null;
  const es = now ? openStatus("es", now) : null;
  const open = en?.open ?? false;

  return (
    <p className={cn("flex min-h-[1.5em] items-center gap-2.5 text-sm tabular", className)}>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex size-2.5 shrink-0 rounded-full",
          en ? (open ? "bg-[#3fbf6f]" : tone === "ink" ? "bg-rose-lit" : "bg-rose") : "bg-transparent",
        )}
      >
        {open ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3fbf6f] opacity-60 motion-reduce:hidden" />
        ) : null}
      </span>
      {en && es ? (
        <>
          <span data-l="en" lang="en">
            {en.text}
          </span>
          <span data-l="es" lang="es">
            {es.text}
          </span>
        </>
      ) : (
        <span className="opacity-0" aria-hidden>
          Open now · closes at 7:30 PM
        </span>
      )}
    </p>
  );
}
