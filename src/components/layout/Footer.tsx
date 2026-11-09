"use client";

import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { StarMark } from "@/components/ui/StarMark";
import { studio } from "@/data/business";
import { NewTab } from "@/components/ui/Cta";
import { T, useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="relative z-10 border-t border-paper/10 bg-ink pb-24 text-paper sm:pb-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-14 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-12">
        <div className="flex flex-col gap-4">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label={t({ en: "Feel Goods Barbershop, back to top", es: "Feel Goods Barbershop, volver arriba" })}
          >
            <StarMark className="h-8 w-auto text-rose-lit" />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-3xl leading-none font-black uppercase">Feel</span>
              <span className="script-stroke font-script text-3xl leading-none text-rose-lit">Goods</span>
            </span>
          </a>
          <p className="max-w-[34ch] text-mute">
            {studio.address}
            <br />
            <a href={studio.phoneHref} className="tabular hover:text-paper">
              {studio.phone}
            </a>
          </p>
        </div>

        <nav aria-label={t({ en: "Footer", es: "Pie de página" })} className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <a href="#prices" className="text-mute hover:text-paper">
            <T en="Prices" es="Precios" />
          </a>
          <a href={studio.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-mute hover:text-paper">
            <T en="Book on Booksy" es="Reserva en Booksy" />
            <NewTab />
          </a>
          <a href="#cuts" className="text-mute hover:text-paper">
            <T en="Cuts" es="Cortes" />
          </a>
          <a
            href={studio.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mute hover:text-paper"
          >
            <InstagramIcon className="size-4" />
            Instagram
            <NewTab />
          </a>
          <a href="#reviews" className="text-mute hover:text-paper">
            <T en="Reviews" es="Reseñas" />
          </a>
          <a
            href={studio.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mute hover:text-paper"
          >
            <FacebookIcon className="size-4" />
            Facebook
            <NewTab />
          </a>
          <a href="#visit" className="text-mute hover:text-paper">
            <T en="Visit" es="Visítanos" />
          </a>
        </nav>
      </div>
      <div className="mx-auto mt-12 max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="border-t border-paper/10 pt-6 text-xs leading-relaxed text-mute">
          <T
            en="Concept site by Arman Digital. Prices, hours and reviews come from the shop's Booksy page (November 2026); photos are the shop's own."
            es="Sitio de muestra hecho por Arman Digital. Los precios, el horario y las reseñas vienen de la página de Booksy de la barbería (noviembre de 2026); las fotos son de la barbería."
          />
        </p>
      </div>
    </footer>
  );
}
