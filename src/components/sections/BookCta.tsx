"use client";

import { Phone } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import { Photo } from "@/components/ui/Photo";
import { studio } from "@/data/business";
import { T, useT } from "@/lib/i18n";

/** The close: back on the rose cape the page opened under, with the barber in a mirror. */
export function BookCta() {
  const t = useT();
  return (
    <section id="book" className="relative z-10 overflow-hidden bg-[#2a0a0e]" aria-labelledby="book-title">
      <div aria-hidden className="cape-fabric absolute inset-0 w-full" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,rgb(15_11_10/0.92)_0%,rgb(15_11_10/0.78)_45%,rgb(15_11_10/0.35)_100%)]"
      />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-7">
          <h2
            id="book-title"
            className="text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] font-light tracking-[-0.035em] text-balance text-paper"
          >
            <T
              en={
                <>
                  Ready when <strong className="font-extrabold">you are.</strong>
                </>
              }
              es={
                <>
                  Listos cuando <strong className="font-extrabold">tú quieras.</strong>
                </>
              }
            />
          </h2>
          <p className="mt-5 max-w-[38ch] text-lg leading-relaxed text-paper/85">
            <T
              en="Pick a time with Johnny on Booksy, or call the shop."
              es="Escoge tu hora con Johnny en Booksy, o llama a la barbería."
            />
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Cta href={studio.bookingUrl} variant="paper" size="lg">
              <T en="Book on Booksy" es="Reserva en Booksy" />
            </Cta>
            <a
              href={studio.phoneHref}
              className="inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-paper underline decoration-paper/40 underline-offset-[6px] transition-colors hover:decoration-paper"
            >
              <Phone aria-hidden className="size-5" />
              <T en="Call" es="Llama al" /> <span className="tabular">{studio.phone}</span>
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          {/* the barber's mirror: an oval frame with a chrome edge */}
          <div className="relative w-[min(17rem,70vw)] lg:w-[19rem]">
            <div className="rounded-[50%] bg-[linear-gradient(145deg,#f4f1ea,#8f8a84_40%,#f4f1ea_55%,#6f6a64)] p-[7px] shadow-[0_40px_70px_-25px_rgb(0_0_0/0.85)]">
              <div className="aspect-[3/4] overflow-hidden rounded-[50%] bg-ink">
                <Photo
                  id="barber"
                  alt={t({
                    en: "Feel Goods barber smiling at his chair, the barber pole behind him",
                    es: "El barbero de Feel Goods sonriendo en su silla, con el poste de barbería atrás",
                  })}
                  sizes="(min-width: 1024px) 304px, 70vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
