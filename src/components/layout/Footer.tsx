import { MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { Container } from "@/components/ui/Container";
import { BarberPole } from "@/components/ui/BarberPole";
import { studio } from "@/data/business";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <Container className="flex flex-col items-start justify-between gap-8 py-14 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <BarberPole className="h-14 w-4" />
          <div>
            <p className="font-display text-xl uppercase tracking-wide text-cream">{studio.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream-dim">{studio.tagline}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm text-cream-dim">
          <a href={studio.phoneHref} className="flex items-center gap-2 hover:text-cream">
            <Phone className="h-4 w-4 text-red-light" />
            {studio.phone}
          </a>
          <a href={studio.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cream">
            <MapPin className="h-4 w-4 text-red-light" />
            {studio.address}
          </a>
          <a href={studio.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cream">
            <InstagramIcon className="h-4 w-4 text-red-light" />
            {studio.instagramHandle}
          </a>
          <a href={studio.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cream">
            <FacebookIcon className="h-4 w-4 text-red-light" />
            Facebook
          </a>
        </div>
      </Container>
      <Container className="border-t border-line py-6">
        <p className="text-xs text-cream-dim/70">© {new Date().getFullYear()} {studio.name}. All rights reserved.</p>
      </Container>
    </footer>
  );
}
