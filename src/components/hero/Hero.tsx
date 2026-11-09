"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PoleStage } from "@/components/hero/PoleStage";
import { Cta, Stars } from "@/components/ui/Cta";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { studio } from "@/data/business";
import { T } from "@/lib/i18n";

const vh = () => (typeof window === "undefined" ? 900 : window.innerHeight);

/**
 * The hero stays pinned while the price sheet slides up over it.
 * FEEL sits behind the 3D pole, Goods (the brush script from their flyer) crosses in front.
 */
export function Hero() {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (v) => Math.min(v / vh(), 1));
  const contentY = useTransform(progress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(progress, [0, 0.7], [1, 0]);
  const feelY = useTransform(progress, [0, 1], [0, -140]);
  const shade = useTransform(progress, [0, 1], [0, 0.75]);

  return (
    <section id="top" className="grain sticky top-0 z-0 h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      <h1 className="sr-only">
        <T en="Feel Goods Barbershop in Pittsburg, CA" es="Feel Goods Barbershop en Pittsburg, CA" />
      </h1>

      {/* warm pool of light the pole stands in */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_58%,rgb(239_75_85/0.10),transparent_70%),radial-gradient(40%_35%_at_50%_30%,rgb(244_236_220/0.07),transparent_70%)]"
      />

      {/* FEEL, behind the pole */}
      <motion.div
        aria-hidden
        style={{ y: feelY }}
        className="absolute inset-x-0 top-[calc(4.5rem+2svh)] flex justify-center motion-reduce:transform-none! lg:top-[11svh]"
      >
        <span className="block font-display text-[min(56vw,40svh)] leading-[0.78] font-black tracking-[-0.015em] text-paper uppercase lg:text-[min(37vw,60svh)]">
          Feel
        </span>
      </motion.div>

      <PoleStage className="z-10" />

      {/* Goods, in front of the pole */}
      <motion.div
        aria-hidden
        style={{ y: contentY }}
        className="pointer-events-none absolute inset-x-0 top-[41svh] z-20 flex justify-center motion-reduce:transform-none! lg:top-[47svh]"
      >
        <span className="script-stroke block translate-x-[6%] -rotate-[7deg] font-script text-[min(30vw,15svh)] leading-none text-rose-lit drop-shadow-[0_12px_24px_rgb(0_0_0/0.55)] lg:translate-x-[22%] lg:text-[min(15vw,26svh)]">
          Goods
        </span>
      </motion.div>

      {/* keeps the copy readable where it sits on the floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[46%] bg-gradient-to-t from-ink via-ink/80 to-transparent lg:h-[55%] lg:bg-transparent lg:bg-[radial-gradient(42%_62%_at_0%_100%,var(--color-ink)_30%,transparent),radial-gradient(34%_48%_at_100%_100%,var(--color-ink)_30%,transparent)]"
      />
      <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-30 bg-ink" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-0 z-40 flex flex-col gap-5 motion-reduce:transform-none! px-5 pb-[4.75rem] sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-12"
      >
        <div className="max-w-[26rem]">
          <p className="text-[0.98rem] leading-relaxed text-paper/90 text-pretty sm:text-lg">
            <T
              en="Fades, tapers, designs and hot towel shaves for the whole family in Pittsburg, CA. Walk-ins welcome."
              es="Fades, tapers, diseños y afeitado con toalla caliente para toda la familia en Pittsburg, CA. Se atiende sin cita."
            />
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Cta href={studio.bookingUrl}>
              <T en="Book with Johnny" es="Reserva con Johnny" />
            </Cta>
            <Cta href="#prices" variant="ghost" arrow={false}>
              <T en="See prices" es="Ver precios" />
            </Cta>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-paper/85 lg:items-end">
          <OpenStatus />
          <p className="flex items-center gap-2.5 text-sm tabular">
            <Stars value={studio.rating} className="text-[0.9rem] text-paper/25" />
            <span>
              {studio.rating} · <T en={`${studio.reviewCount} reviews on Booksy`} es={`${studio.reviewCount} reseñas en Booksy`} />
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
