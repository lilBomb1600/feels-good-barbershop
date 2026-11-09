// Real cuts from the shop's own photos. "back" is a second angle of the same client.
export type Category = "fades" | "designs" | "kids" | "curls" | "beards";
type Copy = { en: string; es: string };

export type Look = {
  id: string;
  front: string;
  back?: string;
  cats: Category[];
  name: Copy;
  alt: Copy;
  backAlt?: Copy;
};

export const categories: ({ id: Category | "all" } & Copy)[] = [
  { id: "all", en: "All", es: "Todos" },
  { id: "fades", en: "Fades", es: "Fades" },
  { id: "designs", en: "Designs", es: "Diseños" },
  { id: "kids", en: "Kids", es: "Niños" },
  { id: "curls", en: "Curls", es: "Rizos" },
  { id: "beards", en: "Beards", es: "Barbas" },
];

export const looks: Look[] = [
  {
    id: "key",
    front: "key-back",
    back: "key-side",
    cats: ["designs"],
    name: { en: "Greek key design, red top", es: "Diseño de greca, color rojo" },
    alt: {
      en: "Greek key pattern shaved into the side under a red dyed top, from behind",
      es: "Greca rasurada a un lado bajo el pelo pintado de rojo, vista de atrás",
    },
    backAlt: { en: "The same greek key design from the side", es: "La misma greca vista de lado" },
  },
  {
    id: "fade-mural",
    front: "fade-mural",
    cats: ["fades"],
    name: { en: "Fade with a textured top", es: "Fade con textura arriba" },
    alt: {
      en: "Fade with a textured top, the Feel Goods mural behind",
      es: "Fade con textura arriba, el mural de Feel Goods atrás",
    },
  },
  {
    id: "star-kid",
    front: "star-kid",
    cats: ["designs", "kids"],
    name: { en: "Star design", es: "Diseño de estrella" },
    alt: {
      en: "A star with lines shaved into a kid's fade",
      es: "Estrella con líneas rasurada en el fade de un niño",
    },
  },
  {
    id: "curls-bun",
    front: "curls-bun",
    back: "curls-bun-side",
    cats: ["curls"],
    name: { en: "Curls up, taper on the sides", es: "Rizos arriba, taper a los lados" },
    alt: { en: "Curly hair tied up with a taper, from behind", es: "Rizos recogidos con taper, vista de atrás" },
    backAlt: { en: "The same curly taper from the side", es: "El mismo taper con rizos visto de lado" },
  },
  {
    id: "taper-back",
    front: "taper-back",
    cats: ["fades"],
    name: { en: "Taper from the back", es: "Taper visto de atrás" },
    alt: { en: "Clean taper at the neckline, from behind", es: "Taper limpio en la nuca, vista de atrás" },
  },
  {
    id: "lines",
    front: "lines-back",
    back: "lines-side",
    cats: ["designs"],
    name: { en: "Freestyle lines", es: "Líneas a mano libre" },
    alt: {
      en: "Freestyle lines shaved under frosted curls, from behind",
      es: "Líneas a mano libre bajo rizos con mechas, vista de atrás",
    },
    backAlt: { en: "The same freestyle lines from the side", es: "Las mismas líneas vistas de lado" },
  },
  {
    id: "beard-after",
    front: "beard-after",
    cats: ["beards"],
    name: { en: "Beard shaped and lined up", es: "Barba arreglada y delineada" },
    alt: {
      en: "Full beard shaped and lined up, hair combed back",
      es: "Barba completa arreglada y delineada, pelo peinado hacia atrás",
    },
  },
  {
    id: "kid-side",
    front: "kid-side",
    cats: ["kids", "fades"],
    name: { en: "Kids taper", es: "Taper para niño" },
    alt: { en: "The barber checks a kid's taper", es: "El barbero revisa el taper de un niño" },
  },
  {
    id: "curls-back",
    front: "curls-back",
    back: "curls-side",
    cats: ["curls"],
    name: { en: "Curly top, clean taper", es: "Rizos arriba, taper limpio" },
    alt: {
      en: "Curly top with a clean taper at the neck, from behind",
      es: "Rizos arriba con taper limpio en la nuca, vista de atrás",
    },
    backAlt: { en: "The same curly top from the side", es: "Los mismos rizos vistos de lado" },
  },
  {
    id: "fade-pole",
    front: "fade-pole",
    cats: ["fades"],
    name: { en: "Fade by the pole", es: "Fade junto al poste" },
    alt: {
      en: "Fade from the side, a barber pole in the background",
      es: "Fade de lado, con el poste de barbería al fondo",
    },
  },
  {
    id: "star-zigzag",
    front: "star-zigzag",
    cats: ["designs", "kids"],
    name: { en: "Zigzag star design", es: "Estrella en zigzag" },
    alt: {
      en: "Zigzag lines and a star shaved into a kid's cut",
      es: "Líneas en zigzag y una estrella rasuradas en el corte de un niño",
    },
  },
  {
    id: "afro-taper",
    front: "afro-taper",
    cats: ["curls"],
    name: { en: "Taper on natural curls", es: "Taper con rizo natural" },
    alt: { en: "Natural curls with a taper, from behind", es: "Rizo natural con taper, vista de atrás" },
  },
  {
    id: "beard-bun",
    front: "beard-bun",
    cats: ["beards", "fades"],
    name: { en: "Beard, fade and a bun", es: "Barba, fade y chongo" },
    alt: {
      en: "Beard and fade with the hair tied back in a bun",
      es: "Barba y fade con el pelo recogido en chongo",
    },
  },
  {
    id: "taper-hand",
    front: "taper-hand",
    cats: ["fades"],
    name: { en: "Taper with length on top", es: "Taper con largo arriba" },
    alt: { en: "The barber lifts the top to show a taper", es: "El barbero levanta el pelo para mostrar el taper" },
  },
  {
    id: "kid-back",
    front: "kid-back",
    cats: ["kids", "fades"],
    name: { en: "Kids fade", es: "Fade para niño" },
    alt: {
      en: "A kid's fade from behind, in a Mexican flag cape",
      es: "Fade de niño visto de atrás, con capa de la bandera de México",
    },
  },
  {
    id: "beard-fade",
    front: "beard-fade",
    cats: ["beards", "fades"],
    name: { en: "Beard and fade", es: "Barba y fade" },
    alt: {
      en: "Beard with a fade and a textured top, from the side",
      es: "Barba con fade y textura arriba, vista de lado",
    },
  },
];
