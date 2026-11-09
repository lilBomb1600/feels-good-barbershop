// Feel Goods Barbershop, Pittsburg CA. Facts here come from the shop's Booksy page and the first site.
// Unconfirmed details (a flyer with another address/handle) are listed in CONFIRM.md, not published.
export const studio = {
  name: "Feel Goods Barbershop",
  address: "2 Buena Vista, Pittsburg, CA 94565",
  street: "2 Buena Vista",
  cityLine: "Pittsburg, CA 94565",
  phone: "(925) 323-8419",
  phoneHref: "tel:+19253238419",
  instagram: "https://www.instagram.com/feelgoods_pittsburg",
  instagramHandle: "@feelgoods_pittsburg",
  facebook: "https://www.facebook.com/feelgoods.pittsburg/",
  bookingUrl: "https://booksy.com/en-us/627951_feel-goods-barbershop_barber-shop_103685_pittsburg",
  established: 2021,
  barber: "Johnny Blendz",
  rating: 4.6,
  reviewCount: 125,
  mapsUrl: "https://maps.google.com/?q=2+Buena+Vista+Pittsburg+CA+94565",
} as const;

/** Opening hours in minutes after midnight, Pacific time. Index 0 is Sunday. */
export const schedule: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [],
  [
    [660, 720],
    [810, 1170],
  ],
  [
    [660, 720],
    [810, 1170],
  ],
  [
    [660, 720],
    [810, 1170],
  ],
  [
    [660, 720],
    [810, 1170],
  ],
  [[600, 1140]],
  [[780, 1140]],
];

export const dayNames = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
} as const;

export const amenities = [
  { id: "walkins", en: "Walk-ins welcome", es: "Se atiende sin cita" },
  { id: "parking", en: "Parking on site", es: "Estacionamiento en el lugar" },
  { id: "wheelchair", en: "Wheelchair accessible", es: "Acceso para silla de ruedas" },
  { id: "kids", en: "Child-friendly", es: "Ideal para niños" },
  { id: "cards", en: "Credit cards accepted", es: "Aceptamos tarjetas de crédito" },
  { id: "wifi", en: "Wi-Fi", es: "Wi-Fi" },
] as const;
