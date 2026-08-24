import { Users, Wallet, Wifi, Accessibility, Car, Baby } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { studio, amenities } from "@/data/business";

const amenityIcons = [Users, Car, Accessibility, Baby, Wallet, Wifi];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden border-b border-line py-24 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="The Shop" title={`Family-run since ${studio.established}`} />
          <p className="mt-6 max-w-lg text-balance leading-relaxed text-cream-dim">
            Feel Goods opened in {studio.established} as a family-oriented barbershop — the kind of place
            where the same kids grow up in the same chair for years. {studio.barber} handles the cuts, from
            first-haircut toddlers to weekly regulars, with a shop that&rsquo;s built for the whole family, not
            just one crowd.
          </p>
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-5">
            <span className="badge-ring flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-lg text-cream">
              {studio.established}
            </span>
            <div>
              <p className="font-display text-lg uppercase tracking-wide text-cream">Established {studio.established}</p>
              <p className="text-sm text-cream-dim">Pittsburg, CA</p>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-4">
          {amenities.map((a, i) => {
            const Icon = amenityIcons[i % amenityIcons.length];
            return (
              <RevealItem
                key={a}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-red-light/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10 text-red-light">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-cream">{a}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
