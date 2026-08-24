import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { reviews } from "@/data/reviews";
import { studio } from "@/data/business";

export function Reviews() {
  return (
    <section id="reviews" className="relative border-b border-line bg-surface/40 py-24 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Word Around The Shop" title="What regulars say" />
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink px-5 py-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-red-light text-red-light" />
              ))}
            </div>
            <div className="text-sm text-cream-dim">
              <span className="font-display text-xl text-cream">{studio.rating}</span> / 5 · {studio.reviewCount} reviews
            </div>
          </div>
        </div>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <RevealItem
              key={r.name + r.date}
              className="flex flex-col justify-between rounded-2xl border border-line bg-ink p-6 transition-colors hover:border-red-light/40"
            >
              <div>
                <Quote className="h-6 w-6 text-red-light/60" />
                <p className="mt-3 text-balance leading-relaxed text-cream">&ldquo;{r.quote}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="font-semibold text-cream">{r.name}</span>
                <span className="text-cream-dim">{r.service}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
