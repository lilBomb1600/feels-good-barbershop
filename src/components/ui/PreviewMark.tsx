"use client";

import { useEffect, type CSSProperties } from "react";

/**
 * The preview watermark: "ARMAN DIGITAL · PREVIEW" tiled across every screen, plus a contact tag. It stays until the
 * site is paid for: set NEXT_PUBLIC_LICENSED=true in Vercel and redeploy to remove it.
 * If someone deletes or hides it in the browser's inspector, it puts itself back.
 */
const licensed = process.env.NEXT_PUBLIC_LICENSED === "true";

const tile =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260">` +
      `<text x="210" y="130" text-anchor="middle" dominant-baseline="middle" transform="rotate(-24 210 130)" ` +
      `font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="26" letter-spacing="3" ` +
      `fill="rgba(244,236,220,0.10)" stroke="rgba(15,11,10,0.18)" stroke-width="1">ARMAN DIGITAL · PREVIEW</text></svg>`,
  );

const LAYER: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 2147483646,
  pointerEvents: "none",
  userSelect: "none",
  display: "block",
  visibility: "visible",
  opacity: 1,
  backgroundImage: `url("${tile}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "420px 260px",
};
const SHOWN: CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: "14px",
  transform: "translateX(-50%)",
  display: "flex",
  visibility: "visible",
  opacity: 1,
  zIndex: 2147483647,
};

/** The same declarations as an inline style string, each !important so no stylesheet can override them. */
const css = (s: CSSProperties) =>
  Object.entries(s)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}:${v} !important`)
    .join(";");
const LAYER_CSS = css(LAYER);
const SHOWN_CSS = css(SHOWN);
// Both languages ride along (html[data-lang] shows one); "Concept by" drops on small phones so the number always fits.
const TAG_HTML =
  '<b><i data-l="en">Preview</i><i data-l="es">Muestra</i></b>' +
  '<span><i class="pt-by" data-l="en">Concept by </i><i class="pt-by" data-l="es">Diseño de </i>Arman Digital · (925) 252-6347</span>';

function restore() {
  let layer = document.querySelector<HTMLElement>("[data-preview-mark]");
  if (!layer) {
    layer = document.createElement("div");
    layer.setAttribute("data-preview-mark", "");
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
  }
  if (layer.getAttribute("style") !== LAYER_CSS) layer.setAttribute("style", LAYER_CSS);

  let tag = document.querySelector<HTMLAnchorElement>("[data-preview-tag]");
  if (!tag || tag.innerHTML !== TAG_HTML || !tag.classList.contains("preview-tag")) {
    tag?.remove();
    tag = document.createElement("a");
    tag.setAttribute("data-preview-tag", "");
    tag.href = "tel:+19252526347";
    tag.className = "preview-tag";
    tag.innerHTML = TAG_HTML;
    document.body.appendChild(tag);
  }
  if (tag.getAttribute("style") !== SHOWN_CSS) tag.setAttribute("style", SHOWN_CSS);
}

export function PreviewMark() {
  useEffect(() => {
    if (licensed) return;
    restore();
    const id = window.setInterval(restore, 800);
    const mo = new MutationObserver(restore);
    mo.observe(document.body, { childList: true });
    return () => {
      window.clearInterval(id);
      mo.disconnect();
    };
  }, []);

  if (licensed) return null;
  return (
    <>
      <div data-preview-mark="" aria-hidden="true" style={LAYER} />
      <a
        data-preview-tag=""
        href="tel:+19252526347"
        className="preview-tag"
        style={SHOWN}
        dangerouslySetInnerHTML={{ __html: TAG_HTML }}
      />
    </>
  );
}
