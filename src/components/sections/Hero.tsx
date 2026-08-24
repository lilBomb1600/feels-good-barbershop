"use client";

import { ArrowUpRight, Phone, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BarberPole } from "@/components/ui/BarberPole";
import { PoleStripes } from "@/components/ui/PoleStripes";
import { Reveal } from "@/components/ui/Reveal";
import { studio } from "@/data/business";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-red/[0.12] blur-[110px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-navy/[0.25] blur-[110px]" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-light">
            <Star className="h-3.5 w-3.5 fill-red-light text-red-light" />
            {studio.rating}★ · {studio.reviewCount} reviews on Booksy
          </span>

          <h1 className="font-display text-balance text-5xl uppercase leading-[0.95] tracking-wide text-cream sm:text-7xl">
            Feel Goods
            <br />
            <span className="text-red-light text-glow">Barbershop</span>
          </h1>

          <p className="mt-5 font-script text-3xl leading-none text-cream-dim sm:text-4xl">
            Pittsburg&rsquo;s family barbershop since {studio.established}.
          </p>

          <p className="mt-6 max-w-lg text-balance leading-relaxed text-cream-dim">
            Fades, tapers, and hot towel shaves from {studio.barber} — the kind of shop where the barber
            remembers how you like it before you sit down.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={studio.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="shine-btn group flex items-center gap-2 rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-cream shadow-[0_8px_28px_-6px_rgba(179,39,44,0.6)] transition-all hover:-translate-y-1 hover:bg-red-light hover:shadow-[0_12px_36px_-6px_rgba(179,39,44,0.8)]"
            >
              Book Now
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={studio.phoneHref}
              className="flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-cream/40"
            >
              <Phone className="h-4 w-4 text-red-light" />
              {studio.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="hidden justify-self-center lg:block">
          <BarberPole className="h-96 w-16" capClassName="h-2.5" />
        </Reveal>
      </Container>

      <PoleStripes className="mt-16 h-3 w-full opacity-90" size={16} fill={false} />
    </section>
  );
}
