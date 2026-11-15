/**
 * ADAPT ME: the only kit file you edit per project.
 *
 * Facts come from src/data/business.ts only. CONFIRM.md still has open owner questions, so the JSON-LD leaves them out:
 * - Address (flyer says 1379 Buchanan Rd, Booksy says 2 Buena Vista): city + state only until the owner confirms.
 * - Instagram handle (@feelgoods_pittsburg vs @feelgoods_barbershop): not in sameAs until confirmed.
 * - Hours (Booksy vs the first site's lunch split): no openingHoursSpecification until confirmed.
 * - Rating/review count: never in JSON-LD (self-serving stars, LAUNCH-STANDARD.md B5).
 */
import { studio } from "@/data/business";
import type { BusinessFacts, Locale, OgImage, PageEntry, ServiceFact } from "./types";

/** business.ts has no site URL; the preview lives on feels-good-barbershop.vercel.app (note: "feels-good", not the folder name). */
export const FALLBACK_URL: string = "https://feels-good-barbershop.vercel.app";

/** EN/ES is a JavaScript toggle on one URL, so it's one indexable language and no hreflang. */
export const LOCALES: Locale[] = ["en"];
export const DEFAULT_LOCALE: Locale = "en";

/** public/og.jpg: the shop's own lookbook photos (key-back, fade-mural, star-kid), side by side. */
export const OG_IMAGE: OgImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Three Feel Goods cuts: a greek key design under a red top, a fade by the Feel Goods mural, and a star design on a kid's fade",
};

/** "Pittsburg, CA 94565" -> "Pittsburg", "CA" (from studio.cityLine; no street until CONFIRM.md item 1 is answered). */
const [city, stateZip] = studio.cityLine.split(",").map((part) => part.trim());
const region = stateZip.split(/\s+/)[0];

export const facts: BusinessFacts = {
  name: studio.name,
  // Barbers are HairSalon: schema.org has no BarberShop type (LAUNCH-STANDARD.md B5).
  type: "HairSalon",
  telephone: studio.phoneHref.replace(/^tel:/, ""),
  address: { locality: city, region },
  serviceArea: [`${city}, ${region}`],
  image: [OG_IMAGE.url],
  sameAs: [studio.facebook, studio.bookingUrl],
};

/** The Booksy menu is priced by who's in the chair (Adults, Seniors, Kids), not named services, so no Service nodes. */
export const services: ServiceFact[] = [];

/** Every indexable URL (one page). */
export const pages: PageEntry[] = [{ path: "/" }];
