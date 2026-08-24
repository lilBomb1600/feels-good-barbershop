import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { hours, studio } from "@/data/business";

export function Visit() {
  return (
    <section id="visit" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/[0.08] blur-[120px]" />
      <Container>
        <Reveal>
          <div className="rounded-[2.5rem] border border-line bg-gradient-to-b from-surface to-surface-light p-10 shadow-[0_40px_100px_-30px_rgba(179,39,44,0.25)] sm:p-16">
            <SectionHeading
              eyebrow="Come Sit Down"
              title="Walk-ins welcome"
              description="No appointment needed — but if you'd rather lock in a time, booking online takes 30 seconds."
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={studio.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-line bg-ink px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-light/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red/10 text-red-light">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-cream-dim">Address</p>
                      <p className="font-display text-base uppercase tracking-wide text-cream">{studio.address}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-cream-dim transition-colors group-hover:text-red-light" />
                </a>

                <a
                  href={studio.phoneHref}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-ink px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-light/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red/10 text-red-light">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-cream-dim">Call or walk in</p>
                      <p className="font-display text-lg text-cream">{studio.phone}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-cream-dim transition-colors group-hover:text-red-light" />
                </a>

                <a
                  href={studio.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shine-btn group sm:col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-red px-6 py-5 text-sm font-semibold text-cream shadow-[0_10px_32px_-8px_rgba(179,39,44,0.6)] transition-all hover:-translate-y-1 hover:bg-red-light"
                >
                  Book on Booksy
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <div className="rounded-2xl border border-line bg-ink p-6 sm:min-w-[300px]">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-light">
                  <Clock className="h-3.5 w-3.5" />
                  Hours
                </p>
                <ul className="space-y-2.5 text-sm">
                  {hours.map((h) => (
                    <li key={h.day} className="flex items-baseline justify-between gap-4">
                      <span className="text-cream-dim">{h.day}</span>
                      <span className={h.open ? "text-right text-cream" : "text-cream-dim/60"}>{h.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
