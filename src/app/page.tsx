import { Hero } from "@/components/hero/Hero";
import { BookCta } from "@/components/sections/BookCta";
import { Lookbook } from "@/components/sections/Lookbook";
import { Prices } from "@/components/sections/Prices";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";
import { pageMetadata } from "@/lib/seo/metadata";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo/pages";

export const metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

export default function Home() {
  return (
    <>
      {/* the hero stays pinned while the price sheet slides up over it */}
      <div className="relative">
        <Hero />
        <Prices />
      </div>
      <Lookbook />
      <Reviews />
      <Visit />
      <BookCta />
    </>
  );
}
