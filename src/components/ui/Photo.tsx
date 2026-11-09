import { photo } from "@/data/photos";
import { cn } from "@/lib/utils";

/**
 * A pipeline photo (scripts/photos.py): responsive WebP, intrinsic size set so nothing shifts,
 * lazy by default. The parent controls the box; the image covers it.
 */
export function Photo({
  id,
  alt,
  sizes,
  className,
  eager = false,
  draggable,
}: {
  id: string;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
  draggable?: boolean;
}) {
  const p = photo(id);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.src}
      srcSet={p.srcSet}
      sizes={sizes}
      width={p.width}
      height={p.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={draggable}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
