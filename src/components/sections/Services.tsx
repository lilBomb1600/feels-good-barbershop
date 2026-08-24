import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { services } from "@/data/services";
import { studio } from "@/data/business";

export function Services() {
  return (
    <section id="services" className="relative border-b border-line bg-surface/40 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Price Board"
          title="Straightforward pricing"
          description="No upsells, no surprise fees at the chair — what it says here is what you pay."
        />

        <RevealGroup className="mt-14 overflow-hidden rounded-[1.75rem] border border-line bg-ink">
          {services.map((s, i) => (
            <RevealItem
              key={s.id}
              className={
                "flex items-center justify-between gap-6 px-6 py-6 sm:px-10 " +
                (i !== services.length - 1 ? "border-b border-line" : "")
              }
            >
              <div className="min-w-0">
                <p className="font-display text-xl uppercase tracking-wide text-cream sm:text-2xl">{s.name}</p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-cream-dim">{s.description}</p>
              </div>
              <div className="flex flex-none flex-col items-end gap-1">
                <p className="font-display text-3xl text-red-light sm:text-4xl">${s.price}</p>
                <p className="text-xs uppercase tracking-wide text-cream-dim/70">{s.duration}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-6 text-center text-sm text-cream-dim">
          Walk-ins welcome, or{" "}
          <a href={studio.bookingUrl} target="_blank" rel="noreferrer" className="font-semibold text-red-light hover:underline">
            book ahead on Booksy
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
