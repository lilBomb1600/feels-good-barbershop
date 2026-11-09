export type Review = {
  name: string;
  service: string;
  quote: string;
  /** month the review was left, YYYY-MM; shown as "Mar 2026" / "mar 2026" */
  date: string;
};

// Real client reviews from Feel Goods Barbershop's Booksy page (4.6, 134 reviews on 2026-11-09).
export const reviews: Review[] = [
  {
    name: "Grecia",
    service: "Kids",
    quote:
      "I can't say enough great things about this barber. Not only does he consistently do an amazing job cutting my son's hair, but he goes above and beyond.",
    date: "2026-03",
  },
  {
    name: "Rich",
    service: "Adults",
    quote: "Did a great job on my cut! I would highly recommend to anyone.",
    date: "2026-07",
  },
  {
    name: "Kevin",
    service: "Hot Towel Shave",
    quote: "Always a fire cut, great experience.",
    date: "2026-04",
  },
  {
    name: "James",
    service: "Kids",
    quote: "Johnny always does a great job cutting my son's hair. Go book with him!",
    date: "2026-08",
  },
  {
    name: "Anita",
    service: "Adults",
    quote: "Barber was punctual. Did a great job cutting my hair, gave me what I asked for. I will return.",
    date: "2026-02",
  },
  {
    name: "Julianna",
    service: "Kids",
    quote: "Amazing job on my little brother's mullet.",
    date: "2026-04",
  },
];
