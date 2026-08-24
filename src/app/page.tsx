import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Reviews />
      <Visit />
    </>
  );
}
