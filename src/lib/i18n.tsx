"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

export type Lang = "en" | "es";
export type Copy = { en: string; es: string };

export const LANG_KEY = "fg-lang";
const EVENT = "fg-lang-change";

/*
 * The language lives on <html data-lang>. The inline head script sets it from localStorage before
 * first paint, CSS shows the matching text, and this store lets components read it for attributes.
 */
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const getLang = (): Lang => (document.documentElement.dataset.lang === "es" ? "es" : "en");

export function setLang(l: Lang) {
  const html = document.documentElement;
  html.dataset.lang = l;
  html.lang = l;
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {
    /* private mode: the toggle still works for this page view */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getLang, () => "en" as Lang);
  return { lang, setLang: useCallback((l: Lang) => setLang(l), []) };
}

/** App-wide client config: framer-motion follows the visitor's reduced-motion setting everywhere. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Both languages in the markup; CSS shows the one html[data-lang] asks for, so there is no flash. */
export function T({ en, es }: { en: ReactNode; es: ReactNode }) {
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

/** For attributes (alt, aria-label), which CSS can't switch. */
export function useT() {
  const { lang } = useLang();
  return (c: Copy) => c[lang];
}
