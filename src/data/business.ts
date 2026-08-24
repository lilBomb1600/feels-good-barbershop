export const studio = {
  name: "Feel Goods Barbershop",
  tagline: "Pittsburg's family barbershop since 2021.",
  description:
    "A family-oriented barbershop in Pittsburg, CA — fades, tapers, and hot towel shaves from a barber who treats every chair like a regular's chair.",
  address: "2 Buena Vista, Pittsburg, CA 94565",
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

export const hours = [
  { day: "Sunday", open: false, label: "Closed" },
  { day: "Monday", open: true, label: "11:00 AM–12:00 PM, 1:30–7:30 PM" },
  { day: "Tuesday", open: true, label: "11:00 AM–12:00 PM, 1:30–7:30 PM" },
  { day: "Wednesday", open: true, label: "11:00 AM–12:00 PM, 1:30–7:30 PM" },
  { day: "Thursday", open: true, label: "11:00 AM–12:00 PM, 1:30–7:30 PM" },
  { day: "Friday", open: true, label: "10:00 AM–7:00 PM" },
  { day: "Saturday", open: true, label: "1:00–7:00 PM" },
] as const;

export const amenities = [
  "Walk-ins welcome",
  "Parking on-site",
  "Wheelchair accessible",
  "Child-friendly",
  "Credit cards accepted",
  "Wi-Fi",
] as const;
