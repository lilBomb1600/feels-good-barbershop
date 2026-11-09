import manifest from "./photo-manifest.json";

type Entry = { src: string; dir: string; w: number; h: number; widths: number[] };
const photos = manifest as Record<string, Entry>;

/** Responsive sources for a pipeline photo (see scripts/photos.py). */
export function photo(id: string) {
  const p = photos[id];
  if (!p) throw new Error(`Unknown photo: ${id}`);
  const url = (w: number) => `/images/${p.dir}/${id}-${w}.webp`;
  return {
    src: url(p.widths[0]),
    srcSet: p.widths.map((w) => `${url(w)} ${w}w`).join(", "),
    width: p.w,
    height: p.h,
    largest: url(p.widths[p.widths.length - 1]),
    url,
    widths: p.widths,
  };
}
