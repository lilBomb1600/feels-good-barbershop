export type Service = {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "adults",
    name: "Adults",
    price: 50,
    duration: "1 hr",
    description: "Full haircut, tailored to how you actually want to look — not just a number on a clipper guard.",
  },
  {
    id: "seniors",
    name: "Seniors",
    price: 40,
    duration: "1 hr",
    description: "Same full-service cut, senior pricing.",
  },
  {
    id: "kids",
    name: "Kids",
    price: 40,
    duration: "1 hr",
    description: "Patient, easygoing cuts for younger clients — a shop regulars bring their whole family to.",
  },
  {
    id: "hot-towel",
    name: "Hot Towel Exfoliation Facial / Shave",
    price: 30,
    duration: "30 min",
    description: "A proper hot towel shave and facial exfoliation — the old-school barbershop finish.",
  },
];
