"use client";

import { useSyncExternalStore } from "react";
import { pacificNow } from "@/lib/hours";

/*
 * Client-only values read through useSyncExternalStore: the server renders a neutral snapshot,
 * the client swaps in the real one right after hydration, with no hydration mismatch and no
 * setState-in-effect cascade.
 */

const noop = () => () => {};

/** Minute clock, so "open now" and "today" stay right while the page sits open. */
let minute = 0;
const minuteListeners = new Set<() => void>();
let minuteTimer: number | undefined;
function subscribeMinute(cb: () => void) {
  minuteListeners.add(cb);
  if (minuteTimer === undefined) {
    minuteTimer = window.setInterval(() => {
      minute = Math.floor(Date.now() / 60_000);
      minuteListeners.forEach((l) => l());
    }, 15_000);
  }
  return () => {
    minuteListeners.delete(cb);
    if (!minuteListeners.size && minuteTimer !== undefined) {
      window.clearInterval(minuteTimer);
      minuteTimer = undefined;
    }
  };
}
function getMinute() {
  if (!minute) minute = Math.floor(Date.now() / 60_000);
  return minute;
}

/** Current minute (epoch minutes) on the client, null during SSR. */
export function useMinute(): number | null {
  return useSyncExternalStore(subscribeMinute, getMinute, () => null);
}

/** Today's weekday in Pittsburg (0 = Sunday), null during SSR. */
export function usePacificDay(): number | null {
  const m = useMinute();
  return m === null ? null : pacificNow(new Date(m * 60_000)).day;
}

/** Reads a value once on the client; null on the server. */
export function useClientValue<T>(read: () => T): T | null {
  return useSyncExternalStore(noop, read, () => null);
}
