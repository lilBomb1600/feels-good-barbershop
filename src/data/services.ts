// Prices and durations from the shop's Booksy menu. Photos are the shop's own, rose-graded.
export type Service = {
  id: string;
  name: { en: string; es: string };
  /** only where it adds a fact the name doesn't already say */
  note?: { en: string; es: string };
  price: number;
  duration: { en: string; es: string };
  photo: string;
  photoAlt: { en: string; es: string };
};

export const services: Service[] = [
  {
    id: "adults",
    name: { en: "Adults", es: "Adultos" },
    price: 50,
    duration: { en: "1 hr", es: "1 h" },
    photo: "price-adults",
    photoAlt: {
      en: "Back of a fresh taper in front of the Feel Goods mural",
      es: "Taper recién hecho frente al mural de Feel Goods",
    },
  },
  {
    id: "seniors",
    name: { en: "Seniors", es: "Adultos mayores" },
    price: 40,
    duration: { en: "1 hr", es: "1 h" },
    photo: "price-seniors",
    photoAlt: {
      en: "A barber chair under a striped cape",
      es: "Silla de barbero cubierta con una capa a rayas",
    },
  },
  {
    id: "kids",
    name: { en: "Kids", es: "Niños" },
    price: 40,
    duration: { en: "1 hr", es: "1 h" },
    photo: "price-kids",
    photoAlt: {
      en: "A kid's fade being finished in a rose cape",
      es: "Fade de niño con capa de rosas",
    },
  },
  {
    id: "hot-towel",
    name: { en: "Hot towel facial / shave", es: "Facial / afeitado con toalla caliente" },
    note: {
      en: "Hot towel exfoliation facial or shave.",
      es: "Facial exfoliante o afeitado con toalla caliente.",
    },
    price: 30,
    duration: { en: "30 min", es: "30 min" },
    photo: "price-towel",
    photoAlt: {
      en: "A client leaned back in the chair for a shave",
      es: "Cliente recostado en la silla para un afeitado",
    },
  },
];
