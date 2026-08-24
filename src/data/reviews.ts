export type Review = {
  name: string;
  service: string;
  quote: string;
  date: string;
};

// Real client reviews from Feel Goods Barbershop's Booksy page (4.6★, 125 reviews).
export const reviews: Review[] = [
  {
    name: "Grecia",
    service: "Kids",
    quote:
      "I can't say enough great things about this barber. Not only does he consistently do an amazing job cutting my son's hair, but he goes above and beyond.",
    date: "Mar 2026",
  },
  {
    name: "Rich",
    service: "Adults",
    quote: "Did a great job on my cut! I would highly recommend to anyone.",
    date: "Jul 2026",
  },
  {
    name: "Kevin",
    service: "Hot Towel Shave",
    quote: "Always a fire cut, great experience.",
    date: "Apr 2026",
  },
  {
    name: "James",
    service: "Kids",
    quote: "Johnny always does a great job cutting my son's hair. Go book with him!",
    date: "Aug 2026",
  },
  {
    name: "Anita",
    service: "Adults",
    quote: "Barber was punctual. Did a great job cutting my hair, gave me what I asked for. I will return.",
    date: "Feb 2026",
  },
  {
    name: "Julianna",
    service: "Kids",
    quote: "Amazing job on my little brother's mullet.",
    date: "Apr 2026",
  },
];
